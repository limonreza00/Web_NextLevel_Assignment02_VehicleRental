# NextLevel - Vehicle Rental API

A simple TypeScript + Express REST API for managing users, vehicles and bookings. Designed as an educational starter project with role-based authorization (admin, customer) and JWT authentication.

---

## Features

- User registration and JWT authentication
- Role-based authorization: `admin` and `customer`
- Vehicle management (CRUD operations)
- Booking flow: customers create bookings; admins view and manage all bookings
- Server-side ownership checks (customers only access their own bookings/profiles)

## Tech stack

- Node.js
- TypeScript
- Express
- PostgreSQL (`pg`)
- JWT for authentication

## Repository layout

- `src/server.ts` — application entry
- `src/config` — configuration and DB initialization
- `src/middleware` — auth & logging middleware
- `src/module/auth` — signup / signin
- `src/module/users` — user endpoints
- `src/module/vehicles` — vehicle endpoints
- `src/module/bookings` — booking endpoints

## Requirements

- Node.js 18+ (recommended)
- PostgreSQL database (local, Neon, Heroku, etc.)

## Environment

Create a `.env` file at repository root with the following variables:

```
PORT=5000
DB_CONNECTION_STRING=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
JWT_SECRET=your_jwt_secret_here
```

Important: Do not wrap the `DB_CONNECTION_STRING` value with extra quotes — keep it plain.

## Install

Install dependencies:

```powershell
npm install
```

## Run (development)

```powershell
npm run dev
```

Default server port is `5000` (or the value of `PORT` in `.env`). The app initializes DB tables on startup if they don't exist.

## API Summary

Base URL: `http://localhost:<PORT>/api/v1`

Authentication

- `POST /auth/signup` — Register a new user. Body: `{ name, email, password, phone, role }`.
- `POST /auth/signin` — Authenticate and receive a JWT.

Users

- `GET /users` — List users (auth required).
- `PUT /users/:userId` — Update user. Business rules:
  - Admin: can update any user and change `role`.
  - Customer: can update only their own profile; `role` changes are ignored.

Vehicles

- `GET /vehicles` — List vehicles.
- `POST /vehicles` — Create vehicle (admin only).
- `PUT /vehicles/:vehicleId` — Update vehicle (admin only).

Bookings

- `POST /bookings` — Create a booking. Body includes `{ customer_id, vehicle_id, rent_start_date, rent_end_date }`.
- `GET /bookings` — List bookings. Behavior:
  - Admin: receives all bookings (joined/enriched by controller).
  - Customer: receives only bookings that belong to them (server-side filtering).

## Authorization / Tokens

- Provide JWT in the `Authorization` header. The project expects the middleware to decode the token and attach `req.user` with `role` (and ideally `id` and `email`).
- Recommended token payload: `{ id, email, role }` so controllers can reliably map requests to DB records.

## Common troubleshooting

- `rows: []` when calling `GET /users`: verify DB connection string and ensure users were created using signup.
- Updates not taking effect: confirm route parameter name matches controller (e.g. `:userId` vs `:id`) and that the `userId` exists in DB.
- If sign-in expects a token to exist, make sure the signin route is public (no `auth` middleware blocking it).

## Testing examples (PowerShell)

Signup:

```powershell
Invoke-RestMethod -Uri 'http://localhost:5000/api/v1/auth/signup' -Method Post `
  -Body (ConvertTo-Json @{ name='Test User'; email='test@example.com'; password='pass123'; phone='1234567890'; role='customer' }) `
  -ContentType 'application/json'
```

Get bookings as customer (replace `<TOKEN>`):

```powershell
Invoke-RestMethod -Uri 'http://localhost:5000/api/v1/bookings' -Method Get -Headers @{ Authorization = '<TOKEN>' }
```

Update user as admin (replace `<TOKEN>`):

```powershell
Invoke-RestMethod -Uri 'http://localhost:5000/api/v1/users/1' -Method Put -Headers @{ Authorization = '<TOKEN>' } `
  -Body (ConvertTo-Json @{ name='New Name'; email='new@example.com'; phone='9999999999'; role='admin' }) -ContentType 'application/json'
```

## Recommended improvements

- Ensure `id` is included in JWT at sign-in to avoid DB lookups for `req.user`.
- Accept `Authorization: Bearer <token>` format in the auth middleware and extract the token reliably.
- Add request validation (express-validator) and sanitization.
- Add unit/integration tests and CI.
- Consider documenting the API with OpenAPI/Swagger.

## Contributing

- Create a branch, add tests for new behaviors, and open a PR with a clear description of changes.

## License

Add a `LICENSE` file or indicate a license in `package.json`.
