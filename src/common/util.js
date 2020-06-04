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

// TODO:
// - Will this move put the player in check?
// - En pessant pawn moves
// - Castling
export const isMoveValid = (startIndex, endIndex, board) => {
  if (isMoveOffBoard(endIndex)) return false;

  // Checks to see if piece is not moving at all
  // Is this necessary? Or better part of game logic to not skip turn?
  if (startIndex.row === endIndex.row && startIndex.column === endIndex.column) return false;

  const pieceToMove = board[startIndex.row][startIndex.column];
  switch (pieceToMove) {
    case PIECE_CHAR.PAWN:
      return isPawnMoveValid(pieceToMove, startIndex, endIndex, board);
    case PIECE_CHAR.KNIGHT:
      return isKnightMoveValid(pieceToMove, startIndex, endIndex, board);
    case PIECE_CHAR.BISHOP:
      return isBishopMoveValid(pieceToMove, startIndex, endIndex, board);
    case PIECE_CHAR.ROOK:
      return isRookMoveValid(pieceToMove, startIndex, endIndex, board);
    case PIECE_CHAR.QUEEN:
      return isQueenMoveValid(pieceToMove, startIndex, endIndex, board);
    case PIECE_CHAR.KING:
      return isKingMoveValid(pieceToMove, startIndex, endIndex, board);
    default:
      return false;
  }
};

const isTherePieceAt = (index, board) => {
  const piece = board[index.row][index.column];
  return Boolean(piece);
};

const whatPieceIsAt = (index, board) => {
  return board[index.row][index.column];
}

const isMoveOffBoard = (index, board) => {
  return index.row >= 0 && index.row < board.length &&
         index.column >= 0 && index.column <= board[0].length;
};

// I have no idea if this will work
const isLinePathBlocked = (startIndex, endIndex, board) => {
  let rowMod = 0;
  let colMod = 0;

  const rowDiff = endIndex.row - startIndex.row;
  const colDiff = endIndex.column - startIndex.column;

  if (rowDiff > 0) {
    rowMod = 1;
  } else if (rowDiff < 0) {
    rowMod = -1;
  }

  if (colDiff > 0) {
    colMod = 1;
  } else if (colDiff < 0) {
    colMod = -1;
  }

  for (
    let r = startIndex.row, c = startIndex.column;
    Math.abs(r - endIndex.row) > 0 && Math.abs(c - endIndex.column) > 0;
    r++, c++;
  ) {
    if (board[r][c] !== PIECE_CHAR.EMPTY) {
      return false;
    }
  }

  return true;
};

const isPawnMoveValid = (pawnToMove, startIndex, endIndex, board) => {
  const isTherePieceAtEnd = isTherePieceAt(endIndex, board);

  const mod = (pawnToMove.colour === COLOUR.WHITE) ? 1 : -1;
  const enemyColour = (pawnToMove.colour === COLOUR.WHITE) ? COLOUR.BLACK : COLOUR.WHITE;

  if (startIndex.column === endIndex.column) {
    if (endIndex.row - startIndex.row === (1 * mod) && !isTherePieceAtEnd) {
      return true;
    } else if (endIndex.row - startIndex.row === (2 * mod) &&
               !pawnToMove.hasMoved && !isTherePieceAtEnd
    ) {
      return true;
    }
  }

  if (
    endIndex.row - startIndex.row === (1 * mod) &&
    Math.abs(endIndex.column - startIndex.column) === (1 * mod) &&
    isTherePieceAtEnd &&
    whatPieceIsAt(endIndex, board).colour === enemyColour
  ) {
    return true;
  }

  return false;
};

