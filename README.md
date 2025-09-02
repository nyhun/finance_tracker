# finance_tracker

A simple finance tracker built with React, Express.js and SQLite.

## Running the app

```bash
docker compose up
```

Frontend will be available at http://localhost:5173
Backend will be available at http://localhost:3001

## Notes
Ideally backend and frontend would be TS with shared types.
Backend tests use same db as main app, this should be refactored to use a separate test db.
Docker setup is basic -- should be moved to dockerfile, with proper structure for caching build stages and image size optimization.