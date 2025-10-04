export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function frame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}