const isKnightMoveValid = (knightToMove, startIndex, endIndex, board) => {
  const isTherePieceAtEnd = isTherePieceAt(endIndex, board);
  const pieceAtEnd = whatPieceIsAt(endIndex, board);

  const enemyColour = (knightToMove.colour === COLOUR.WHITE) ? COLOUR.BLACK : COLOUR.WHITE;

  const rowMoveAbs = Math.abs(endIndex.row - startIndex.row);
  const colMoveAbs = Math.abs(endIndex.column - startIndex.column);

  return (
    ((rowMoveAbs === 2 && colMoveAbs === 1) || (rowMoveAbs === 1 && colMoveAbs === 2)) &&
    ((!isTherePieceAtEnd) || (isTherePieceAtEnd && pieceAtEnd.colour === enemyColour))
  );
};

const isBishopMoveValid = (bishopToMove, startIndex, endIndex, board) => {
  const isTherePieceAtEnd = isTherePieceAt(endIndex, board);
  const pieceAtEnd = whatPieceIsAt(endIndex, board);

  const enemyColour = (bishopToMove.colour === COLOUR.WHITE) ? COLOUR.BLACK : COLOUR.WHITE;

  const rowMoveAbs = Math.abs(endIndex.row - startIndex.row);
  const colMoveAbs = Math.abs(endIndex.column - startIndex.column);

  const isMoveDiagnol = (rowMoveAbs === colMoveAbs);
  if (isMoveDiagnol) return false;
  if (isPathBlocked(startIndex, endIndex, board)) return false;

  return (
    ((!isTherePieceAtEnd) || (isTherePieceAtEnd && pieceAtEnd.colour === enemyColour))
  );
};

const isRookMoveValid = (rookToMove, startIndex, endIndex, board) => {
  const isTherePieceAtEnd = isTherePieceAt(endIndex, board);
  const pieceAtEnd = whatPieceIsAt(endIndex, board);

  const enemyColour = (rookToMove.colour === COLOUR.WHITE) ? COLOUR.BLACK : COLOUR.WHITE;

  const rowMoveAbs = Math.abs(endIndex.row - startIndex.row);
  const colMoveAbs = Math.abs(endIndex.column - startIndex.column);

  const isStraightLine = (rowMoveAbs === 0 ^ colMoveAbs === 0);
  if (!isStraightLine) return false;
  if (isPathBlocked(startIndex, endIndex, board)) return false;

  return (
    ((!isTherePieceAtEnd) || (isTherePieceAtEnd && pieceAtEnd.colour === enemyColour))
  );
};

const isQueenMoveValid = (queenToMove, startIndex, endIndex, board) => {
  const isTherePieceAtEnd = isTherePieceAt(endIndex, board);
  const pieceAtEnd = whatPieceIsAt(endIndex, board);

  const enemyColour = (queenToMove.colour === COLOUR.WHITE) ? COLOUR.BLACK : COLOUR.WHITE;

  const rowMoveAbs = Math.abs(endIndex.row - startIndex.row);
  const colMoveAbs = Math.abs(endIndex.column - startIndex.column);

  const isStraightLine = (rowMoveAbs === 0 ^ colMoveAbs === 0);
  const isMoveDiagnol = (rowMoveAbs === colMoveAbs);
  if (!isStraightLine && !isMoveDiagnol) return false;
  if (isPathBlocked(startIndex, endIndex, board)) return false;

  return (
    ((!isTherePieceAtEnd) || (isTherePieceAtEnd && pieceAtEnd.colour === enemyColour))
  );
};

const isKingMoveValid = (kingToMove, startIndex, endIndex, board) => {
  const isTherePieceAtEnd = isTherePieceAt(endIndex, board);
  const pieceAtEnd = whatPieceIsAt(endIndex, board);

  const enemyColour = (queenToMove.colour === COLOUR.WHITE) ? COLOUR.BLACK : COLOUR.WHITE;

  const rowMoveAbs = Math.abs(endIndex.row - startIndex.row);
  const colMoveAbs = Math.abs(endIndex.column - startIndex.column);

  return (
    (rowMoveAbs === 1 || colMoveAbs === 1) &&
    ((!isTherePieceAtEnd) || (isTherePieceAtEnd && pieceAtEnd.colour === enemyColour))
  );
};
