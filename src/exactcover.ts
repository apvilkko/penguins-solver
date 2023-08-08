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

const cover = (x: DataObject) => {
  const c = x.C!
  console.log('=> cover', c.N)
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
    }
  }
}

const uncover = (x: DataObject) => {
  const c = x.C!
  let i = c
  while (i.U !== c) {
    i = i.U!
    let j = i
    while (j.L !== i) {
      j = j.L!
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
  if (m.root.R === m.root) {
    throw new FinishedException()
  }
  // Choose column c
  let s = 1000
  let c = m.root
  let node = m.root
  while (node.R !== m.root) {
    node = node.R!
    const value = m.getS(node)
    if (value < s) {
      c = node
      s = value
    }
  }
  console.log('chose', c.N)

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

export const exactCover = (m: DoublyLinkedMatrix): number[] => {
  const o: Array<DataObject | undefined> = []
  try {
    exactCoverLevel(m, 0, o)
  } catch (FinishedException) {
    console.log('finished')
  } finally {
    const rows = o.map((x) => Number(x!.N.split(',').pop()))
    return rows
  }
}
