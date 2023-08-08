import { DataObject, DoublyLinkedMatrix } from './doublylinkedmatrix'
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
      if (i >= VARIANTS.length && (v === 2 || v === 1)) {
        out[i - VARIANTS.length] = v === 2 ? 'P' : v === 1 ? pentomino : '*'
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

let ops = 0

export const cover = (x: DataObject) => {
  ops++
  if (ops % 10000 === 0) console.log(ops)
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
  if (ops % 10000 === 0) console.log(ops)
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

const exactCoverLevel = (
  m: DoublyLinkedMatrix,
  level: number,
  o: Array<DataObject | undefined>
) => {
  //console.log('exact cover level', level)
  if (m.root.R === m.root) {
    throw new FinishedException()
  }
  // Choose column c
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

export const exactCover = (m: DoublyLinkedMatrix): number[] => {
  const o: Array<DataObject | undefined> = []
  let success = false
  try {
    exactCoverLevel(m, 0, o)
  } catch (FinishedException) {
    success = true
  } finally {
    if (success) {
      console.log('Finished')
    } else {
      console.log('Did not finish')
    }
    const rows = o.map((x) => Number(x!.N.split(',').pop()))
    return rows
  }
}
