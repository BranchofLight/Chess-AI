// track board state
// is move valid
// make move

import { INIT_BOARD } from './init_board.js';
import { COLOUR, PIECE_CHAR } from './constants.js';

const Game = {
  board: INIT_BOARD,
  turn: COLOUR.WHITE,
};

export const makeMove = (startLocation, endLocation) => {
  // is move valid
  // update board state
  // update turn
  // publish event
};
