
class Canvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        this.next = [];
        this.grid = [];
        this.gridSpace = 10;
        this.gridWidth = Math.floor(this.canvas.width / this.gridSpace);
        this.gridHeight = Math.floor(this.canvas.height / this.gridSpace);
    }
    getNeighbours(x, y) {
        let neighbours = [];
        if(this.inBounds(x - 1, y - 1)) {
            neighbours.push(this.grid[y - 1][x - 1]);
        }
        if(this.inBounds(x, y - 1)) {
            neighbours.push(this.grid[y - 1][x]);
        }
        if(this.inBounds(x + 1, y - 1)) {
            neighbours.push(this.grid[y - 1][x + 1]);
        }
        if(this.inBounds(x - 1, y)) {
            neighbours.push(this.grid[y][x - 1]);
        }
        if(this.inBounds(x + 1, y)) {
            neighbours.push(this.grid[y][x + 1]);
        }
        if(this.inBounds(x - 1, y + 1)) {
            neighbours.push(this.grid[y + 1][x - 1]);
        }
        if(this.inBounds(x, y + 1)) {
            neighbours.push(this.grid[y + 1][x]);
        }
        if(this.inBounds(x + 1, y + 1)) {
            neighbours.push(this.grid[y + 1][x + 1]);
        }

        return neighbours;
    }
    inBounds(x, y) {
        let inBound = true;
        if(x < 0 || x > this.gridWidth - 1) {
            inBound = false;
        }
        if(y < 0 || y > this.gridHeight - 1) {
            inBound = false;
        }
        return inBound;
    }
    getAlive(neighbours) {
        let alive = [];
        for(let i = 0; i < neighbours.length; i++) {
            if(neighbours[i] === 1) {
                alive.push(neighbours[i]);
            }
        }
        return alive;
    }
    nextGeneration() {
        this.next = this.newEmptyGrid();
        for(let y = 0; y < this.gridHeight; y++) {
            for(let x = 0; x < this.gridWidth; x++) {
                let alive = this.grid[y][x] === 1;
                let neighbours = this.getNeighbours(x, y);
                let aliveNeighbours = this.getAlive(neighbours);

                if((aliveNeighbours.length === 2 || aliveNeighbours.length === 3) && alive) {
                    this.next[y][x] = 1;
                }
                if(aliveNeighbours.length === 3 && !alive) {
                    this.next[y][x] = 1;
                }
                if((aliveNeighbours.length < 2 || aliveNeighbours.length > 3) && alive) {
                    console.log("huh");
                    this.next[y][x] = 0;
                }
            }
        }
        console.log(this.next);
        this.grid = this.next;
    }
    newEmptyGrid() {
        let empty = [];
        for(let y = 0; y < this.gridHeight; y++) {
            empty.push([]);
            for(let x = 0; x < this.gridWidth; x++) {
                empty[y][x] = 0;
            }
        }
        return empty;
    }
    setup() {
        for(let y = 0; y < this.gridHeight; y++) {
            this.grid.push([]);
            this.next.push([]);
            for(let x = 0; x < this.gridWidth; x++) {
                this.grid[y][x] = 0;
                this.next[y][x] = 0;
            }
        }
    }
    draw() {
        for(let y = 0; y < this.gridHeight; y++) {
            for(let x = 0; x < this.gridWidth; x++) {
                this.ctx.fillStyle = this.grid[y][x] === 0 ? '#ffffff' : '#000000';
                this.ctx.fillRect(x * this.gridSpace, y * this.gridSpace, this.gridSpace, this.gridSpace);
            }
        }
    }
}

let canvas;

function next() {
    canvas.nextGeneration();
    canvas.draw();
}

document.addEventListener("DOMContentLoaded", function() {
    canvas = new Canvas(document.getElementById("canvas"));
    canvas.setup();
    canvas.grid[3][3] = 1;
    canvas.grid[4][4] = 1;

    canvas.grid[5][2] = 1;
    canvas.grid[5][3] = 1;
    canvas.grid[5][4] = 1;
    canvas.draw();
});