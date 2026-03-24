let itemchosen = "";
let srecx, srecy;
let frame;


function drawRect() {
    if(itemchosen === "rec"){
        itemchosen = "";
    }
    else{
        itemchosen = "rec";
    }

    if(itemchosen === "rec") {
        canvas.style.cursor = "crosshair";
    }
    else {
        canvas.style.cursor = "default";
    }
}

canvas.addEventListener("mousedown", (e) => {
    if (itemchosen !== "rec") return;
    srecx = e.offsetX;
    srecy = e.offsetY;
    frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener("mousemove", (e) => {
    if (itemchosen !== "rec") return;
    if (!frame) return;
    ctx.putImageData(frame, 0, 0);
    ctx.lineWidth = linewid;
    ctx.strokeRect(srecx, srecy, e.offsetX - srecx, e.offsetY - srecy);
});

canvas.addEventListener("mouseup", (e) => {
    if (itemchosen !== "rec") return;
    if (!frame) return;
    ctx.putImageData(frame, 0, 0);
    const el = {
        type: "rect",
        x: srecx,
        y: srecy,
        width: e.offsetX - srecx,
        height: e.offsetY - srecy,
        lineWid: linewid,
        centrex: srecx + (e.offsetX - srecx) / 2,
        centrey: srecy + (e.offsetY - srecy) / 2,
        boundcolor: primColor,
        fillcolor: null,
    }
     
    history.splice(undoptr + 1);
    renders.push(el);
    undoptr++;
    history.push(JSON.parse(JSON.stringify(renders)));
    draw();
    frame = null;

});







let scircenx, scirceny;

function drawCir() {
    if(itemchosen === "cir"){
        itemchosen = "";
    }
    else{
        itemchosen = "cir";
    }

    if(itemchosen === "cir") {
        canvas.style.cursor = "crosshair";
    }
    else {
        canvas.style.cursor = "default";
    }
}

canvas.addEventListener("mousedown", (e) => {
    if (itemchosen !== "cir") return;
    scircenx = e.offsetX;
    scirceny = e.offsetY;
    frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener("mousemove", (e) => {
    if (itemchosen !== "cir") return;
    if (!frame) return;
    ctx.putImageData(frame, 0, 0);
    ctx.beginPath();
    ctx.lineWidth = linewid;
    ctx.arc(scircenx, scirceny, Math.sqrt((e.offsetX - scircenx)**2 + (e.offsetY - scirceny)**2) , 0, Math.PI * 2);
    ctx.stroke();
});

canvas.addEventListener("mouseup", (e) => {
    if (itemchosen !== "cir") return;
    if (!frame) return;
    ctx.putImageData(frame, 0, 0);
    console.log(2);
    const el = {
        type: "cir",
        x: scircenx,
        y: scirceny,
        radius: Math.sqrt((e.offsetX - scircenx)**2 + (e.offsetY - scirceny)**2),
        centrex: scircenx,
        centrey: scirceny,
        lineWid: linewid,
        boundcolor: primColor,
        fillcolor: null,
    }
     
    history.splice(undoptr + 1);
    renders.push(el);
    undoptr++;
    history.push(JSON.parse(JSON.stringify(renders)));
    draw();
    frame = null;
});



function selection() {
    if(itemchosen === "sel"){
        itemchosen = "";
    }
    else{
        itemchosen = "sel";
    }
    canvas.style.cursor = "default";
}

canvas.addEventListener("click", (e) => {
    if (itemchosen !== "sel") return;
    console.log(identify(e.offsetX, e.offsetY));
});


function fillcolr() {
    if(itemchosen === "filc"){
        itemchosen = "";
    }
    else{
        itemchosen = "filc";
    }

    canvas.style.cursor = "default";
}

canvas.addEventListener("click", (e) => {
    if (itemchosen !== "filc") {return;}
    let ele = identify(e.offsetX, e.offsetY);
    if (ele === null) {return;}
    history[undoptr][ele].fillcolor = primColor;
    renders[ele].fillcolor = primColor;
     
    history.splice(undoptr + 1);
    undoptr++;
    history.push(JSON.parse(JSON.stringify(renders)));
    draw();
});




let trix1, triy1, trix2, triy2, trix3, triy3;
let i=0;
function drawTri() {
    if(itemchosen === "tri"){
        itemchosen = "";
    }
    else{
        itemchosen = "tri";
    }

    if(itemchosen === "tri") {
        canvas.style.cursor = "crosshair";
    }
    else {
        canvas.style.cursor = "default";
    }
}

canvas.addEventListener("click", (e) => {
    if(i === 0){
        if (itemchosen !== "tri") return;
        trix1 = e.offsetX;
        triy1 = e.offsetY;
        frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        i++;
    }
    else if(i === 1){
        if (itemchosen !== "tri") return;
        if (!frame) return;
        ctx.putImageData(frame, 0, 0);
        trix2 = e.offsetX;
        triy2 = e.offsetY;
        frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        i++
    }
    else if (i === 2){
        if (itemchosen !== "tri") return;
        if (!frame) return;
        ctx.putImageData(frame, 0, 0);
        trix3 = e.offsetX;
        triy3 = e.offsetY;
        const el = {
            type: "tri",
            x1: trix1,
            y1: triy1,
            x2: trix2,
            y2: triy2,
            x3: trix3,
            y3: triy3,
            centrex: (trix1+trix2+trix3)/3,
            centrey: (triy1+triy2+triy3)/3,
            lineWid: linewid,
            boundcolor: primColor,
            fillcolor: null,
        }
         
        history.splice(undoptr + 1);
        renders.push(el);
        undoptr++;
        history.push(JSON.parse(JSON.stringify(renders)));
        draw();
        frame = null;
        i = 0;
    }
});

canvas.addEventListener("mousemove", (e) => {
    if(i === 1){    
        if (itemchosen !== "tri") return;
        if (!frame) return;
        ctx.putImageData(frame, 0, 0);
        ctx.beginPath();
        ctx.lineWidth = linewid;
        ctx.moveTo(trix1, triy1);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
    if(i === 2){    
        if (itemchosen !== "tri") return;
        if (!frame) return;
        ctx.putImageData(frame, 0, 0);
        ctx.beginPath();
        ctx.lineWidth = linewid;
        ctx.moveTo(trix1, triy1);
        ctx.lineTo(trix2, triy2);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.closePath();
        ctx.stroke();
    }
});







let currentStroke = [];
let isBrushing = false;


function drawStok() {
    if(itemchosen === "strk"){
        itemchosen = "";
    }
    else{
        itemchosen = "strk";
    }

    if(itemchosen === "strk") {
        canvas.style.cursor = "crosshair";
    }
    else {
        canvas.style.cursor = "default";
    }
}

canvas.addEventListener("mousedown", (e) => {
    if (itemchosen !== "strk") return;
    currentStroke = [{x: e.offsetX, y: e.offsetY}];
    frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener("mousemove", (e) => {
    if (itemchosen !== "strk") return;
    if (!frame) return;
    ctx.putImageData(frame, 0, 0);
    currentStroke.push({x: e.offsetX, y: e.offsetY});
    if (currentStroke.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = primColor;
        ctx.lineWidth = linewid;
        ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
        for (let i = 1; i < currentStroke.length; i++) {
            ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
        }
        ctx.stroke();
    }
});

canvas.addEventListener("mouseup", (e) => {
    if (itemchosen !== "strk") return;
    if (!frame) return;
    console.log(65);
    ctx.putImageData(frame, 0, 0);
    if (currentStroke.length < 2) return;
    const el = {
        type: "stroke",
        points: currentStroke,
        boundcolor: primColor,
        lineWid: linewid,
        layer: 0,
    };
     
    history.splice(undoptr + 1);
    renders.push(el);
    undoptr++;
    history.push(JSON.parse(JSON.stringify(renders)));
    frame = null;
    currentStroke = [];
    draw();
});








function drawStok2() {
    if(itemchosen === "strk2"){
        itemchosen = "";
    }
    else{
        itemchosen = "strk2";
    }

    if(itemchosen === "strk2") {
        canvas.style.cursor = "crosshair";
    }
    else {
        canvas.style.cursor = "default";
    }
}

canvas.addEventListener("mousedown", (e) => {
    if (itemchosen !== "strk2") return;
    currentStroke = [{x: e.offsetX, y: e.offsetY}];
    frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener("mousemove", (e) => {
    if (itemchosen !== "strk2") return;
    if (!frame) return;
    ctx.putImageData(frame, 0, 0);
    currentStroke.push({x: e.offsetX, y: e.offsetY});
    
    if (currentStroke.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = primColor;
        ctx.lineWidth = linewid;
        ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
        for (let i = 1; i < currentStroke.length; i++) {
            ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
            ctx.lineTo(currentStroke[i].x + 2, currentStroke[i].y + 2);
            ctx.lineTo(currentStroke[i].x + 1, currentStroke[i].y + 1);
            ctx.lineTo(currentStroke[i].x - 1, currentStroke[i].y - 1);
            ctx.lineTo(currentStroke[i].x - 2, currentStroke[i].y - 2);
        }
        ctx.stroke();
    }
});

canvas.addEventListener("mouseup", (e) => {
    if (itemchosen !== "strk2") return;
    if (!frame) return;
    console.log(656);
    ctx.putImageData(frame, 0, 0);
    if (currentStroke.length < 2) return;
    const el = {
        type: "stroke2",
        points: currentStroke,
        boundcolor: primColor,
        lineWid: linewid,
        layer: 0,
    };
     
    history.splice(undoptr + 1);
    renders.push(el);
    undoptr++;
    history.push(JSON.parse(JSON.stringify(renders)));
    frame = null;
    currentStroke = [];
    draw();
});






let x1, y1;

function txt() {
    if(itemchosen === "txt"){
        itemchosen = "";
    }
    else{
        itemchosen = "txt";
    }

    if(itemchosen === "txt") {
        canvas.style.cursor = "text";
    }
    else {
        canvas.style.cursor = "default";
    }
}


canvas.addEventListener("click", (e) => {
    if (itemchosen !== "txt") return;
    textInput.style.left = e.offsetX + "px";
    textInput.style.top = e.offsetY + "px";
    textInput.style.opacity = "1";
    textInput.style.pointerEvents = "auto";
    textInput.value = "";
    textInput.focus();
});

textInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    if (textInput.value.trim() === "") return;
    const el = {
        type: "text",
        x: parseInt(textInput.style.left),
        y: parseInt(textInput.style.top),
        content: textInput.value,
        font: "Arial",
        fontSize: 1.5,
        boundcolor: primColor,
        layer: 0,
    };
     
    history.splice(undoptr + 1);
    renders.push(el);
    undoptr++;
    history.push(JSON.parse(JSON.stringify(renders)));
    draw();
    textInput.style.opacity = "0";
    textInput.style.pointerEvents = "none";
    frame = null;
    i = 0;
});