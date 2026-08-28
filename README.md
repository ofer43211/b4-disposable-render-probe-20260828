# B4 disposable Render probe

Independent, non-production probe for measuring Render deploy-time health checks while Maintenance Mode remains enabled.

- GET / returns HTTP 200.
- GET /health returns HTTP 200 and logs timestamp, release marker, Host header, and instance identifier when available.
- Version A marker: VERSION_A_20260828.
- No RoTEM source, configuration, credentials, data, services, or DNS are used.