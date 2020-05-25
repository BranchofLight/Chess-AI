import { COLOUR, PIECE_CHAR } from './constants.js';

// export const getIndexFromChessCoords = chessCoords => {
//   let [ column, row ] = chessCoords;
//   if (!column && !row) return undefined;
//
//   row -= 1;
//   column = column.toUpperCase().charCodeAt() - 65;
//
//   return {
//     row,
//     column
//   };
// };

export const isMoveValid = (startIndex, endIndex, board) => {
  if (isMoveOffBoard(endIndex)) return false;

  const pieceToMove = board[startIndex.row][startIndex.column];
  switch (pieceToMove) {
    case PIECE_CHAR.PAWN:
      return isPawnMoveValid(pieceToMove, startIndex, endIndex, board);
    default:
      return false;
  }
};

const isTherePieceAt = (index, board) => {
  const piece = board[index.row][index.column];
  return Boolean(piece);
};

const isMoveOffBoard = (index, board) => {
  return index.row >= 0 && index.row < board.length &&
         index.column >= 0 && index.column <= board[0].length;
};

const isPawnMoveValid = (pawnToMove, pawnLocation, endIndex, board) => {
  const isTherePieceAtEnd = isTherePieceAt(endIndex, board);

  const mod = (pawnToMove.colour === COLOUR.WHITE) ? 1 : -1;

  if (pawnToMove.column === endIndex.column) {
    if (endIndex.row - pawnLocation.row === (1 * mod) && !isTherePieceAtEnd) {
      return true;
    } else if (endIndex.row - pawnLocation.row === (2 * mod) &&
               !pawnToMove.hasMoved && !isTherePieceAtEnd
    ) {
      return true;
    }
  }

  if (
    endIndex.row - pawnLocation.row === (1 * mod) &&
    Math.abs(endIndex.column - pawnLocation.column) === (1 * mod) &&
    isTherePieceAtEnd
  ) {
    return true;
  }
};
