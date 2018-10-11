
class Canvas {
    constructor(canvas, button, interval) {
        this.canvas = canvas;
        this.button = button;
        this.ctx = this.canvas.getContext("2d");

        this.interval = interval;
        this.started = false;

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
        let noAlive = true;
        this.next = this.newEmptyGrid();
        for(let y = 0; y < this.gridHeight; y++) {
            for(let x = 0; x < this.gridWidth; x++) {
                let alive = this.grid[y][x] === 1;
                let neighbours = this.getNeighbours(x, y);

                if((neighbours === 2 || neighbours === 3) && alive) {
                    noAlive = false;
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
        if(noAlive) {
            this.stop();
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
    }
    loop() {
        if(this.started) {
            setTimeout(() => {
                console.log(this.interval);
                this.nextGeneration();
                this.draw();

                this.loop();
            }, this.interval.value);
        }
    }
    start() {
        this.started = true;
        this.button.innerText = "Stop";
        this.loop();
    }
    stop() {
        this.started = false;
        this.button.innerText = "Start";
    }
    draw() {
        for(let y = 0; y < this.gridHeight; y++) {
            for(let x = 0; x < this.gridWidth; x++) {
                this.ctx.fillStyle = this.grid[y][x] === 0 ? '#ffffff' : '#000000';
                this.ctx.fillRect(x * this.gridSpace, y * this.gridSpace, this.gridSpace, this.gridSpace);
            }
        }
    }
    randomize() {
        for(let y = 0; y < this.gridHeight; y++) {
            for(let x = 0; x < this.gridWidth; x++) {
                let alive = Math.round(Math.random());
                if(alive) {
                    this.drawCell({x: x, y: y}, false);
                }
            }
        }
    }
    drawCell(pos, isMouse) {
        if(!this.started) {
            let x = isMouse ? Math.floor(pos.x / this.gridSpace) : pos.x;
            let y = isMouse ? Math.floor(pos.y / this.gridSpace) : pos.y;

            this.grid[y][x] = this.grid[y][x] === 0 ? 1 : 0;

            this.draw();
        }
    }
}

let canvas;

const getMousePos = (c, e) => {
    let rect = c.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}

const pressButton = () => {
    if(!canvas.started) {
        canvas.start();

    } else {
        canvas.stop();
    }
}

const randomize = () => {
    canvas.randomize();
}

document.addEventListener("DOMContentLoaded", () => {
    let c = document.getElementById("canvas");
    let button = document.getElementById("button");
    let interval = document.getElementById("speed");

    canvas = new Canvas(c, button, interval);
    canvas.setup();

    c.addEventListener('click', (e) => {
        let mousePos = getMousePos(c, e);
        canvas.drawCell(mousePos, true);
    }, false);
});