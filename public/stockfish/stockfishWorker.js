importScripts('stockfish.js');

let sf = null;

onmessage = function (e) {
  if (!sf) {
    sf = STOCKFISH();
    sf.onmessage = (event) => {
      postMessage(event.data);
    };
    sf.postMessage('uci');
  }
  if (e.data) {
    sf.postMessage(e.data);
  }
};
