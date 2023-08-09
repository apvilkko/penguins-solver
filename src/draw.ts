import { VARIANTS } from './pentominoes'

export const renderBoard = (board: number[], width: number, id: string) => {
  const rows = board.length / width
  return `
<table class="board">
${Array.from({ length: rows })
  .map((_, j) => {
    return `<tr>${Array.from({ length: width })
      .map((_, i) => {
        let varClass = ''
        let v = board[j * width + i]
        let s
        if (v < 100) {
          s = v === 2 ? '🐧' : v === 1 ? 'X' : ''
        } else {
          v = v - 100
          const r = v % 10
          const pIndex = Math.floor((v - r) / 10)
          varClass = `class="variant-${pIndex}"`
          if (r === 2) {
            s = '🐧'
          } else {
            s = VARIANTS[pIndex][0]
          }
        }

        return `<td id="cell-${id}-${i}-${j}" ${varClass}>${s}</td>`
      })
      .join('')}</tr>`
  })
  .join('')}
</table>
  `
}
