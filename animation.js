let itemchosen = "";
let srecx, srecy;
let frame;
let elel = null;
let fortrix;
let fortriy;


function drawRect() {
    if(itemchosen === "rec"){
        itemchosen = "";
        let b = document.getElementById("rect");
        b.classList.remove("active");
    }
    else{
        itemchosen = "rec";
        let b = document.getElementById("rect");
        b.classList.add("active");
        document.getElementById("cir").classList.remove("active");
        document.getElementById("tri").classList.remove("active");
        document.getElementById("brs1").classList.remove("active");
        document.getElementById("brs2").classList.remove("active");
        document.getElementById("txt").classList.remove("active");
        document.getElementById("sele").classList.remove("active");
        document.getElementById("fill").classList.remove("active");
        document.getElementById("remv").classList.remove("active");
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
    ctx.strokeStyle = primColor;
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
     console.log("rect");
    history.splice(undoptr + 1);
    renders.push(el);
    undoptr++;
    history.push(JSON.parse(JSON.stringify(renders)));
    draw();
    frame = null;
    save();

});







let scircenx, scirceny;

function drawCir() {
    if(itemchosen === "cir"){
        itemchosen = "";
        let b = document.getElementById("cir");
        b.classList.remove("active");
    }
    else{
        itemchosen = "cir";
        let b = document.getElementById("cir");
        b.classList.add("active");
        document.getElementById("rect").classList.remove("active");
        document.getElementById("tri").classList.remove("active");
        document.getElementById("brs1").classList.remove("active");
        document.getElementById("brs2").classList.remove("active");
        document.getElementById("txt").classList.remove("active");
        document.getElementById("sele").classList.remove("active");
        document.getElementById("fill").classList.remove("active");
        document.getElementById("remv").classList.remove("active");
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
    ctx.strokeStyle = primColor;
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
    save();
});



function selection() {
    if(itemchosen === "sel"){
        itemchosen = "";
        let b = document.getElementById("sele");
        b.classList.remove("active");
    }
    else{
        itemchosen = "sel";
        let b = document.getElementById("sele");
        b.classList.add("active");
        document.getElementById("cir").classList.remove("active");
        document.getElementById("tri").classList.remove("active");
        document.getElementById("brs1").classList.remove("active");
        document.getElementById("brs2").classList.remove("active");
        document.getElementById("txt").classList.remove("active");
        document.getElementById("rect").classList.remove("active");
        document.getElementById("fill").classList.remove("active");
        document.getElementById("remv").classList.remove("active");
    }
    if(itemchosen === "sel") {
        canvas.style.cursor = "grab";
    }
    else {
        canvas.style.cursor = "default";
    }
}

canvas.addEventListener("mousedown", (e) => {
    if (itemchosen !== "sel") return;
    console.log(identify(e.offsetX, e.offsetY));
    if (identify(e.offsetX, e.offsetY) === null) {return;}
    elel = renders[identify(e.offsetX, e.offsetY)];
    canvas.style.cursor = "grabbing";
    renders.splice(identify(e.offsetX, e.offsetY), 1);
    console.log(elel);
    history.splice(undoptr + 1);
    undoptr++;
    history.push(JSON.parse(JSON.stringify(renders)));
    draw();
    history.pop();
    undoptr--;
    frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

});

