// logic

export const TILE_STATUS = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked",
}

export function createBoard(borderSize, numberOfMines) {
    const board = []
    const minePositions = getMinePositions(borderSize, numberOfMines)

    for (let x = 0; x < borderSize; x++) {
        const row = []
        for (let y = 0; y < borderSize; y++) {
            const element = document.createElement('div')
            element.dataset.status = TILE_STATUS.HIDDEN

            const tile = {
                element,
                x,
                y,
                mine: minePositions.some(positionMatch.bind(null, { x, y})),
                get status() {
                    return this.element.dataset.status
                },
                set status(value) {
                    this.element.dataset.status = value
                },
            }
            row.push(tile)
        }
        board.push(row)
    }
    return board
}

export function markTile(tile) {
    if (tile.status !== TILE_STATUS.HIDDEN &&
        tile.status !== TILE_STATUS.MARKED){
        return 
    }
    if (tile.status === TILE_STATUS.MARKED) {
        tile.status = TILE_STATUS.HIDDEN
    }else {
        tile.status = TILE_STATUS.MARKED
    }
}

export function revealTile(board, tile) {
    if (tile.status !== TILE_STATUS.HIDDEN) {
        return
    }

    if (tile.mine) {
        tile.status = TILE_STATUS.MINE
        return
    }

    tile.status = TILE_STATUS.NUMBER
    const adjacentTiles = nearByTiles(board, tile)
    const mines = adjacentTiles.filter(t => t.mine)
    if (mines.length === 0) {
        adjacentTiles.forEach(revealTile.bind(null, board))
    }else {
        tile.element.textContent = mines.length
    }
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return (
                tile.status === TILE_STATUS.NUMBER || 
                (tile.mine && 
                    (tile.status === TILE_STATUS.HIDDEN ||
                        tile.status === TILE_STATUS.MARKED))
            )
        })
    })
}

export function checkLose(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUS.MINE
        })
    })
}

function getMinePositions(borderSize, numberOfMines) {
    const positions = []

    while (positions.length < numberOfMines) {
        const position = {
            x: randomNumber(borderSize),
            y: randomNumber(borderSize)
        }

        if (!positions.some(positionMatch.bind(null, position))){
            positions.push(position)
        }
    }

    return positions
}

function positionMatch(a ,b) {
    return a.x === b.x && a.y === b.y
}

function randomNumber(size) {
    return Math.floor(Math.random() * size)
}

function nearByTiles(board, { x, y }){
    const tiles = []

    for (var xOffset = -1; xOffset <= 1; xOffset++) {
        for (var yOffset = -1; yOffset <= 1; yOffset++) {
            const tile = board[x + xOffset]?.[y + yOffset]
            if (tile) tiles.push(tile)
        }
    }

    return tiles
}