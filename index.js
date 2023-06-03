const c = document.getElementById("scrambler");
const ctx = c.getContext("2d");
let squareXNum = 8;
let squareYNum = 9;
//c.width = 96 * squareXNum;
//c.height = 128 * squareYNum;
let width = c.width;
let height = c.height;

let grid = false;

let squares = [];

let img = document.createElement("img");
//img.src = "./003.png";//scram.png"

console.log("hi");
let el = document.querySelector("#scrambler");

function onDragEnter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function onDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
}

function onDragLeave(e) {
    e.stopPropagation();
    e.preventDefault();
}

function onDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    setFiles(e.dataTransfer.files);
    return false;
}

el.addEventListener("dragenter", onDragEnter, false);
el.addEventListener("dragover", onDragOver, false);
el.addEventListener("dragleave", onDragLeave, false);
el.addEventListener("drop", onDrop, false);

function setFiles(files) {
    console.log(files[0]);
    img.src = files[0].name;
    img.onload = function() {
        c.width = img.width;
        c.height = img.height;
        width = c.width;
        height = c.height;

        squareXNum = Math.floor(width / 96);
        squareYNum = Math.floor(height / 128);
        
        splitSquares();
    };
    //c.width += ;
    //c.height += ;

    //splitSquares();
}


//***************************************************************************** */

function splitSquares() {
    squares = [];
    for (let x = 0; x < squareXNum; x++) {
        let column = [];
        for (let y = 0; y < squareYNum; y++) {
            column.push(new Square(x, y));
        }
        squares.push(column);
    }
}

function draw() {
    ctx.globalAlpha = 1;
    //console.log(img);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#003";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0);
    ctx.fillRect(0, 0, 96 * squareXNum, 128 * squareYNum);

    if (squares.length < 1) {
        return;
    }
    for (let x = 0; x < squareXNum; x++) {
        for (let y = 0; y < squareYNum; y++) {
            squares[x][y].draw(x, y);
        }
    }

    if (grid) {
        for (let x = 0; x < squareXNum; x++) {
            for (let y = 0; y < squareYNum; y++) {
                ctx.strokeStyle = "#d00";
                ctx.strokeRect(x * 96, y * 128, 96, 128);
            }
        }
    }
    

    if (selected != null) {
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = "#f00";
        ctx.fillRect(selected.x * 96, selected.y * 128, 96, 128);
    }
}

//96 px x 128 px
//8 x 9

class Square {
    constructor(x, y) {
        this.dx = x * 96;
        this.dy = y * 128;
    }

    draw(x, y) {
        ctx.drawImage(img, this.dx, this.dy, 96, 128, x * 96, y * 128, 96, 128);
    }
}

function determineSquare(x, y) {
    const x2 = Math.floor(x / 96);
    const y2 = Math.floor(y / 128);

    if (x2 < 0 || x2 >= squareXNum || y2 < 0 || y2 > (squareYNum - 1)) {
        console.log("no square");
        return null;
    }

    console.log(x2 + " " + y2);
    return { x: x2, y: y2 };
}

let selected = null;

function swapSquares(x1, y1, x2, y2) {
    console.log(
        "attempt swap x1: " + x1 + " y1: " + y1 + " x2: " + x2 + " y2: " + y2
    );
    let temp = new Square(0, 0);
    temp.dx = squares[x1][y1].dx;
    temp.dy = squares[x1][y1].dy;
    console.log(temp);
    squares[x1][y1] = squares[x2][y2];
    squares[x2][y2] = temp;
}

function handleClick(event) {
    console.log(event.which);
    const x = event.pageX - 5;
    const y = event.pageY - 5;

    let sq = determineSquare(x, y);

    if (sq != null) {
        if (selected != null) {
            //swap them

            swapSquares(selected.x, selected.y, sq.x, sq.y);

            selected = null;
        } else {
            console.log("new selected");
            selected = { x: sq.x, y: sq.y };
        }
    }

    //determineSquare(x, y);
}

function handleKeyDown(event) {
    if (event.key == "g") {
        grid = !grid;
    }
}

document.addEventListener("click", handleClick);

document.addEventListener("keydown", handleKeyDown);

//let loop = window.setTimeout(draw, 100)
window.setInterval(draw, 25);

document.getElementById("download").addEventListener("click", function (e) {
    // Convert our canvas to a data URL
    let canvasUrl = c.toDataURL();
    // Create an anchor, and set the href value to our data URL
    const createEl = document.createElement("a");
    createEl.href = canvasUrl;

    // This is the name of our downloaded file
    createEl.download = "download-this-canvas";

    // Click the download button, causing a download, and then remove it
    createEl.click();
    createEl.remove();
});