addEventListener("mousemove", (e) => {
    if (itemchosen !== "sel") {return;}
    if (!frame) return;
    canvas.style.cursor = "grabbing";
    if (elel.type === "cir"){
    ctx.putImageData(frame, 0, 0);
    ctx.beginPath();
        ctx.strokeStyle = elel.boundcolor;
        ctx.lineWidth = elel.lineWid;
        ctx.arc(e.offsetX, e.offsetY, elel.radius , 0, Math.PI * 2);
        if (elel.fillcolor) {
            ctx.fillStyle = elel.fillcolor;
            ctx.fill();
        }
        ctx.stroke();
    }

    else if (elel.type === "rect"){
        ctx.putImageData(frame, 0, 0);
        ctx.lineWidth = elel.lineWid;
            if (elel.fillcolor) {
                ctx.fillStyle = elel.fillcolor;
                ctx.fillRect(e.offsetX, e.offsetY, elel.width, elel.height);
            }
        ctx.strokeStyle = elel.boundcolor;
        ctx.strokeRect(e.offsetX, e.offsetY, elel.width, elel.height);
    }

    else if (elel.type === "tri"){
        ctx.putImageData(frame, 0, 0);
        ctx.beginPath();
        ctx.strokeStyle = elel.boundcolor;
        ctx.lineWidth = elel.lineWid;
        ctx.moveTo(e.offsetX, e.offsetY);
        ctx.lineTo(elel.x2 - (elel.x1 - e.offsetX), elel.y2 - (elel.y1 - e.offsetY));
        ctx.lineTo(elel.x3 - (elel.x1 - e.offsetX), elel.y3 - (elel.y1 - e.offsetY));
        ctx.closePath();
        if (elel.fillcolor) {
            ctx.fillStyle = elel.fillcolor;
            ctx.fill();
        }
        ctx.stroke();
    }
})

addEventListener("mouseup", (e) => {
    if (itemchosen !== "sel") return;
    if (!frame) return;
    canvas.style.cursor = "grab";
    ctx.putImageData(frame, 0, 0);
    
    if (elel.type === "cir") {
        const el = {
            type: "cir",
            x: e.offsetX,
            y: e.offsetY,
            radius: elel.radius,
            centrex: e.offsetX,
            centrey: e.offsetY,
            lineWid: elel.lineWid,
            boundcolor: elel.boundcolor,
            fillcolor: elel.fillcolor,
        }

        history.splice(undoptr + 1);
        renders.push(el);
        undoptr++;
        history.push(JSON.parse(JSON.stringify(renders)));
        draw();
        frame = null;
        save();
    }

    else if (elel.type === "rect") {
        const el = {
            type: "rect",
            x: e.offsetX,
            y: e.offsetY,
            width: elel.width,
            height: elel.height,
            lineWid: elel.lineWid,
            centrex: e.offsetX + (elel.width) / 2,
            centrey: e.offsetY + (elel.height) / 2,
            boundcolor: elel.boundcolor,
            fillcolor: elel.fillcolor,
        }

        history.splice(undoptr + 1);
        renders.push(el);
        undoptr++;
        history.push(JSON.parse(JSON.stringify(renders)));
        draw();
        frame = null;
        save();
    }

    else if (elel.type === "tri") {
        const el = {
            type: "tri",
            x1: e.offsetX,
            y1: e.offsetY,
            x2: elel.x2 - (elel.x1 - e.offsetX),
            y2: elel.y2 - (elel.y1 - e.offsetY),
            x3: elel.x3 - (elel.x1 - e.offsetX),
            y3: elel.y3 - (elel.y1 - e.offsetY),
            centrex: (e.offsetX+elel.x2 - (elel.x1 - e.offsetX)+elel.x3 - (elel.x1 - e.offsetX))/3,
            centrey: (e.offsetY+elel.y2 - (elel.y1 - e.offsetY)+elel.y3 - (elel.y1 - e.offsetY))/3,
            lineWid: elel.lineWid,
            boundcolor: elel.boundcolor,
            fillcolor: elel.fillcolor,
        }

        history.splice(undoptr + 1);
        renders.push(el);
        undoptr++;
        history.push(JSON.parse(JSON.stringify(renders)));
        draw();
        frame = null;
        save();
    }
     
    
})


function fillcolr() {
    if (itemchosen === "filc"){
        itemchosen = "";
        let b = document.getElementById("fill");
        b.classList.remove("active");
    }
    else{
        itemchosen = "filc";
        let b = document.getElementById("fill");
        b.classList.add("active");
        document.getElementById("cir").classList.remove("active");
        document.getElementById("tri").classList.remove("active");
        document.getElementById("brs1").classList.remove("active");
        document.getElementById("brs2").classList.remove("active");
        document.getElementById("txt").classList.remove("active");
        document.getElementById("sele").classList.remove("active");
        document.getElementById("rect").classList.remove("active");
        document.getElementById("remv").classList.remove("active");
    }
    if(itemchosen === "filc") {
        canvas.style.cursor = "url('bb.cur'), auto";
    }
    else {
        canvas.style.cursor = "default";
    }
}

