import { spawn } from "node:child_process";

const npmExecPath = process.env.npm_execpath;

if (!npmExecPath) {
  throw new Error("Unable to locate npm executable path from npm_execpath.");
}

function runScript(scriptName) {
  return spawn(process.execPath, [npmExecPath, "run", scriptName], {
    stdio: "inherit",
    shell: false,
  });
}

const webProcess = runScript("dev:web");
const apiProcess = runScript("api");

let shuttingDown = false;

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  webProcess.kill("SIGTERM");
  apiProcess.kill("SIGTERM");

  process.exit(exitCode);
}

webProcess.on("exit", (code) => {
  if (!shuttingDown && code !== 0) {
    shutdown(code ?? 1);
  }
});

apiProcess.on("exit", (code) => {
  if (!shuttingDown && code !== 0) {
    shutdown(code ?? 1);
  }
});

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
