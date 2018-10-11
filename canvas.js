
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
        let alive = 0;
        alive = this.getCell(x - 1, y - 1) === 1 ? alive + 1 : alive;
        alive = this.getCell(x, y - 1) === 1 ? alive + 1 : alive;
        alive = this.getCell(x + 1, y - 1) === 1 ? alive + 1 : alive;
        alive = this.getCell(x - 1, y) === 1 ? alive + 1 : alive;
        alive = this.getCell(x + 1, y) === 1 ? alive + 1 : alive;
        alive = this.getCell(x - 1, y + 1) === 1 ? alive + 1 : alive;
        alive = this.getCell(x, y + 1) === 1 ? alive + 1 : alive;
        alive = this.getCell(x + 1, y + 1) === 1 ? alive + 1 : alive;
        return alive;
    }
    getCell(x, y) {
        if(x > this.gridWidth - 1) {
            x = x - this.gridWidth;
        }
        if(y > this.gridHeight - 1) {
            y = y - this.gridHeight;
        }
        if(x < 0) {
            x = this.gridWidth - 1;
        }
        if(y < 0) {
            y = this.gridHeight - 1;
        }
        return this.grid[y][x];
    }
    nextGeneration() {
        this.next = this.newEmptyGrid();
        for(let y = 0; y < this.gridHeight; y++) {
            for(let x = 0; x < this.gridWidth; x++) {
                let alive = this.grid[y][x] === 1;
                let neighbours = this.getNeighbours(x, y);

                if((neighbours === 2 || neighbours === 3) && alive) {
                    this.next[y][x] = 1;
                }
                if(neighbours === 3 && !alive) {
                    this.next[y][x] = 1;
                }
                if((neighbours < 2 || neighbours > 3) && alive) {
                    this.next[y][x] = 0;
                }
            }
        }
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
        this.grid = this.newEmptyGrid();

        setInterval(() => {
            this.nextGeneration();
            this.draw();
        }, 50)
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

document.addEventListener("DOMContentLoaded", function() {
    let canvas = new Canvas(document.getElementById("canvas"));
    canvas.setup();
    canvas.grid[3][3] = 1;
    canvas.grid[4][4] = 1;

    canvas.grid[5][2] = 1;
    canvas.grid[5][3] = 1;
    canvas.grid[5][4] = 1;
    canvas.draw();
});