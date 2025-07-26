export default function createStockfish() {
  try {
    // Use o worker customizado que criamos
    return new Worker('/stockfish/stockfishWorker.js');
  } catch (err) {
    console.error('Failed to load Stockfish worker', err);
    // Tenta usar stockfish.js diretamente se o worker falhar
    try {
      return new Worker('/stockfish/stockfish.js');
    } catch (innerErr) {
      console.error('Also failed to load direct stockfish.js', innerErr);
      return null;
    }
  }
}
