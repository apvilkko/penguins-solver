import { DataObject, DoublyLinkedMatrix } from './doublylinkedmatrix'
import { renderBoard } from './draw'
import { BOARD_DIM, VARIANTS } from './pentominoes'
import type { Matrix } from './types'

const MAX_ITERATIONS = 500 * 1000000

export const visualizeSolution = (a: Matrix, solution: number[]) => {
  const out: number[] = Array.from({ length: BOARD_DIM * BOARD_DIM }).map(
    () => 0
  )
  solution.forEach((n) => {
    const pIndex = a[n].slice(0, 5).indexOf(1)
    a[n].forEach((v, i) => {
      if (i >= VARIANTS.length && (v === 2 || v === 1)) {
        out[i - VARIANTS.length] = 100 + pIndex * 10 + v
      }
    })
  })
  return renderBoard(out, BOARD_DIM, 'solution')
}

let ops = 0

export const cover = (x: DataObject) => {
  ops++
  //if (ops % 10000 === 0) console.log(ops)
  const c = x.C!
  c.R!.L = c.L
  c.L!.R = c.R
  let i = c
  while (i.D !== c) {
    i = i.D!
    let j = i
    while (j.R !== i) {
      j = j.R!
      j.D!.U = j.U
      j.U!.D = j.D
      j.C!.S = j.C!.S! - 1
    }
  }
}

export const uncover = (x: DataObject) => {
  ops++
  //if (ops % 10000 === 0) console.log(ops)
  const c = x.C!
  let i = c
  while (i.U !== c) {
    i = i.U!
    let j = i
    while (j.L !== i) {
      j = j.L!
      j.C!.S = j.C!.S! + 1
      j.D!.U = j
      j.U!.D = j
    }
  }
  c.R!.L = c
  c.L!.R = c
}

class FinishedException extends Error {}
class UnsolvableException extends Error {}

const exactCoverLevel = (
  m: DoublyLinkedMatrix,
  level: number,
  o: Array<DataObject | undefined>
) => {
  //console.log('exact cover level', level)
  if (ops > MAX_ITERATIONS) {
    throw new UnsolvableException()
  }
  if (m.root.R === m.root) {
    throw new FinishedException()
  }

  // Choose column c by sorting columns by S and taking smallest first
  const amounts: Array<[number, DataObject]> = []
  let node = m.root
  while (node.R !== m.root) {
    node = node.R!
    const value = node.S!
    amounts.push([value, node])
  }
  const sorted = amounts.sort((a, b) => {
    if (a[0] > b[0]) return 1
    if (a[0] < b[0]) return -1
    return 0
  })

  for (let s = 0; s < sorted.length; ++s) {
    let c = sorted[s][1]
    cover(c)
    let r = c
    while (r.D !== c) {
      r = r.D!
      if (o.length <= level) {
        o.push(undefined)
      }
      o[level] = r
      let j = r
      while (j.R !== r) {
        j = j.R!
        cover(j)
      }
      // Recursively call next level
      exactCoverLevel(m, level + 1, o)
      r = o[level] as DataObject
      c = r.C!
      j = r
      while (j.L !== r) {
        j = j.L!
        uncover(j)
      }
    }
    uncover(c)
  }
}

export const exactCover = (m: DoublyLinkedMatrix): [boolean, number[]] => {
  ops = 0
  const o: Array<DataObject | undefined> = []
  let success = false
  try {
    exactCoverLevel(m, 0, o)
  } catch (e) {
    if (e instanceof FinishedException) {
      success = true
    }
  } finally {
    console.log('Operations', ops)
    if (success) {
      console.log('Finished')
    } else {
      console.log('Did not finish')
    }
    const rows = o.map((x) => Number(x!.N.split(',').pop()))
    return [success, rows]
  }
}

export const toRows = (solution: number[], arr: number[], rowLen: number) =>
  solution.map((r) => arr.slice(r * rowLen, (r + 1) * rowLen))
