class PieceFactory {
    constructor() {
        this.pieces = [
            {
                coords: [[0,0], [0,1],[1,0],[1,1]],
                color: 'red'
            },
            {
                coords: [[0,0], [0, 1], [0, 2], [1, 2]],
                color: '#228B22'
            },
            {
                coords: [[1,0], [1, 1], [1, 2], [0, 2]],
                color: '#ff00ff'
            },            
            {
                coords: [[0, 1], [1, 1], [1, 2], [2, 2]],
                color: 'yellow'
            }

        ]

        this.current = Math.floor(Math.random() * (this.pieces.length));
        this.next = Math.floor(Math.random() * (this.pieces.length));
    }

    get() {
        this.current = this.next;
        this.next = Math.floor(Math.random() * (this.pieces.length));

        return this.pieces[this.current];
    }

}

export default PieceFactory;