canvas.addEventListener("click", (e) => {
    if (itemchosen !== "filc") {return;}
    let ele = identify(e.offsetX, e.offsetY);
    if (ele === null) {return;}
   // history[undoptr][ele].fillcolor = primColor;
    renders[ele].fillcolor = primColor;
     
    history.splice(undoptr + 1);
    undoptr++;
    history.push(JSON.parse(JSON.stringify(renders)));
    draw();
    save();
});




let trix1, triy1, trix2, triy2, trix3, triy3;
let i=0;
function drawTri() {
    if(itemchosen === "tri"){
        itemchosen = "";
        let b = document.getElementById("tri");
        b.classList.remove("active");
    }
    else{
        itemchosen = "tri";
        let b = document.getElementById("tri");
        b.classList.add("active");
        document.getElementById("cir").classList.remove("active");
        document.getElementById("rect").classList.remove("active");
        document.getElementById("brs1").classList.remove("active");
        document.getElementById("brs2").classList.remove("active");
        document.getElementById("txt").classList.remove("active");
        document.getElementById("sele").classList.remove("active");
        document.getElementById("fill").classList.remove("active");
        document.getElementById("remv").classList.remove("active");
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
        save();
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
        ctx.strokeStyle = primColor;
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
        ctx.strokeStyle = primColor;
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
        let b = document.getElementById("brs1");
        b.classList.remove("active");
    }
    else{
        itemchosen = "strk";
        let b = document.getElementById("brs1");
        b.classList.add("active");
        document.getElementById("cir").classList.remove("active");
        document.getElementById("tri").classList.remove("active");
        document.getElementById("rect").classList.remove("active");
        document.getElementById("brs2").classList.remove("active");
        document.getElementById("txt").classList.remove("active");
        document.getElementById("sele").classList.remove("active");
        document.getElementById("fill").classList.remove("active");
        document.getElementById("remv").classList.remove("active");
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
    save();
});








