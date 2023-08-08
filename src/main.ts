import { DoublyLinkedMatrix } from './doublylinkedmatrix'
import { exactCover, visualizeSolution } from './exactcover'
import { buildMatrix, toArray, visualizeMatrix } from './matrix'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Penguins On Ice Solver</h1>
    <div id="content"></div>
  </div>
`

const matrix = buildMatrix()
const arr = toArray(matrix)
const rowLen = matrix[0].length
const dllMatrix = new DoublyLinkedMatrix(arr, rowLen)
const rows = exactCover(dllMatrix)
rows.forEach((r) => {
  console.log(arr.slice(r * rowLen, (r + 1) * rowLen))
})
document.querySelector<HTMLDivElement>('#content')!.innerHTML =
  visualizeSolution(matrix, rows)
