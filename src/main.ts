import { DoublyLinkedMatrix } from './doublylinkedmatrix'
import { renderBoard } from './draw'
import { exactCover, toRows, visualizeSolution } from './exactcover'
import { buildMatrix, toArray } from './matrix'
import './style.css'
import { MatrixCell } from './types'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Penguins On Ice Solver</h1>
    <div id="content"></div>
  </div>
`
// prettier-ignore
const challenge = [
  0, 0, 2, 2, 0,
  0, 2, 0, 0, 0,
  0, 2, 0, 0, 0,
  0, 0, 0, 0, 0,
  0, 0, 0, 0, 0,
]
const matrix = buildMatrix(challenge as MatrixCell[])
const arr = toArray(matrix)
const rowLen = matrix[0].length
const dllMatrix = new DoublyLinkedMatrix(arr, rowLen)
const rows = exactCover(dllMatrix)
console.log(toRows(rows, arr, rowLen))
document.querySelector<HTMLDivElement>('#content')!.innerHTML =
  renderBoard(challenge, 5) + '<br>' + visualizeSolution(matrix, rows)
