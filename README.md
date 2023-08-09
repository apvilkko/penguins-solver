# "Penguins On Ice" puzzle solver

## Introduction

This app solves the [SmartGames](https://www.smartgames.eu/uk/one-player-games/penguins-ice-celebration) puzzle "Penguins On Ice". The objective of the game is to arrange pieces (which are [pentominoes](https://en.wikipedia.org/wiki/Pentomino)) into a 5x5 puzzle board. Each piece has a penguin on one square, and each piece can be transformed into another pentomino via a sliding mechanism in the piece.

## The pieces

There are 5 different pieces which we will name using common pentomino names by one of their arrangements.

Here are the pieces and their possible arrangements which can be obtained by sliding a section of the piece. A 'p' character marks the position of the penguin. Note that some pieces have 3 and some 4 possible arrangements.

### T

```
p-- p-- pxx
x-- xxx x--
xxx x-- x--
```

### N

```
px-- px- -px --px
-xxx xxx xxx xxx-
```

### L

```
p--- -p-- --p- ---p
xxxx xxxx xxxx xxxx
```

### W

```
px- px -px
-xx xx xx-
-x- x- x--
```

### F

```
p-- p- -p-
xx- xx -xx
-xx xx xx-
```

## The algorithm

The puzzle can be solved by an [Exact Cover](https://en.wikipedia.org/wiki/Exact_cover) algorithm, more specifically [Algorithm X](https://en.wikipedia.org/wiki/Knuth%27s_Algorithm_X) by Donald Knuth.

A matrix is built where each row contains one unique placement of a piece on the board. The matrix should cover all possible rotations for the pieces.

As such the "X" algorithm only provides a solution for placing the pieces on the board and achieving "full cover". To provide input, i.e. a challenge of 1-5 penguins being in specific board squares, we need to check these positions while building the matrix. This effectively removes rows from the problem matrix and makes the problem faster to solve (provided that the input has a valid solution).

## Development

```
npm install
npm run dev
```
