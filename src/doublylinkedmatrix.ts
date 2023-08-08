export class DataObject {
  L: DataObject | undefined
  R: DataObject | undefined
  U: DataObject | undefined
  D: DataObject | undefined
  C: DataObject | undefined
  N: string
  S: number | undefined

  constructor(n: string, l?: DataObject) {
    this.N = n
    this.L = l
  }

  append(other: DataObject) {
    this.R = other
    other.L = this
  }

  appendDown(other: DataObject) {
    this.D = other
    other.U = this
  }

  public toString() {
    return `DataObject(${this.N})`
  }
}

export class DoublyLinkedMatrix {
  root: DataObject
  height: number

  constructor(board: number[], width: number) {
    this.root = new DataObject('R')

    // Build column object links
    let prev: DataObject = this.root
    for (let i = 0; i < width; ++i) {
      const col: DataObject = new DataObject(`C${i}`)
      col.S = 0
      col.C = col
      prev.append(col)
      prev = col
    }
    prev.append(this.root)

    // Add vertical links
    const height = board.length / width
    this.height = height
    if (!Number.isInteger(height)) {
      throw new Error('matrix dimensions do not match')
    }
    let node = this.root
    let column = this.root
    for (let i = 0; i < width; ++i) {
      node = node.R!
      column = node
      for (let j = 0; j < height; ++j) {
        const value = board[j * width + i]
        if (value > 0) {
          const cell = new DataObject(`${i},${j}`)
          cell.C = column
          node.appendDown(cell)
          node = cell
        }
      }
      // last cell wraps around to column object
      node.appendDown(column)
      node = column
    }

    // Add horizontal links
    for (let j = 0; j < height; ++j) {
      const indexes = []
      for (let i = 0; i < width; ++i) {
        const value = board[j * width + i]
        if (value > 0) {
          indexes.push(i)
        }
      }
      if (indexes.length === 0) {
        continue
      }
      const first = this.get(indexes[0], j)!
      let node = first
      for (let x = 1; x < indexes.length; ++x) {
        const current = this.get(indexes[x], j)!
        node.append(current)
        node = current
      }
      node.append(first)
    }
  }

  get = (i: number, j: number): DataObject | undefined => {
    let node = this.root
    for (let x = 0; x <= i; ++x) {
      node = node.R!
    }
    let a = 0
    while (a <= this.height) {
      node = node.D!
      if (node.N === `${i},${j}`) {
        return node
      }
      a++
    }
    console.log('get returns undefined', i, j)
    return undefined
  }

  getS = (columnObject: DataObject): number => {
    let node = columnObject
    let amount = 0
    while (node.D !== columnObject) {
      node = node.D!
      amount++
    }
    return amount
  }
}
