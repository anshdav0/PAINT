let itemchosen = "";
let srecx, srecy;
let frame;
let elel = null;
let fortrix;
let fortriy;
let keyshort;

function drawRect() {           //rectangle
    if(itemchosen === "rec"){
        selection();
        canvas.style.cursor = "drag";
    }
    else{
        itemchosen = "rec";
        canvas.style.cursor = "crosshair";
        buttonctrl("rect");
    }
}



canvas.addEventListener("mousedown", (e) => {
    if (itemchosen !== "rec") return;
    srecx = lastX;
    srecy = lastY;
    frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener("mousemove", (e) => {
    if (itemchosen !== "rec") return;
    if (!frame) return;
    ctx.putImageData(frame, 0, 0);
    ctx.lineWidth = linewid;
    ctx.strokeStyle = primColor;
    ctx.strokeRect(srecx, srecy, lastX - srecx, lastY - srecy);
});

canvas.addEventListener("mouseup", (e) => {
    if (itemchosen !== "rec") return;
    if (!frame) return;
    ctx.putImageData(frame, 0, 0);
    const el = {
        type: "rect",
        x: srecx,
        y: srecy,
        width: lastX - srecx,
        height: lastY - srecy,
        lineWid: linewid,
        centrex: srecx + (lastX - srecx) / 2,
        centrey: srecy + (lastY - srecy) / 2,
        boundcolor: primColor,
        angle: 0,
        fillcolor: null,
    }
    
    savingthecurrentstate(el);

});







let scircenx, scirceny;

function drawCir() {            //circle
    if(itemchosen === "cir"){
        selection();
        canvas.style.cursor = "drag";
    }
    else{
        itemchosen = "cir";
        canvas.style.cursor = "crosshair";
        buttonctrl("cir");
    }
}

canvas.addEventListener("mousedown", (e) => {
    if (itemchosen !== "cir") return;
    scircenx = lastX;
    scirceny = lastY;
    frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener("mousemove", (e) => {
    if (itemchosen !== "cir") return;
    if (!frame) return;
    ctx.putImageData(frame, 0, 0);
    ctx.beginPath();
    ctx.lineWidth = linewid;
    ctx.strokeStyle = primColor;
    ctx.arc(scircenx, scirceny, Math.sqrt((lastX - scircenx)**2 + (lastY - scirceny)**2) , 0, Math.PI * 2);
    ctx.stroke();
});

canvas.addEventListener("mouseup", (e) => {
    if (itemchosen !== "cir") return;
    if (!frame) return;
    ctx.putImageData(frame, 0, 0);
    
    const el = {
        type: "cir",
        x: scircenx,
        y: scirceny,
        radius: Math.sqrt((lastX - scircenx)**2 + (lastY - scirceny)**2),
        centrex: scircenx,
        centrey: scirceny,
        lineWid: linewid,
        boundcolor: primColor,
        fillcolor: null,
    }
     
    savingthecurrentstate(el);
});



function fillcolr() {                   //fillcolor
    if (itemchosen === "filc"){
        selection();
        canvas.style.cursor = "drag";
    }
    else{
        itemchosen = "filc";
        canvas.style.cursor = "url('Assets/bb.cur'), auto";
        buttonctrl("fill");
    }
}

canvas.addEventListener("click", (e) => {
    if (itemchosen !== "filc") {return;}
    let ele = identify(lastX, lastY);
    if(renders[identify(lastX, lastY)].type !== "cir" && renders[identify(lastX, lastY)].type !== "tri" && renders[identify(lastX, lastY)].type !== "rect") {return;}
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
function drawTri() {                                //triangle
    if(itemchosen === "tri"){
        selection();
        canvas.style.cursor = "drag";
    }
    else{
        itemchosen = "tri";
        canvas.style.cursor = "crosshair";
        buttonctrl("tri");
    }
}

canvas.addEventListener("click", (e) => {
    if(i === 0){
        if (itemchosen !== "tri") return;
        trix1 = lastX;
        triy1 = lastY;
        frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        i++;
    }
    else if(i === 1){
        if (itemchosen !== "tri") return;
        if (!frame) return;
        ctx.putImageData(frame, 0, 0);
        trix2 = lastX;
        triy2 = lastY;
        frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        i++
    }
    else if (i === 2){
        if (itemchosen !== "tri") return;
        if (!frame) return;
        ctx.putImageData(frame, 0, 0);
        trix3 = lastX;
        triy3 = lastY;
        const el = {
            type: "tri",
            x1: trix1,
            y1: triy1,
            x2: trix2,
            y2: triy2,
            x3: trix3,
            y3: triy3,
            angle: 0,
            centrex: (trix1+trix2+trix3)/3,
            centrey: (triy1+triy2+triy3)/3,
            lineWid: linewid,
            boundcolor: primColor,
            fillcolor: null,
        }
         
        savingthecurrentstate(el);
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
        ctx.lineTo(lastX, lastY);
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
        ctx.lineTo(lastX, lastY);
        ctx.closePath();
        ctx.stroke();
    }
});







let currentStroke = [];
let isBrushing = false;


function drawStok() {               //brush
    if(itemchosen === "strk"){
        selection();
        canvas.style.cursor = "drag";
    }
    else{
        itemchosen = "strk";
        canvas.style.cursor = "crosshair";
        buttonctrl("brs1");
    }
}

canvas.addEventListener("mousedown", (e) => {
    if (itemchosen !== "strk") return;
    currentStroke = [{x: lastX, y: lastY}];
    frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener("mousemove", (e) => {
    if (itemchosen !== "strk") return;
    if (!frame) return;
    ctx.putImageData(frame, 0, 0);
    currentStroke.push({x: lastX, y: lastY});
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
    
    ctx.putImageData(frame, 0, 0);
    if (currentStroke.length < 2) return;
    const el = {
        type: "stroke",
        points: currentStroke,
        boundcolor: primColor,
        lineWid: linewid,
        layer: 0,
    };
     
    savingthecurrentstate(el);
});








function drawStok2() {              //Eraser
    if(itemchosen === "strk2"){
        selection();
        canvas.style.cursor = "drag";
    }
    else{
        itemchosen = "strk2";
        canvas.style.cursor = "url('Assets/eraser.cur'), cell";
        buttonctrl("brs2");
    }
}

canvas.addEventListener("mousedown", (e) => {
    if (itemchosen !== "strk2") return;
    currentStroke = [{x: lastX, y: lastY}];
    frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener("mousemove", (e) => {
    if (itemchosen !== "strk2") return;
    if (!frame) return;
    ctx.putImageData(frame, 0, 0);
    currentStroke.push({x: lastX, y: lastY});
    
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
    if (identify(lastX, lastY) === null) {return;}
    ctx.putImageData(frame, 0, 0);
    renders.splice(identify(lastX, lastY), 1);
    history.splice(undoptr + 1);
    undoptr++;
    history.push(JSON.parse(JSON.stringify(renders)));
    draw();
    frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    save();
    eraserCooldown = true;
    setTimeout(() => {
        eraserCooldown = false;
    }, 250);
});

canvas.addEventListener("mouseup", (e) => {
    if (itemchosen !== "strk2") return;
    if (!frame) return;
    ctx.putImageData(frame, 0, 0);
    if (currentStroke.length < 2) return;
    const el = {
        type: "stroke2",
        points: currentStroke,
        boundcolor: "white",
        lineWid: linewid * 3,
        layer: 0,
    };
     
    savingthecurrentstate(el);
    setCol("black");
});






let x1, y1;

function txt() {                    //text
    if(itemchosen === "txt"){
        selection();
        canvas.style.cursor = "drag";
    }
    else{
        itemchosen = "txt";
        canvas.style.cursor = "text";
        buttonctrl("txt");
    }
}


canvas.addEventListener("click", (e) => {
    if (itemchosen !== "txt") return;
    keyshort = true;
    textInput.style.left = lastX + "px";
    textInput.style.top = lastY + "px";
    textInput.style.opacity = "1";
    textInput.style.pointerEvents = "auto";
    textInput.value = "";
    textInput.focus();
});

textInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") {return;}
    if (textInput.value.trim() === "") return;
    if(itemchosen !== "txt") return;
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
    keyshort = false;
     
    savingthecurrentstate(el);
    i = 0;
});





function img() {           //image
    if(itemchosen === "img"){
        selection();
        canvas.style.cursor = "drag";
    }
    else{
        itemchosen = "img";
        canvas.style.cursor = "crosshair";
        buttonctrl("img");
    }
}



canvas.addEventListener("mousedown", (e) => {
    if (itemchosen !== "img") return;
    srecx = lastX;
    srecy = lastY;
    frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener("mousemove", (e) => {
    if (itemchosen !== "img") return;
    if (!frame) return;
    ctx.putImageData(frame, 0, 0);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.strokeRect(srecx, srecy, lastX - srecx, lastY - srecy);
});

canvas.addEventListener("mouseup", (e) => {
    if (itemchosen !== "img") return;
    if (!frame) return;
    ctx.putImageData(frame, 0, 0);
    keyshort = true;
    textInput.style.left = lastX + "px";
    textInput.style.top = lastY + "px";
    textInput.style.opacity = "1";
    textInput.style.pointerEvents = "auto";
    textInput.value = "";
    textInput.focus();
    
});


textInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") {return;}
    if (textInput.value.trim() === "") return;
    if(itemchosen !== "img") return;
    const el = {
        type: "img",
        x: srecx,
        y: srecy,
        width: lastX - srecx,
        height: lastY - srecy,
        lineWid: 1,
        centrex: srecx + (lastX - srecx) / 2,
        centrey: srecy + (lastY - srecy) / 2,
        content: textInput.value,
        angle:0,
        layer: 0,
    };
    keyshort = false;
     
    savingthecurrentstate(el);
    i = 0;
});
