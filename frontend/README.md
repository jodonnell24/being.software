# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# catppu Frontend

## Running Locally

1. **Start the Go Backend**

   In a separate terminal:

   ```sh
   cd ../go-back
   go run main.go
   ```

   The backend will run on `http://localhost:8080` and expose `/api/status`.

2. **Start the Svelte Frontend**

   In this directory:

   ```sh
   npm install
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` by default.

3. **View Backend Status**

   Go to the dashboard page. You should see a status card showing the backend and Docker status.

---

**Note:**

- CORS is enabled for all origins in development. Restrict this in production.
- The frontend fetches backend status from `http://localhost:8080/api/status`.
