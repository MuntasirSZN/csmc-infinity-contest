import { spawn } from "child_process";
import { consola } from "consola";

async function waitForServer(
  host: string,
  port: number,
  timeout: number = 90000,
): Promise<void> {
  const startTime = Date.now();
  const url = `http://${host}:${port}/`;
  let lastError: Error | null = null;

  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok || response.status === 404 || response.status === 503) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        consola.success("Dev server is ready");
        return;
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(
    `Dev server did not start within ${timeout}ms. Last error: ${lastError?.message || "Unknown"}`,
  );
}

async function main() {
  // Get all arguments passed to this script
  const vitestArgs = process.argv.slice(2);

  let devProcess: ReturnType<typeof spawn> | null = null;

  const cleanup = () => {
    if (devProcess && !devProcess.killed) {
      consola.info("Stopping dev server...");
      devProcess.kill("SIGTERM");
    }
  };

  process.on("exit", cleanup);
  process.on("SIGINT", () => {
    cleanup();
    process.exit();
  });

  try {
    consola.start("Setting up database...");
    const dbProcess = spawn("bun", ["run", "db:migrate"], {
      stdio: "inherit",
    });

    const dbExitCode = await new Promise<number>((resolve) => {
      dbProcess.on("exit", (code) => resolve(code ?? 0));
    });

    if (dbExitCode !== 0) {
      consola.error("Database setup failed");
      process.exit(dbExitCode);
    }

    consola.start("Starting dev server on port 8787...");

    // Start dev server in background on port 8787
    devProcess = spawn("bun", ["run", "dev", "-p", "8787"], {
      stdio: "inherit",
    });

    if (!devProcess.pid) {
      throw new Error("Failed to start dev server process");
    }

    // Wait for dev server to actually be ready
    await waitForServer("localhost", 8787);

    // Run tests with any passed arguments
    consola.start("Running tests...");
    const testProcess = spawn("bunx", ["vitest", "run", ...vitestArgs], {
      stdio: "inherit",
    });

    const exitCode = await new Promise<number>((resolve) => {
      testProcess.on("exit", (code) => resolve(code ?? 0));
    });

    if (exitCode !== 0) {
      consola.error("Tests failed");
      process.exit(exitCode);
    }

    consola.success("Tests passed");
  } finally {
    cleanup();
  }
}

main().catch((err) => {
  consola.error("Unexpected error:", err);
  process.exit(1);
});
