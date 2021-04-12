// Display/UI

// v 1. Populate a board with tiles/mines
// v 2. Left click on tiles
    // a. Reveal tiles
// v 3. Right click on tiles
    // v a. Mark mines
// 4. Check for win/loss

import { 
    TILE_STATUS, 
    createBoard, 
    markTile, 
    revealTile, 
    checkWin, 
    checkLose, 
} from './minesweeper.js'

const BOARD_SIZE = document.querySelector('[data-size]').value
const NUMBER_OF_MINES = document.querySelector('[data-mineCount]').value
const UPDATE_VALUE = document.querySelector('[data-update]')

UPDATE_VALUE.addEventListener('click', game)

function game(){
    const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
    const boardElement = document.querySelector('.board')
    const mineLeftText = document.querySelector('[data-mine-count]')
    const massageText = document.querySelector('.subtext')
    const settings = document.querySelector('.setting')

    console.log(boardElement.classList)
    boardElement.classList.add('show')
    massageText.classList.add('show')
    settings.classList.add('hide')

    board.forEach( row => {
        row.forEach( tile => {
            boardElement.append(tile.element)
            tile.element.addEventListener('click', () => {
                revealTile(board, tile)
                checkGameEnd()
            })
            tile.element.addEventListener('contextmenu', e => {
                e.preventDefault()
                markTile(tile)
                listMineLeft()
            })
        })
    })
    boardElement.style.setProperty('--size',BOARD_SIZE)
    mineLeftText.textContent = NUMBER_OF_MINES

    function listMineLeft() {
        const markedMinesCount = board.reduce((count, row) => {
            return count + row.filter(tile => tile.status === TILE_STATUS.MARKED).length
        }, 0)

        mineLeftText.textContent = NUMBER_OF_MINES - markedMinesCount
    }

    function checkGameEnd() {
        const win = checkWin(board)
        const lose = checkLose(board)
        if (win || lose) {
            boardElement.addEventListener('click',stopProp, { capture: true })
            boardElement.addEventListener('contextmenu',stopProp, { capture: true })
        }
        if (win) {
            massageText.textContent = 'You Win!'
        }
        if (lose) {
            massageText.textContent = 'You Lose!'
            board.forEach(row => {
                row.forEach(tile => {
                    if (tile.status === TILE_STATUS.MARKED) markTile(tile)
                    if (tile.mine) revealTile(board, tile)
                })
            })
        }
    }

    function stopProp(e) {
        e.stopImmediatePropagation()
    }
}