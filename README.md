# Express User Auth Boilerplate

This aims to be as simple as possible to get off the ground with User authentication, Admin dashboard and protected routes.

Requires Node.js 24 or newer.

### Features

- User Login/Register with Passport Local Strategy
- Admin Dashboard
- Flash Messages
- SQLite Database using the built-in `node:sqlite` module, with sessions stored in SQLite
- SCSS support with Bootstrap 5
- Winston Logging
- Protected Routes w/ Middleware

### Future Additions

- About Page

### Extras
To automatically compile SCSS files. Run ```npm run sass```

Example ```.env``` file.

```
PORT=3000
DB_PATH=./data/app.db
```

The SQLite database and its directory are created automatically on first run. Delete the database file to reset the app.
