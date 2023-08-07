import { Rotation, rotate } from './rotation'
import type { PengPentomino } from './types'

describe('rotate', () => {
  it('works', () => {
    let p: PengPentomino = ['pxx', 'xx-']

    expect(rotate(p, Rotation.R0)).toEqual(p)
    expect(rotate(p, Rotation.R90)).toEqual(['xp', 'xx', '-x'])
    expect(rotate(p, Rotation.R180)).toEqual(['-xx', 'xxp'])
    expect(rotate(p, Rotation.R270)).toEqual(['x-', 'xx', 'px'])

    p = ['p--', 'xxx', 'x--']
    expect(rotate(p, Rotation.R0)).toEqual(p)
    expect(rotate(p, Rotation.R90)).toEqual(['xxp', '-x-', '-x-'])
    expect(rotate(p, Rotation.R180)).toEqual(['--x', 'xxx', '--p'])
    expect(rotate(p, Rotation.R270)).toEqual(['-x-', '-x-', 'pxx'])
  })
})
