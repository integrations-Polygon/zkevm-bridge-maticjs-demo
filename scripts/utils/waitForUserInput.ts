import * as readline from "readline";

export async function waitForKeyPress() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<void>((resolve) => {
    rl.question("\nPress Enter key to continue...", () => {
      rl.close();
      resolve();
    });
  });
}
