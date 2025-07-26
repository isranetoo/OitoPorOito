export default function createStockfish() {
  try {
    // Worker is served from public/stockfish
    const workerUrl = new URL('/stockfish/stockfish.js', import.meta.url);
    return new Worker(workerUrl);
  } catch (err) {
    console.error('Failed to load Stockfish worker', err);
    return null;
  }
}
