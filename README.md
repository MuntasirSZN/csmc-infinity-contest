1. Install node 22 or later and bun 1.2 or later.

1. Clone this repo:

```sh
git clone https://github.com/MuntasirSZN/csmc-infinity-contest.git
```

1. Run the following command to install the required packages:

```sh
bun install
```

1. Start the development server:

```sh
bun run dev
```

> [!IMPORTANT]
> Must run `bun run db:migrate` first time before starting the server. This adds the required tables and seed data to the database.

1. Run tests:

```sh
bun run test
```

1. Open your browser and navigate to `http://localhost:3000` to view the application.
1. Run `bun run build` to create a production build of the application.
1. Run `bun preview` to preview the production build locally.

### Current status

Most of it is built, but instructions and others are not.

This is not deployed right now.
