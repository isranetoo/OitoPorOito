export default function createStockfish() {
  try {
    // Use o worker customizado, não o .worker.js padrão do Stockfish
    return new Worker('/stockfish/stockfishWorker.js');
  } catch (err) {
    console.error('Failed to load Stockfish worker', err);
    return null;
  }
}
