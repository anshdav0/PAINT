const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let data = localStorage.getItem("Load");

let primColor = "black";
let renders = [];
if (data) {
    renders = JSON.parse(data);
}
let history = [];
let undoptr = -1;
let linewid = 2;
const slider = document.getElementById("widthofline");
slider.style.setProperty("--val", (linewid / 20) * 100 + "%");
if (data) {
    undoptr++;
    history.push(JSON.parse(JSON.stringify(renders)));
    draw();
}
console.log(renders);
console.log(history);

document.getElementById("widthofline").addEventListener("input", (e) => {
    linewid = parseInt(e.target.value);
});

function setCol(color) {
    primColor = color;
    ctx.strokeStyle = primColor;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let el of history[undoptr]){
        drawElement(el);
        console.log(undoptr);
    }
}

function drawElement(el) {

    if (el.type === "rect") {
        ctx.lineWidth = el.lineWid;
        if (el.fillcolor) {
            ctx.fillStyle = el.fillcolor;
            ctx.fillRect(el.x, el.y, el.width, el.height);
        }
        ctx.strokeStyle = el.boundcolor;
        ctx.strokeRect(el.x, el.y, el.width, el.height);
        console.log(renders);
        console.log(history);
    }

    else if (el.type === "cir") {
        ctx.beginPath();
        ctx.strokeStyle = el.boundcolor;
        ctx.lineWidth = el.lineWid;
        ctx.arc(el.x, el.y, el.radius , 0, Math.PI * 2);
        if (el.fillcolor) {
            ctx.fillStyle = el.fillcolor;
            ctx.fill();
        }
        ctx.stroke();
    }

    else if (el.type === "tri") {
        ctx.beginPath();
        ctx.strokeStyle = el.boundcolor;
        ctx.lineWidth = el.lineWid;
        ctx.moveTo(el.x1, el.y1);
        ctx.lineTo(el.x2, el.y2);
        ctx.lineTo(el.x3, el.y3);
        ctx.closePath();
        if (el.fillcolor) {
            ctx.fillStyle = el.fillcolor;
            ctx.fill();
        }
        ctx.stroke();
    }

    else if (el.type === "stroke") {
        ctx.beginPath();
        ctx.strokeStyle = el.boundcolor;
        ctx.lineWidth = el.lineWid;
        ctx.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length; i++) {
            ctx.lineTo(el.points[i].x, el.points[i].y);
        }
        ctx.stroke();
    }

    else if (el.type === "stroke2") {
        ctx.beginPath();
        ctx.strokeStyle = el.boundcolor;
        ctx.lineWidth = el.lineWid;
        ctx.moveTo(el.points[0].x, el.points[0].y);
        for (let i = 1; i < el.points.length; i++) {
            ctx.lineTo(el.points[i].x, el.points[i].y);
            ctx.lineTo(el.points[i].x, el.points[i].y);
            ctx.lineTo(el.points[i].x + 2, el.points[i].y + 2);
            ctx.lineTo(el.points[i].x + 1, el.points[i].y + 1);
            ctx.lineTo(el.points[i].x - 1, el.points[i].y - 1);
            ctx.lineTo(el.points[i].x - 2, el.points[i].y - 2);
        }
        ctx.stroke();
    }

    else if (el.type === "text") {
        ctx.font = `${el.fontSize}rem ${el.font}`;
        ctx.fillStyle = el.boundcolor;
        ctx.lineWidth = el.lineWid;
        ctx.fillText(el.content, el.x, el.y);
    }

    
}


window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z" && undoptr >= 0) {
        undoptr--;
        draw();
        renders = JSON.parse(JSON.stringify(history[undoptr]));
    }
    if (e.ctrlKey && e.key === "y" && undoptr < history.length - 1) {
        undoptr++;
        draw();
        renders = JSON.parse(JSON.stringify(history[undoptr]));
    }
    if (e.ctrlKey && e.key === "s") {
        save();
    }
    if (e.key === "r") {
        drawRect();
    }
    if (e.key === "c") {
        drawCir();
    }
    if (e.key === "t") {
        drawTri();
    }
});




function identify(px, py) {
    for (let k = (history[undoptr]).length - 1; k >= 0; k--) {
        if (position_finder(history[undoptr][k], px, py)) {
            console.log(84);
            return k;
        }
    }
    return null;
}



function position_finder(el, px, py) {
    if (el.type === "rect") {
        return (px >= el.x && px <= (el.x + el.width) && py >= el.y && py <= (el.y + el.height))
    }

    else if (el.type === "cir") {
        return (Math.sqrt((px - el.x)**2 + (py - el.y)**2) <= el.radius)
    }

    else if (el.type === "tri") {
        return triangleinside(px, py, el);
    }
    else if (el.type === "text") {

    }
}


function triangleinside(px, py, el) {
    let big = triarea(el.x1, el.y1, el.x2, el.y2, el.x3, el.y3);
    let s1 = triarea(px, py, el.x2, el.y2, el.x3, el.y3);
    let s2 = triarea(el.x1, el.y1, px, py, el.x3, el.y3);
    let s3 = triarea(el.x1, el.y1, el.x2, el.y2, px, py);

    return (Math.abs(big - s1 - s2 - s3) < 0.1);
}

function triarea(x1,y1,x2,y2,x3,y3) {
    return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2))/2.0);
}


function save() {
    let load = JSON.stringify(history[undoptr]);
    localStorage.setItem("Load", load);
}

function reset() {
    localStorage.clear();
    location.reload();
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
});

colorPicker.addEventListener('input', (e) => {
    setCol(e.target.value);
});


function theme() {
    const html = document.documentElement;

    if (html.getAttribute("data-theme") === "dark") {
        html.removeAttribute("data-theme");
        for (let el of history[undoptr]) {
            if (el.boundcolor === "white") {
                el.boundcolor = "black";
            }
        }
        draw();
    }
    else {
        html.setAttribute("data-theme", "dark");
        for (let el of history[undoptr]) {
            if (el.boundcolor === "black") {
                el.boundcolor = "white";
            }
        }
        draw();
    }
}