function drawStok2() {
    if(itemchosen === "strk2"){
        itemchosen = "";
        let b = document.getElementById("brs2");
        b.classList.remove("active");
    }
    else{
        itemchosen = "strk2";
        let b = document.getElementById("brs2");
        b.classList.add("active");
        document.getElementById("cir").classList.remove("active");
        document.getElementById("tri").classList.remove("active");
        document.getElementById("brs1").classList.remove("active");
        document.getElementById("rect").classList.remove("active");
        document.getElementById("txt").classList.remove("active");
        document.getElementById("sele").classList.remove("active");
        document.getElementById("fill").classList.remove("active");
        document.getElementById("remv").classList.remove("active");
    }

    if(itemchosen === "strk2") {
        canvas.style.cursor = "url('eraser.cur'), cell";
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
        ctx.strokeStyle = "white";
        ctx.lineWidth = linewid * 3;
        ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
        for (let i = 1; i < currentStroke.length; i++) {
            ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
        }
        ctx.stroke();
    }
});
canvas.addEventListener("mousedown", (e) => {
    if (itemchosen !== "strk2") return;
    frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

let eraserCooldown = false;

canvas.addEventListener("mousemove", (e) => {
    if (itemchosen !== "strk2") return;
    if (!frame) return;
    
    if (eraserCooldown) return;
    if (identify(e.offsetX, e.offsetY) === null) {return;}
    ctx.putImageData(frame, 0, 0);
    renders.splice(identify(e.offsetX, e.offsetY), 1);
    history.splice(undoptr + 1);
    undoptr++;
    history.push(JSON.parse(JSON.stringify(renders)));
    draw();
    frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    save();
    eraserCooldown = true;
    setTimeout(() => {
        eraserCooldown = false;
    }, 500);
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
        boundcolor: "white",
        lineWid: linewid * 3,
        layer: 0,
    };
     
    history.splice(undoptr + 1);
    renders.push(el);
    undoptr++;
    history.push(JSON.parse(JSON.stringify(renders)));
    frame = null;
    currentStroke = [];
    draw();
    save();
    setCol("black");
});






let x1, y1;

function txt() {
    if(itemchosen === "txt"){
        itemchosen = "";
        let b = document.getElementById("txt");
        b.classList.remove("active");
    }
    else{
        itemchosen = "txt";
        let b = document.getElementById("txt");
        b.classList.add("active");
        document.getElementById("cir").classList.remove("active");
        document.getElementById("tri").classList.remove("active");
        document.getElementById("brs1").classList.remove("active");
        document.getElementById("brs2").classList.remove("active");
        document.getElementById("rect").classList.remove("active");
        document.getElementById("sele").classList.remove("active");
        document.getElementById("fill").classList.remove("active");
        document.getElementById("remv").classList.remove("active");
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
        fontSize: linewid * 0.75,
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
    save();
    i = 0;
});








function remv() {
    if(itemchosen === "remv"){
        itemchosen = "";
        let b = document.getElementById("remv");
        b.classList.remove("active");
    }
    else{
        itemchosen = "remv";
        let b = document.getElementById("remv");
        b.classList.add("active");
        document.getElementById("cir").classList.remove("active");
        document.getElementById("tri").classList.remove("active");
        document.getElementById("brs1").classList.remove("active");
        document.getElementById("brs2").classList.remove("active");
        document.getElementById("txt").classList.remove("active");
        document.getElementById("rect").classList.remove("active");
        document.getElementById("fill").classList.remove("active");
        document.getElementById("sele").classList.remove("active");
    }
    
    if(itemchosen === "remv") {
        canvas.style.cursor = "grab";
    }
    else {
        canvas.style.cursor = "default";
    }
}


canvas.addEventListener("mousedown", (e) => {
    if (itemchosen !== "remv") return;
    console.log(identify(e.offsetX, e.offsetY));
    if (identify(e.offsetX, e.offsetY) === null) {return;}
    elel = renders[identify(e.offsetX, e.offsetY)];
    canvas.style.cursor = "grabbing";
    renders.splice(identify(e.offsetX, e.offsetY), 1);
    console.log(elel);
    history.splice(undoptr + 1);
    undoptr++;
    history.push(JSON.parse(JSON.stringify(renders)));
    draw();
    history.pop();
    undoptr--;
    frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    fortrix = Math.sqrt((e.offsetX - elel.centrex)**2 + (e.offsetY - elel.centrey)**2);
    console.log(fortrix);
});

addEventListener("mousemove", (e) => {
    if (itemchosen !== "remv") {return;}
    if (!frame) return;
    canvas.style.cursor = "grabbing";

    if (elel.type === "cir"){
    ctx.putImageData(frame, 0, 0);
    ctx.beginPath();
        ctx.strokeStyle = elel.boundcolor;
        ctx.lineWidth = elel.lineWid;
        ctx.arc(elel.centrex, elel.centrey, Math.sqrt((e.offsetX - elel.centrex)**2 + (e.offsetY - elel.centrey)**2) , 0, Math.PI * 2);
        if (elel.fillcolor) {
            ctx.fillStyle = elel.fillcolor;
            ctx.fill();
        }
        ctx.stroke();
    }

    else if (elel.type === "rect"){
        ctx.putImageData(frame, 0, 0);
        ctx.lineWidth = elel.lineWid;
            if (elel.fillcolor) {
                ctx.fillStyle = elel.fillcolor;
                ctx.fillRect(elel.x, elel.y, e.offsetX - elel.x, e.offsetY - elel.y);
            }
        ctx.strokeStyle = elel.boundcolor;
        ctx.strokeRect(elel.x, elel.y, Math.abs(elel.x - e.offsetX), Math.abs(elel.y - e.offsetY));
    }

    else if (elel.type === "tri"){
        ctx.putImageData(frame, 0, 0);
        ctx.beginPath();
        ctx.strokeStyle = elel.boundcolor;
        ctx.lineWidth = elel.lineWid;
        ctx.moveTo(elel.centrex + (elel.x1 - elel.centrex) * (Math.sqrt((e.offsetX - elel.centrex)**2 + (e.offsetY - elel.centrey)**2)) / fortrix, elel.centrey + (elel.y1 - elel.centrey) * (Math.sqrt((e.offsetX - elel.centrex)**2 + (e.offsetY - elel.centrey)**2)) / fortrix);
        ctx.lineTo(elel.centrex + (elel.x2 - elel.centrex) * (Math.sqrt((e.offsetX - elel.centrex)**2 + (e.offsetY - elel.centrey)**2)) / fortrix, elel.centrey + (elel.y2 - elel.centrey) * (Math.sqrt((e.offsetX - elel.centrex)**2 + (e.offsetY - elel.centrey)**2)) / fortrix);
        ctx.lineTo(elel.centrex + (elel.x3 - elel.centrex) * (Math.sqrt((e.offsetX - elel.centrex)**2 + (e.offsetY - elel.centrey)**2)) / fortrix, elel.centrey + (elel.y3 - elel.centrey) * (Math.sqrt((e.offsetX - elel.centrex)**2 + (e.offsetY - elel.centrey)**2)) / fortrix);
        ctx.closePath();
        if (elel.fillcolor) {
            ctx.fillStyle = elel.fillcolor;
            ctx.fill();
        }
        ctx.stroke();
    }
})

addEventListener("mouseup", (e) => {
    if (itemchosen !== "remv") return;
    if (!frame) return;
    canvas.style.cursor = "grab";
    ctx.putImageData(frame, 0, 0);
    
    if (elel.type === "cir") {
        const el = {
            type: "cir",
            x: elel.x,
            y: elel.y,
            radius: Math.sqrt((e.offsetX - elel.x)**2 + (e.offsetY - elel.y)**2),
            centrex: elel.x,
            centrey: elel.y,
            lineWid: elel.lineWid,
            boundcolor: elel.boundcolor,
            fillcolor: elel.fillcolor,
        }

        history.splice(undoptr + 1);
        renders.push(el);
        undoptr++;
        history.push(JSON.parse(JSON.stringify(renders)));
        draw();
        frame = null;
        save();
    }

    else if (elel.type === "rect") {
        const el = {
            type: "rect",
            x: elel.x,
            y: elel.y,
            width: Math.abs(e.offsetX - elel.x),
            height: Math.abs(e.offsetY - elel.y),
            lineWid: elel.lineWid,
            centrex: elel.x + (e.offsetX - elel.x) / 2,
            centrey: elel.y + (e.offsetY - elel.y) / 2,
            boundcolor: elel.boundcolor,
            fillcolor: elel.fillcolor,
        }

        history.splice(undoptr + 1);
        renders.push(el);
        undoptr++;
        history.push(JSON.parse(JSON.stringify(renders)));
        draw();
        frame = null;
        save();
    }

    else if (elel.type === "tri") {
        const el = {
            type: "tri",
            x1: elel.centrex + (elel.x1 - elel.centrex) * (Math.sqrt((e.offsetX - elel.centrex)**2 + (e.offsetY - elel.centrey)**2)) / fortrix,
            y1: elel.centrey + (elel.y1 - elel.centrey) * (Math.sqrt((e.offsetX - elel.centrex)**2 + (e.offsetY - elel.centrey)**2)) / fortrix,
            x2: elel.centrex + (elel.x2 - elel.centrex) * (Math.sqrt((e.offsetX - elel.centrex)**2 + (e.offsetY - elel.centrey)**2)) / fortrix,
            y2: elel.centrey + (elel.y2 - elel.centrey) * (Math.sqrt((e.offsetX - elel.centrex)**2 + (e.offsetY - elel.centrey)**2)) / fortrix,
            x3: elel.centrex + (elel.x3 - elel.centrex) * (Math.sqrt((e.offsetX - elel.centrex)**2 + (e.offsetY - elel.centrey)**2)) / fortrix,
            y3: elel.centrey + (elel.y3 - elel.centrey) * (Math.sqrt((e.offsetX - elel.centrex)**2 + (e.offsetY - elel.centrey)**2)) / fortrix,
            centrex: elel.centrex,
            centrey: elel.centrey,
            lineWid: elel.lineWid,
            boundcolor: elel.boundcolor,
            fillcolor: elel.fillcolor,
        }

        console.log(el.centrex, el.centrey);

        history.splice(undoptr + 1);
        renders.push(el);
        undoptr++;
        history.push(JSON.parse(JSON.stringify(renders)));
        draw();
        frame = null;
        save();
    }
})