export function fenToBoard(fen) {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  const rows = fen.split(" ")[0].split("/");

  rows.forEach((row, i) => {
    let col = 0;
    for (let char of row) {
      if (!isNaN(char)) {
        col += parseInt(char, 10);
      } else {
        const piece = (char === char.toLowerCase() ? "b" : "w") + char.toUpperCase();
        board[i][col] = piece;
        col++;
      }
    }
  });

  return board;
}
