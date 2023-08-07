import { buildMatrix } from './matrix'

describe('buildMatrix', () => {
  it('builds a valid matrix', () => {
    const matrix = buildMatrix()
    expect(matrix.length > 5).toBe(true)
  })
})
