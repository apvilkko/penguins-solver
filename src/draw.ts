export const renderBoard = (board: number[], width: number) => {
  const rows = board.length / width
  return `
<table class="board">
${Array.from({ length: rows })
  .map((_, j) => {
    return `<tr>${Array.from({ length: width })
      .map((_, i) => {
        const v = board[j * width + i]
        return `<td>${v === 2 ? 'P' : v === 1 ? 'X' : ''}</td>`
      })
      .join('')}</tr>`
  })
  .join('')}
</table>
  `
}
