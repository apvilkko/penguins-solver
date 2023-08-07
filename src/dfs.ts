import { BOARD_DIM } from './pentominoes'

abstract class DFSGraph {
  abstract adj: (v: number) => number[]
  abstract get size(): number
}

export class BoardGraph extends DFSGraph {
  board: number[]

  constructor(board: number[]) {
    super()
    this.board = board
  }

  adj = (v: number) => {
    const y0 = Math.floor(v / BOARD_DIM)
    const x0 = v % BOARD_DIM
    const a = [
      [x0 + 1, y0],
      [x0 - 1, y0],
      [x0, y0 + 1],
      [x0, y0 - 1],
    ]
      .filter(
        (pair) =>
          !(
            pair[0] < 0 ||
            pair[0] >= BOARD_DIM ||
            pair[1] < 0 ||
            pair[1] >= BOARD_DIM
          )
      )
      .map((pair) => pair[1] * BOARD_DIM + pair[0])
      .filter((i) => this.board[i] === 0)
    return a
  }

  get size(): number {
    return this.board.length
  }
}

export class DFS {
  public dfsRecursive(G: DFSGraph, startVert: number): number {
    let visited: boolean[] = Array<boolean>()
    // Pre-populate array:
    for (let i = 0; i < G.size; i++) {
      visited.push(false)
    }
    this.dfsAux(G, startVert, visited)
    return visited.filter((x) => !!x).length
  }

  private dfsAux(G: DFSGraph, v: number, visited: boolean[]) {
    visited[v] = true
    for (let adjV of G.adj(v)) {
      if (!visited[adjV]) {
        this.dfsAux(G, adjV, visited)
        // early escape hatch, no use in larger than 5 amounts
        if (visited.filter((x) => !!x).length >= 5) {
          break
        }
      }
    }
  }
}
