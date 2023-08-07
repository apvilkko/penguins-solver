import { exactCover, visualizeSolution } from './exactcover'
import { buildMatrix } from './matrix'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Penguins On Ice Solver</h1>
    <div id="content"></div>
  </div>
`

const matrix = buildMatrix()
const solution = exactCover(matrix)
console.log(solution)
document.querySelector<HTMLDivElement>('#content')!.innerHTML =
  visualizeSolution(matrix, solution)
