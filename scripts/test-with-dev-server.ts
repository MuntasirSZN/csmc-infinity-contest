import { spawn, exec } from "child_process";
import { promisify } from "util";
import { consola } from "consola";

const execAsync = promisify(exec);

async function main() {
  let devProcess: ReturnType<typeof spawn> | null = null;

  const cleanup = () => {
    if (devProcess && !devProcess.killed) {
      devProcess.kill("SIGTERM");
    }
  };

  process.on("exit", cleanup);
  process.on("SIGINT", () => {
    cleanup();
    process.exit();
  });

  try {
    // Start dev server in background on port 8787
    devProcess = spawn("bun", ["run", "dev", "--port", "8787"], {
      stdio: "ignore",
      detached: true,
    });

    // Wait for dev server to start
    await new Promise((resolve) => setTimeout(resolve, 6000));

    // Run tests
    try {
      await execAsync("bun run test");
    } catch (err) {
      consola.error("Tests failed:", err);
    }
  } finally {
    cleanup();
  }
}

main().catch(console.error);
