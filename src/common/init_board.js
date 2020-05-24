import { COLOUR, PIECE_CHAR } from './constants.js';

const b = (c, p) => {
  return {
    colour: c,
    piece: p,
    hasMoved: false
  };
};

const firstRank = [
  PIECE_CHAR.ROOK, PIECE_CHAR.BISHOP, PIECE_CHAR.KNIGHT, PIECE_CHAR.QUEEN,
  PIECE_CHAR.KING, PIECE_CHAR.KNIGHT, PIECE_CHAR.BISHOP, PIECE_CHAR.ROOK
];

export const INIT_BOARD = [
  firstRank.map(p => b(COLOUR.BLACK, p)),
  Array(8).map(a => b(COLOUR.BLACK, PIECE_CHAR.PAWN)),
  Array(8),
  Array(8),
  Array(8),
  Array(8),
  Array(8).map(a => b(COLOUR.WHITE, PIECE_CHAR.PAWN)),
  firstRank.map(p => b(COLOUR.WHITE, p))
];
