import { DoublyLinkedMatrix } from './doublylinkedmatrix'
import { renderBoard } from './draw'
import { exactCover, visualizeSolution } from './exactcover'
import { buildMatrix, toArray } from './matrix'
import { BOARD_DIM } from './pentominoes'
import type { MatrixCell } from './types'
import './style.css'

let store: { challenge: number[] }

const initStore = () => {
  return {
    challenge: Array.from({ length: BOARD_DIM * BOARD_DIM }).map(() => 0),
  }
}

const renderChallenge = () => {
  document.querySelector<HTMLDivElement>('#content')!.innerHTML = renderBoard(
    store.challenge,
    5,
    'challenge'
  )
}

const clear = () => {
  store = initStore()
  renderChallenge()
}

const solve = (challenge: number[]) => {
  const matrix = buildMatrix(challenge as MatrixCell[])
  const arr = toArray(matrix)
  const rowLen = matrix[0].length
  const dllMatrix = new DoublyLinkedMatrix(arr, rowLen)
  const [success, rows] = exactCover(dllMatrix)
  document.querySelector<HTMLDivElement>('#content')!.innerHTML =
    renderBoard(challenge, 5, 'challenge') +
    (success ? '<p>Solved successfully</p>' : '<p>Unsolvable</p>') +
    visualizeSolution(matrix, rows)
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Penguins On Ice Solver</h1>
    <button id="solve" type="button">Solve</button>
    <button id="clear" type="button">Clear</button>
    <div id="content"></div>
    <p>Instructions: Place penguins (max 5) on the board by clicking and press "solve". Unsolvable arrangements may take a while to finish.</p>
    <footer><a href="https://github.com/apvilkko/penguins-solver">Docs and source on github</a></footer>
  </div>
`

clear()

document.getElementById('solve')!.addEventListener('click', () => {
  solve(store.challenge)
})

document.getElementById('clear')!.addEventListener('click', () => {
  clear()
})

document.addEventListener('click', (e: Event) => {
  const fullId = (e.target as HTMLDivElement).id || ''
  const id = fullId.split('-')
  const y = Number(id.pop())
  const x = Number(id.pop())
  if (fullId.includes('challenge') && !Number.isNaN(x) && !Number.isNaN(y)) {
    const pos = y * BOARD_DIM + x
    const value = store.challenge[pos] === 2 ? 0 : 2
    store = {
      ...store,
      challenge: [
        ...store.challenge.slice(0, pos),
        value,
        ...store.challenge.slice(pos + 1),
      ],
    }
    renderChallenge()
  }
})
