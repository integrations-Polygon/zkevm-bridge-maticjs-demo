// Function to sleep or pause the control flow
export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
