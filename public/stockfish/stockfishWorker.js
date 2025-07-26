// Este worker serve como um wrapper para o Stockfish.js
// Ele garante que as mensagens sejam repassadas corretamente

// Importa o script do Stockfish
importScripts('./stockfish.js');

// Inicializa o engine quando o worker é carregado
const engine = STOCKFISH();

// Configura os listeners de mensagens
engine.onmessage = function(event) {
  // Repassa a mensagem do engine para o thread principal
  postMessage(event.data);
};

// Recebe mensagens do thread principal e repassa para o engine
onmessage = function(event) {
  engine.postMessage(event.data);
};
