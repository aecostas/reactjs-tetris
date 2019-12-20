import React from 'react';

import './panel.css';

const COLOR_EMPTY = 'blue';

const NUMBER_OF_COLS = 10;
const NUMBER_OF_ROWS = 20;

const KEY_RIGHT = 37;
const KEY_UP = 38;
const KEY_LEFT = 39;
const KEY_DOWN = 40;

class Panel extends React.Component {
    constructor(props) {
        super(props);

        let matrix = [];

        let currentPiece = {
            coords: [[0,0], [0,1],[1,0],[1,1]],
            color: 'red'
        }

        for (let rowIndex=0; rowIndex < NUMBER_OF_ROWS; rowIndex++) {
            let row = [];

            for (let colIndex = 0; colIndex < NUMBER_OF_COLS; colIndex++) {
                row.push({color: COLOR_EMPTY, blocked: false});
            }

            matrix.push(row);
        }

        this.state = {
            matrix,
            currentPiece,
            shiftX: 0,
            shiftY: 0
        }

        this.shift = {
            right: (x, y) => [x + 1, y],
            left: (x, y) => [x - 1, y],
            down: (x, y) => [x, y + 1]
        }
    }

    _timeout = () => {
        let newMatrix, shiftX, shiftY;

        try {
            [newMatrix, shiftX, shiftY] = this._move('down', this.state.matrix, this.state.shiftX, this.state.shiftY);
        } catch (e) {
            if (e.message === 'bounds-down' || e.message === 'overlap') {
                newMatrix = [...this.state.matrix];
                this._blockCurrentPiece(newMatrix);
                const filledRows = this._checkFilledRows();
                newMatrix = this._removeRows(filledRows);

                shiftX = 0;
                shiftY = 0;
            }
        }

        this.setState({
            matrix: newMatrix, 
            shiftX: shiftX, 
            shiftY: shiftY});
    }

    _blockCurrentPiece = (matrix) => {
        this.state.currentPiece.coords.forEach(cell => {
            matrix[cell[0] + this.state.shiftY][cell[1] + this.state.shiftX].blocked = true;
        });
    }

    _clearCurrentPiece = (matrix, shiftX, shiftY) => {
        this.state.currentPiece.coords.forEach(cell => {
            matrix[cell[0] + shiftY][cell[1] + shiftX].color = COLOR_EMPTY;
        });
    }

    _checkOverlapping = (shiftX, shiftY) => {
        this.state.currentPiece.coords.forEach(coord => {
            if (this.state.matrix[coord[0] + shiftY][coord[1] + shiftX].blocked) {
                throw new Error('overlap')
            }
        });
    }

    _checkFilledRows = () => {
        const filledRows = this.state.matrix
            .map(row => {
                return row.filter(cell => !cell.blocked).length === 0
            })
            .map( (filled, index) => {
                if (filled) {
                    return index;
                } else {
                    return -1;
                }
            })
            .filter( index => index !== -1)

        return filledRows;
    }

    _removeRows = (rowIndexes) => {
        let newMatrix = [...this.state.matrix]
        let newRows = [];

        for (let index of rowIndexes) {
            newMatrix[index] = undefined;

            let row = [];

            for (let colIndex = 0; colIndex < NUMBER_OF_COLS; colIndex++) {
                row.push({color: COLOR_EMPTY, blocked: false});
            }

            newRows.push(row);
        }
        newMatrix = newMatrix.filter(row => row !== undefined);

        return [...newRows, ...newMatrix];
    }

    _checkLimits = (nextShiftX, nextShiftY) => {
        const maxX = Math.max(...this.state.currentPiece.coords.map( coord => coord[0]));
        const maxY = Math.max(...this.state.currentPiece.coords.map( coord => coord[1]));

        if (nextShiftX < 0 || maxX + nextShiftX > NUMBER_OF_COLS - 1) {
            throw new Error('bounds');
        }

        if (maxY + nextShiftY > NUMBER_OF_ROWS - 1) {
            throw new Error('bounds-down');
        }
    }

    _move = (direction ,matrix, shiftX, shiftY) => {
        let newMatrix = [...matrix];
        const [nextShiftX, nextShiftY] = this.shift[direction](shiftX, shiftY);

        this._checkLimits(nextShiftX, nextShiftY);
        this._checkOverlapping(nextShiftX, nextShiftY);
        this._clearCurrentPiece(newMatrix, shiftX, shiftY);

        for (let cell of this.state.currentPiece.coords) {
            newMatrix[cell[0] + nextShiftY][cell[1] + nextShiftX].color = this.state.currentPiece.color;
        }

        return [newMatrix, nextShiftX, nextShiftY];
    }


    componentDidMount() {
        setInterval(this._timeout, 500);

        document.addEventListener('keydown', event => {
         
            let newMatrix = [...this.state.matrix];
            let shiftX = this.state.shiftX;
            let shiftY = this.state.shiftY;

            try {
                if (event.keyCode === KEY_LEFT) {
                    [newMatrix, shiftX, shiftY] = this._move('right', this.state.matrix, this.state.shiftX, this.state.shiftY);

                } else if (event.keyCode === KEY_RIGHT) {
                    [newMatrix, shiftX, shiftY] = this._move('left', this.state.matrix, this.state.shiftX, this.state.shiftY);
                } 
            } catch(e) {

            }

            if (event.keyCode === KEY_DOWN) {
                try {
                    [newMatrix, shiftX, shiftY] = this._move('down', this.state.matrix, this.state.shiftX, this.state.shiftY);
                } catch (e) {
                    if (e.message === 'overlap' || e.message === 'bounds-down') {
                        this._blockCurrentPiece(newMatrix);
                        const filledRows = this._checkFilledRows();
                        newMatrix = this._removeRows(filledRows);

                        shiftX = 0;
                        shiftY = 0;
                    }
                }
            } 

            if ((event.keyCode === KEY_LEFT) || (event.keyCode === KEY_RIGHT) || (event.keyCode === KEY_DOWN)) {
                this.setState({
                    matrix: newMatrix, 
                    shiftX: shiftX, 
                    shiftY: shiftY
                });
            }

        });
    }

    render () {
        return (
            <div 
                className='panel'
                onKeyPress={this._handleClick}
            >
                <div className='parent'>
                    {this.state.matrix.flat().map(cell => {
                        const styles = {
                            backgroundColor: cell.color
                        };

                        return (
                            <div 
                                className='cell'
                                style = {styles}  
                            >
                            </div>)
                    })}
                </div>
            </div>
        );
    }
}

export default Panel;