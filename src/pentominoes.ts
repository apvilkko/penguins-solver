import { Rotation, rotate } from './rotation'
import { PengPentomino } from './types'

export const VARIANTS = {
  T: ['p--|x--|xxx', 'p--|xxx|x--', 'pxx|x--|x--'],
  N: ['px--|-xxx', 'px-|xxx', '-px|xxx', '--px|xxx-'],
  L: ['p---|xxxx', '-p--|xxxx', '--p-|xxxx', '---p|xxxx'],
  W: ['px-|-xx|-x-', 'px|xx|x-', '-px|xx-|x--'],
  F: ['p--|xx-|-xx', 'p-|xx|xx', '-p-|-xx|xx-'],
}

const PENTOMINOES: PengPentomino[] = []
Object.values(VARIANTS).forEach((variantArr) => {
  variantArr.forEach((variant) => {
    for (let i = 0; i < 4; ++i) {
      PENTOMINOES.push(
        rotate(variant.split('|') as PengPentomino, i as Rotation)
      )
    }
  })
})

console.log(PENTOMINOES)

export { PENTOMINOES }
