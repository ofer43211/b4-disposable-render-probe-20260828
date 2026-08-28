"use strict";

const http = require("node:http");
const os = require("node:os");

const port = Number.parseInt(process.env.PORT || "10000", 10);
const release = process.env.RELEASE_MARKER || "VERSION_A_UNSET";
const instance = process.env.RENDER_INSTANCE_ID || process.env.RENDER_SERVICE_ID || process.env.HOSTNAME || os.hostname() || "unavailable";

function send(res, status, body) {
  const payload = Buffer.from(body, "utf8");
  res.writeHead(status, {
    "content-type": "text/plain; charset=utf-8",
    "content-length": String(payload.length),
    "cache-control": "no-store",
    "x-b4-release": release,
  });
  res.end(payload);
}

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    console.log(JSON.stringify({
      event: "health_hit",
      timestamp: new Date().toISOString(),
      release,
      host: req.headers.host || "",
      instance,
    }));
    send(res, 200, "ok release=" + release + " instance=" + instance + "\n");
    return;
  }
  if (req.url === "/") {
    send(res, 200, "b4 disposable render probe release=" + release + "\n");
    return;
  }
  send(res, 404, "not found\n");
});

server.listen(port, "0.0.0.0", () => {
  console.log(JSON.stringify({
    event: "probe_started",
    timestamp: new Date().toISOString(),
    release,
    instance,
    port,
  }));
});