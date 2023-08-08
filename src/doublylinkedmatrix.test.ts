import { DataObject, DoublyLinkedMatrix } from './doublylinkedmatrix'

describe('Doubly Linked Matrix', () => {
  it('constructs valid links', () => {
    // prettier-ignore
    const board = [
      0, 1, 0, 0, 0,
      1, 0, 0, 0, 0,
      0, 0, 0, 2, 0,
      1, 1, 1, 1, 0,
      0, 0, 0, 0, 0
    ]
    const m = new DoublyLinkedMatrix(board, 5)
    expect(m.root.N).toEqual('R')
    let d: DataObject = m.root.R!
    expect(d.N).toEqual('C0')

    expect(d.D?.N).toEqual('0,1')
    expect(d.D?.L?.N).toEqual('0,1')

    expect(d.D?.D?.N).toEqual('0,3')
    expect(d.D?.D?.R?.N).toEqual('1,3')
    expect(d.D?.D?.R?.R?.N).toEqual('2,3')
    expect(d.D?.D?.R?.R?.R?.N).toEqual('3,3')
    expect(d.D?.D?.R?.R?.R?.R?.N).toEqual('0,3')

    d = d.R!
    expect(d.N).toEqual('C1')

    expect(d.D?.N).toEqual('1,0')

    expect(d.D?.C?.N).toEqual('C1')

    expect(d.D?.D?.N).toEqual('1,3')

    d = d.R!
    expect(d.N).toEqual('C2')

    expect(d.U?.N).toEqual('2,3')

    d = d.R!
    expect(d.N).toEqual('C3')
    d = d.R!
    expect(d.N).toEqual('C4')

    // should wrap around for column with all zeros
    expect(d.U?.N).toEqual('C4')
    expect(d.D?.N).toEqual('C4')

    d = d.R!
    expect(d.N).toEqual('R')

    d = d.L!
    expect(d.N).toEqual('C4')
    d = d.L!
    expect(d.N).toEqual('C3')
    d = d.L!
    expect(d.N).toEqual('C2')
    d = d.L!
    expect(d.N).toEqual('C1')
    d = d.L!
    expect(d.N).toEqual('C0')
    d = d.L!
    expect(d.N).toEqual('R')
  })
})
