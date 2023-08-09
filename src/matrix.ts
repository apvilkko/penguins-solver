import { BoardGraph, DFS } from './dfs'
import { BOARD_DIM, VARIANTS } from './pentominoes'
import { rotate } from './rotation'
import type { Matrix, MatrixCell, MatrixRow, PengPentomino } from './types'

class InvalidPlacementError extends Error {}

export const visualizeMatrix = (matrix: Matrix) => {
  const matrixes = []
  for (let i = 0; i < matrix.length; ++i) {
    const pIndex = matrix[i].slice(0, 5).indexOf(1)
    const pentomino = VARIANTS.map((x) => x[0])[pIndex]

    const out = []
    for (let y = 0; y < BOARD_DIM; y++) {
      for (let x = 0; x < BOARD_DIM; x++) {
        const v = matrix[i][VARIANTS.length + (y * BOARD_DIM + x)]
        out.push(v === 2 ? 'P' : v === 1 ? pentomino : '-')
      }
      out.push('\n')
    }
    matrixes.push(`<pre>${out.join('')}</pre>`)
  }

  return `<div>${matrixes.join('<br>')}</div>`
}

type Placement = Array<[number, MatrixCell]>

/**
 * @returns true if placement is invalid (e.g. outside of board) or results in
 * sections of board which do not fit further pentominoes
 */
const isInvalidPlacement = (
  pl: Placement,
  challenge?: MatrixCell[]
): boolean => {
  const board: MatrixRow = Array.from({
    length: BOARD_DIM * BOARD_DIM,
  }).map(() => 0)

  for (let pp = 0; pp < pl.length; ++pp) {
    const i = pl[pp][0]
    const v = pl[pp][1]

    if (challenge && challenge[i] === 2 && v !== 2) {
      return true
    }

    board[i] = v
  }

  // Use DFS to search for consecutive empty spaces (does this placement leave
  // enough room for another piece?)
  const dfs = new DFS()
  for (let i = 0; i < BOARD_DIM * BOARD_DIM; ++i) {
    if (board[i] === 0) {
      const visited = dfs.dfsRecursive(new BoardGraph(board), i)
      if (visited < 5) {
        return true
      }
    }
  }

  return false
}

/**
 * Updates board in place
 * @param p Pentomino to place
 * @param board The game board
 * @param i Board x coordinate
 * @param j Board y coordinate
 * @param challenge Possible challenge restraint
 */
const placePiece = (
  p: PengPentomino,
  board: MatrixRow,
  i: number,
  j: number,
  challenge?: MatrixCell[]
): void => {
  // Sanity check with dimensions
  const width = p[0].length
  const height = p.length
  if (i + width > BOARD_DIM || j + height > BOARD_DIM) {
    throw new InvalidPlacementError()
  }

  const placement: Placement = []
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const bx = i + x
      const by = j + y
      const value = p[y][x] === 'p' ? 2 : p[y][x] === 'x' ? 1 : 0
      if (value > 0) {
        placement.push([by * BOARD_DIM + bx, value])
      }
    }
  }

  if (isInvalidPlacement(placement, challenge)) {
    throw new InvalidPlacementError()
  }

  placement.forEach((pl) => {
    board[pl[0]] = pl[1]
  })
}

export const buildMatrix = (challenge?: Array<MatrixCell>): Matrix => {
  /* A row consists of 30 columns:
  - one for each pentomino (5)
  - one for each square in the board (5x5 = 25)
  Matrix should be populated with all possible rows so that one row contains:
  - 1 in one of the pentomino columns
  - 1|2 in five columns of the board, describing the pentomino's position,
  where 2 denotes penguin, 1 a normal "ice" tile
  
  Some invalid placements can be left out to reduce computation. For example
  the T pentomino can't be placed like this in the board because of the 1x2
  gap which fits no other pentomino.

  -x---
  -x---
  pxx--
  -----
  -----
  
  More optimizations are possible when considering impossible piece placements
  but they are left out, since the algorithm performs fast enough as such.
  */

  const matrix: Matrix = []
  VARIANTS.forEach((v, pentominoIndex) => {
    const pentominos = v[1].map((x) => x.split('|') as PengPentomino)
    pentominos.forEach((p) => {
      for (let j = 0; j < BOARD_DIM; ++j) {
        for (let i = 0; i < BOARD_DIM; ++i) {
          for (let r = 0; r < 4; ++r) {
            const board: MatrixRow = Array.from({
              length: BOARD_DIM * BOARD_DIM,
            }).map(() => 0)

            try {
              placePiece(rotate(p, r), board, i, j, challenge)
            } catch (InvalidPlacementError) {
              continue
            }
            const pRow: MatrixRow = Array.from({
              length: VARIANTS.length,
            }).map((_, ii) => (ii === pentominoIndex ? 1 : 0))
            matrix.push([...pRow, ...board])
          }
        }
      }
    })
  })
  //console.log('Matrix rows:', matrix.length)
  return matrix
}

export const toArray = (m: Matrix): number[] =>
  m.reduce((arr, curr) => arr.concat(curr), [])
