# RetailFlow

A full-stack e-commerce app: a React (Vite) frontend backed by 4 independent Spring Boot microservices.

## Architecture

| Service | Port | Description |
|---|---|---|
| `auth-service` | 8081 | Signup/login, user roles (ADMIN/CUSTOMER) |
| `product-service` | 8082 | Product catalog, stock management |
| `order-service` | 8083 | Order placement, status, stats |
| `alert-service` | 8084 | Low-stock / system alerts |
| `frontend-dashboard` | 5173 | React + Vite UI, talks to all 4 services above |

Each backend service is a standalone Spring Boot app with its own in-memory H2 database — there's no shared database or API gateway; the frontend calls each service directly on its own port.

## Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 18+ and npm

## Running it locally

You need all 5 processes running at once, so use 5 separate terminals.

**1. Start each backend service** (repeat for `auth-service`, `product-service`, `order-service`, `alert-service`):

```bash
cd auth-service
mvn spring-boot:run
```

Wait for each one to print `Started ...Application` before moving on (~10-15s per service).

**2. Start the frontend:**

```bash
cd frontend-dashboard
npm install
npm run dev
```

Then open **http://localhost:5173**.

## Logging in

An admin account is created automatically the first time `auth-service` starts:

- **Email:** `admin@retailflow.com`
- **Password:** `adminpassword123`

Or use the Signup page to create a new customer account.

## Notes

- All 4 services use an **in-memory H2 database** — data resets every time a service restarts.
- Since `product-service` starts empty, the product catalog page will show nothing until you add a product, e.g.:
  ```bash
  curl -X POST http://localhost:8082/products/add \
    -H "Content-Type: application/json" \
    -d '{"name":"Wireless Mouse","category":"Electronics","description":"A smooth wireless mouse","price":499,"mrp":1700,"discount":"71% off","stock":25,"reorderLevel":10,"sku":"SKU-001","image":"https://picsum.photos/id/433/500/400"}'
  ```
- Each service's H2 console is available at `http://localhost:<port>/h2-console` if you want to inspect its data directly.

## Stopping

`Ctrl+C` in each terminal, or find and kill the process listening on the relevant port if one gets stuck.
