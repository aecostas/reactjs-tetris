import React from 'react';

import './panel.css';

const COLOR_EMPTY = 0;

const NUMBER_OF_COLS = 10;
const NUMBER_OF_ROWS = 20;

class Panel extends React.Component {
    constructor(props) {
        super(props);

       
        let matrix = [];

        let currentPart = [[0,0], [0,1],[1,0],[1,1]];

        for (let rowIndex=0; rowIndex < NUMBER_OF_ROWS; rowIndex++) {
            let row = [];

            for (let colIndex = 0; colIndex < NUMBER_OF_COLS; colIndex++) {
                row.push({color: COLOR_EMPTY});
            }

            matrix.push(row);
        }

        this.state = {
            matrix,
            currentPart,
            shiftX: 0,
            shiftY: 0
        }

    }

    _handleClick = (e) => {

    }

    _timeout = () => {
        let [newMatrix, shiftX, shiftY] = this._down(this.state.matrix, this.state.shiftX, this.state.shiftY);

        this.setState({
            matrix: newMatrix, 
            shiftX: shiftX, 
            shiftY: shiftY});
    }

    _clearCurrentPiece = (matrix, shiftX, shiftY) => {
        this.state.currentPart.forEach(cell => {
            matrix[cell[0] + shiftY][cell[1] + shiftX].color = COLOR_EMPTY;
        });
    }

    _checkLimits = (nextShiftX, nextShiftY) => {
        const maxX = Math.max(...this.state.currentPart.map( coord => coord[0]));
        const maxY = Math.max(...this.state.currentPart.map( coord => coord[1]));

        if (nextShiftX < 0 || maxX + nextShiftX > NUMBER_OF_COLS - 1) {
            throw new Error('bounds');
        }

        if (maxY + nextShiftY > NUMBER_OF_ROWS - 1) {
            throw new Error('bounds');
        }
    }

    _right = (matrix, shiftX, shiftY) => {
        let newMatrix = [...matrix];
        let nextShiftY = shiftY;
        let nextShiftX = shiftX + 1;

        try {
            this._checkLimits(nextShiftX, nextShiftY);
        } catch (e) {
            return [matrix, shiftX, shiftY]
        }

        this._clearCurrentPiece(newMatrix, shiftX, shiftY);

        for (let cell of this.state.currentPart) {
            newMatrix[cell[0] + nextShiftY][cell[1] + nextShiftX].color = 1;
        }

        return [newMatrix, nextShiftX, nextShiftY];
    }

    _left = (matrix, shiftX, shiftY) => {
        let newMatrix = [...matrix];
        let nextShiftY = shiftY;
        let nextShiftX = shiftX - 1;

        try {
            this._checkLimits(nextShiftX, nextShiftY);
        } catch (e) {
            return [matrix, shiftX, shiftY]
        }

        this._clearCurrentPiece(newMatrix, shiftX, shiftY);

        for (let cell of this.state.currentPart) {
            newMatrix[cell[0] + nextShiftY][cell[1] + nextShiftX].color = 1;
        }

        return [newMatrix, nextShiftX, nextShiftY];
    }

    _down = (matrix, shiftX, shiftY) => {
        let newMatrix = [...matrix];
        let nextShiftY = shiftY + 1;
        let nextShiftX = shiftX;

        try {
            this._checkLimits(nextShiftX, nextShiftY);
        } catch (e) {
            return [matrix, shiftX, shiftY]
        }

        this._clearCurrentPiece(newMatrix, shiftX, shiftY);

        // draw current piece
        for (let cell of this.state.currentPart) {
            newMatrix[cell[0] + nextShiftY][cell[1] + nextShiftX].color = 1;
        }

        return [newMatrix, nextShiftX, nextShiftY];
    }

    componentDidMount() {
        setInterval(this._timeout, 500);

        document.addEventListener('keydown', event => {
            // left: 39
            // right: 37
            // up: 38
            // down: 40
            let newMatrix, shiftX, shiftY;

            if (event.keyCode === 39) {
                [newMatrix, shiftX, shiftY] = this._right(this.state.matrix, this.state.shiftX, this.state.shiftY);

            } else if (event.keyCode === 37) {
                [newMatrix, shiftX, shiftY] = this._left(this.state.matrix, this.state.shiftX, this.state.shiftY);

            } else if (event.keyCode === 40) {
                [newMatrix, shiftX, shiftY] = this._down(this.state.matrix, this.state.shiftX, this.state.shiftY);
            } 

            if ((event.keyCode === 39) || (event.keyCode === 37) || (event.keyCode === 40)) {
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
                        const styles = {};

                        if (cell.color === 1) {
                            styles.backgroundColor = 'red';
                        }

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