import { BOARD_DIM, VARIANTS } from './pentominoes'
import type { Matrix } from './types'

export const visualizeSolution = (a: Matrix, solution: number[]) => {
  const out: string[] = Array.from({ length: BOARD_DIM * BOARD_DIM }).map(
    () => '-'
  )
  solution.forEach((n) => {
    const pIndex = a[n].slice(0, 5).indexOf(1)
    const pentomino = VARIANTS.map((x) => x[0])[pIndex]
    a[n].forEach((v, i) => {
      if (i > VARIANTS.length && (v === 2 || v === 1)) {
        out[i - VARIANTS.length] = v === 2 ? 'P' : v === 1 ? pentomino : '-'
      }
    })
  })
  const rows = out.reduce((all: Array<string>, one: string, i) => {
    const ch = Math.floor(i / BOARD_DIM)
    if (!all[ch]) {
      all.push('')
    }
    all[ch] = all[ch] + one
    return all
  }, [])
  console.log('rows', rows)
  return `<pre>${rows.join('\n')}</pre>`
}

const deleteRows = (a: Matrix, n: number[]): Matrix => {
  return a.filter((_, i) => !n.includes(i))
}

const deleteCols = (a: Matrix, n: number[]): Matrix => {
  return a.map((row) => row.filter((_, i) => !n.includes(i)))
}

class TerminationError extends Error {}

export const exactCover = (a: Matrix): number[] => {
  const solution: number[] = []
  return exactCoverStep(a, solution)
}

const exactCoverStep = (a: Matrix, solution: number[]): number[] => {
  console.log('exactCoverStep')
  if (a.length === 0) {
    return solution
  }
  const columsSums = a[0].map((_, i) => ({
    amount: a.filter((_, ri) => a[ri][i] > 0).length,
    index: i,
  }))
  let min = { amount: 1000, index: -1 }
  columsSums.forEach((v) => {
    if (!min || v.amount < min.amount) {
      min = v
    }
  })

  const sorted = columsSums.sort((a, b) => {
    if (a.amount > b.amount) return 1
    if (a.amount < b.amount) return -1
    return 0
  })
  for (let s = 0; s < sorted.length; ++s) {
    const c = sorted[s].index
    const possibles = a
      .map((x, i) => [x, i])
      .filter((y) => a[y[1] as number][c] > 0)
      .map((y) => y[1])
    if (possibles.length === 0) {
      return solution
    }
    const r = Math.floor(Math.random() * possibles.length)
    solution.push(r)

    const columnsToDelete = []
    const rowsToDelete = []
    for (let j = 0; j < a[r].length; ++j) {
      if (a[r][j] > 0) {
        columnsToDelete.push(j)
        //a = deleteCol(a, j)
        for (let i = 0; i < a.length; ++i) {
          if (a[i][j] > 0) {
            rowsToDelete.push(i)
          }
        }
      }
    }
    let a1 = deleteRows(a, rowsToDelete)
    a1 = deleteCols(a1, columnsToDelete)

    exactCoverStep(a1, [...solution, r])
  }
  return solution
}
