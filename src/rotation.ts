import { PengPentomino } from './types'

export enum Rotation {
  R0 = 0,
  R90 = 1,
  R180 = 2,
  R270 = 3,
}

const assert = (p: PengPentomino): PengPentomino => {
  for (let i = 0; i < p.length; ++i) {
    if (p[i].replace(/[-px]+/, '').length > 0) {
      throw new Error('Invalid: ' + JSON.stringify(p))
    }
  }
  return p
}

export const rotate = (p: PengPentomino, rotation: Rotation): PengPentomino => {
  if (rotation == Rotation.R0) {
    return p
  }

  const width = p[0].length
  const height = p.length
  const newWidth = height
  const newHeight = width

  switch (rotation) {
    case Rotation.R90: {
      const out = []
      for (let j = 0; j < newHeight; j++) {
        out.push('')
        for (let i = newWidth - 1; i >= 0; i--) {
          out[j] = out[j] + p[i][j]
        }
      }
      return assert(out as PengPentomino)
    }
    case Rotation.R180: {
      const rev = p.slice().reverse()
      return assert(
        rev.map((a) => a.split('').reverse().join('')) as PengPentomino
      )
    }
    case Rotation.R270: {
      const out = []
      for (let j = 0; j < newHeight; j++) {
        out.push('')
        for (let i = 0; i < newWidth; i++) {
          out[j] = out[j] + p[i][j]
        }
      }
      return assert(out.reverse() as PengPentomino)
    }
    default:
      return p
  }
}
