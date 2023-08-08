import { DoublyLinkedMatrix } from './doublylinkedmatrix'
import { exactCover, toRows } from './exactcover'
import { buildMatrix, toArray } from './matrix'
import type { MatrixCell } from './types'

describe('exact cover', () => {
  it('works for placed penguins', () => {
    // prettier-ignore
    const challenge: MatrixCell[] = [
      0, 0, 0, 2, 0,
      2, 0, 0, 0, 0,
      2, 0, 2, 2, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0
    ]
    const matrix = buildMatrix(challenge)
    const arr = toArray(matrix)
    const result = exactCover(new DoublyLinkedMatrix(arr, matrix[0].length))
    expect(result.length).toBe(5)
  })
})
