# 🧑‍💻 Copilot Instructions for Pet Management System

## Big Picture Architecture
- **Monorepo** with two main apps:
  - `backend-laravel/`: Laravel 10 REST API, MySQL, Sanctum for auth
  - `frontend/`: React 19 SPA, Vite, Tailwind CSS
- Data flows via RESTful API endpoints (`/api/*`), with role-based access (customer, admin, care_staff, sales_staff)
- Follows strict MVC in backend (`app/Models`, `app/Http/Controllers`, `routes/api.php`)
- Frontend is modular: `src/components`, `src/pages`, `src/services`, `src/contexts`

## Developer Workflows
- **Backend setup:**
  - `composer install` (dependencies)
  - `copy .env.example .env` (env setup)
  - `php artisan key:generate` (app key)
  - `php artisan migrate` (DB migrations)
  - `php artisan install:api` (Sanctum)
  - `php artisan serve` (dev server)
- **Frontend setup:**
  - `npm install` (dependencies)
  - `npm run dev` (dev server)
- **Testing API:** Use Postman/Thunder Client. Default admin: `admin@petmanagement.com` / `password`
- **Database:** Use `database_schema.sql` or migrations in `backend-laravel/database/migrations/`

## Project-Specific Conventions
- **API returns JSON only**; errors use standard HTTP codes (422 validation, 401 auth, 403 authorization)
- **Role-based middleware**: See `app/Http/Middleware/RoleMiddleware.php`
- **Admin endpoints**: Prefixed with `/api/admin/*`, require admin role
- **Sanctum token**: `Authorization: Bearer <token>` in headers
- **Frontend**: Service calls via Axios, routes managed by React Router DOM

## Integration Points & Patterns
- **Authentication**: Laravel Sanctum, token-based, see login/register endpoints
- **Cross-component communication**: Frontend uses React Context for global state (see `src/contexts/`)
- **Payment**: VNPay integration in `backend-laravel/vnpay_php/`
- **Statistics & dashboard**: Admin endpoints `/api/admin/statistics/*`

## Key Files & Directories
- `backend-laravel/app/Http/Controllers/` — API logic
- `backend-laravel/app/Models/` — Data models
- `backend-laravel/routes/api.php` — Route definitions
- `frontend/src/services/` — API service layer
- `frontend/src/contexts/` — Global state management
- `database_schema.sql` — DB structure
- `backend-laravel/README.md` — API details

## Example Patterns
- **Add product (admin):** `POST /api/admin/products` (see ProductController.php)
- **Customer cart:** `GET /api/cart`, `POST /api/cart` (see CartController.php)
- **Appointment booking:** `POST /api/appointments` (see AppointmentController.php)

---

For unclear workflows, see the respective README files or ask for clarification. Update this file as new conventions emerge.
