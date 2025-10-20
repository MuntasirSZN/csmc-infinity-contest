import { spawn } from "child_process";
import { consola } from "consola";

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
    consola.start("Starting dev server on port 8787...");

    // Start dev server in background on port 8787
    devProcess = spawn("bun", ["run", "dev", "--port", "8787"], {
      stdio: "pipe",
      detached: true,
    });

    // Capture output but don't show it
    devProcess.stdout?.on("data", () => {});
    devProcess.stderr?.on("data", () => {});

    // Wait for dev server to start
    consola.info("Waiting for dev server to start...");
    await new Promise((resolve) => setTimeout(resolve, 6000));
    consola.success("Dev server should be ready");

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
