export const BOARD_DIM = 5

export const VARIANTS: Array<[string, string[]]> = [
  ['T', ['p--|x--|xxx', 'p--|xxx|x--', 'pxx|x--|x--']],
  ['N', ['px--|-xxx', 'px-|xxx', '-px|xxx', '--px|xxx-']],
  ['L', ['p---|xxxx', '-p--|xxxx', '--p-|xxxx', '---p|xxxx']],
  ['W', ['px-|-xx|-x-', 'px|xx|x-', '-px|xx-|x--']],
  ['F', ['p--|xx-|-xx', 'p-|xx|xx', '-p-|-xx|xx-']],
]
