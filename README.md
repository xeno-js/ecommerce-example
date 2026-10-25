<div align="center">
  <h1>Xeno.JS Enterprise E-Commerce Example</h1>
  <p><strong>Demonstrating Isomorphic Architecture, CQRS, and Transport Interchangeability.</strong></p>
  <p>
    <a href="https://github.com/xeno-js/xeno-shared">
      <img src="https://img.shields.io/github/stars/xeno-js/xeno-shared?style=flat-square" alt="GitHub Stars" />
    </a>
    <a href="https://www.npmjs.com/package/@xeno-js/core"><img src="https://img.shields.io/npm/v/@xeno-js/core?style=flat-square" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/@xeno-js/core"><img src="https://img.shields.io/npm/dt/@xeno-js/core?style=flat-square" alt="npm downloads" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT license" /></a>
    <a href="https://buymeacoffee.com/xenojs">
      <img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-FFdd00?style=flat-square&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee" />
    </a>
  </p>
</div>

---

## 🚀 Overview

This repository contains a full-stack **E-Commerce Example Monorepo** built on top of **Xeno.JS**, showcasing how to design modular, enterprise-grade applications.

The core philosophy demonstrated here is the **absolute isolation and protection of business logic**: entities, value objects, CQRS handlers, validation rules, and persistence layers remain completely agnostic of the underlying HTTP transport layer. Shifting from Node.js's native HTTP server (`@xeno-js/node`) to a high-performance framework like Fastify (`@xeno-js/fastify`) requires **zero changes** to your business logic—only swapping a single plugin declaration at the composition root.

---

## 📂 Project Structure

The project is structured as a clean workspace containing shared domain logic, interchangeable backend targets, and an isomorphic frontend:

```text
ecommerce-example/
├── core-logic/           # Shared business logic, CQRS handlers, Drizzle ORM schemas, and routes
├── server-node/          # Backend composition root powered by @xeno-js/node
├── server-fastify/       # Backend composition root powered by @xeno-js/fastify
└── frontend-vue/         # Frontend Vue 3 application powered by @xeno-js/vue and Pinia
```

---

## 🏗️ The Power of Xeno.JS: Transport Interchangeability

In traditional frameworks, business logic, routing, and HTTP framework primitives are tightly coupled. Xeno.JS enforces strict **Clean Architecture** and **Hexagonal Principles**:

1. **The Core Logic (`@ecommerce/core-logic`)**: Encapsulates use cases (`CreateOrderHandler`, `GetProductsHandler`), domain rules (`Order`, `Product`, `StockValueObject`), database definitions (Drizzle ORM), and security policies. It knows nothing about Express, Fastify, or Node `IncomingMessage`.
2. **The Plug-and-Play Server Layer**:
   - `server-node` mounts `@xeno-js/node` via `.addHttpServer(withNodeHttpServer())`.
   - `server-fastify` mounts `@xeno-js/fastify` via `.addHttpServer(withFastify())`.

### How Easy Is It to Switch Servers?

Compare the `bootstrap.ts` file of both servers. **100% of the architecture is identical**, except for the injected server plugin:

```ts
// server-node/src/bootstrap.ts
import { GetXenoBuilder } from '@ecommerce/core-logic';
import { withNodeHttpServer } from '@xeno-js/node';

export async function bootstrap(mode: 'api' | 'worker') {
    const builder = GetXenoBuilder(mode);
    builder.addHttpServer(withNodeHttpServer()); // <--- Native Node HTTP
    return builder.build();
}
```

```ts
// server-fastify/src/bootstrap.ts
import { GetXenoBuilder } from '@ecommerce/core-logic';
import { withFastify } from '@xeno-js/fastify';

export async function bootstrap(mode: 'api' | 'worker') {
    const builder = GetXenoBuilder(mode);
    builder.addHttpServer(withFastify()); // <--- Fastify HTTP Adapter
    return builder.build();
}
```

---

## 🛠️ Prerequisites & Environment Setup

Before running the project, make sure you have:

- **Node.js** (v20+ recommended)
- A running **PostgreSQL** instance
- A running **Redis** instance (for caching/idempotency)
- A **Supabase** project (for OAuth and authentication)

### Environment Variables

Copy `.env.example` to `.env` inside `core-logic` (or respective server packages) and configure your keys:

```env
NODE_ENV=development
DATABASE_URL=postgres://postgres:password@localhost:5432/xeno_db
REDIS_HOST=localhost
REDIS_PORT=6379
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
CSRF_SECRET=your-super-secret-csrf-key
CLIENT_URL=http://localhost:5173
```

---

## ⚙️ Installation & Running the Projects

Because this project uses workspace references (`file:` / `workspace:`), install dependencies and build the shared core first:

### 1. Build Shared Core Logic

```bash
cd core-logic
npm install
npm run build
```

*(Optional)* Run database migrations or push schemas using Drizzle:

```bash
npm run db:push
```

### 2. Run the Backend API (Choose your server plugin)

**Option A: Running with Native Node.js (`server-node`)**

```bash
cd ../server-node
npm install
npm run start:api
```

**Option B: Running with Fastify (`server-fastify`)**

```bash
cd ../server-fastify
npm install
npm run start:api
```

*(Both servers expose identical API contracts on `http://localhost:3000/api/v1`)*.

### 3. Run the Background Worker

For handling outbox events, stock reservations, and background tasks:

```bash
npm run start:worker
```

### 4. Run the Frontend Vue Application (`frontend-vue`)

```bash
cd ../frontend-vue
npm install
npm run dev
```

The frontend will spin up on `http://localhost:5173`, communicating seamlessly with whichever backend server you chose to launch.

---

## 💡 Architectural Highlights

- **Explicit Dependency Injection:** No magic decorators or runtime container scans. Every service lifetime (Singleton, Scoped, Transient) is explicitly declared in `registry.ts` and modules.
- **CQRS & Composable Pipelines:** Cross-cutting concerns like Zod validation, authorization policies (`withAuthZ`), idempotency (`withIdempotency`), concurrency retry, and performance metrics are handled declaratively by pipeline behaviors.
- **Transactional Outbox:** Guarantees reliable event publishing and stock updates across PostgreSQL and Redis in a single atomic transaction boundary.

---

## 📄 License

Released under the [MIT License](LICENSE).
