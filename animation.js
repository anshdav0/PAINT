let itemchosen = "";
let srecx, srecy;
let frame;
let elel = null;
let fortrix;
let fortriy;
let keyshort;

function drawRect() {
    if(itemchosen === "rec"){
        itemchosen = "";
        let b = document.getElementById("rect");
        b.classList.remove("active");
    }
    else{
        itemchosen = "rec";
        buttonctrl("rect");
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
        buttonctrl("cir");
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
    console.log(2);
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
        buttonctrl("sele");
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
    console.log(identify(lastX, lastY));
    if (identify(lastX, lastY) === null) {return;}
    elel = renders[identify(lastX, lastY)];
    canvas.style.cursor = "grabbing";
    renders.splice(identify(lastX, lastY), 1);
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
        ctx.strokeStyle = primColor;
        ctx.lineWidth = linewid;
        ctx.arc(lastX, lastY, elel.radius , 0, Math.PI * 2);
        if (elel.fillcolor) {
            ctx.fillStyle = elel.fillcolor;
            ctx.fill();
        }
        ctx.stroke();
    }

    else if (elel.type === "rect"){
        ctx.putImageData(frame, 0, 0);
        ctx.lineWidth = linewid;
        ctx.save();
        ctx.translate(lastX, lastY);
        ctx.rotate(elel.angle);
            if (elel.fillcolor) {
                ctx.fillStyle = elel.fillcolor;
                ctx.fillRect(-(elel.width / 2), -(elel.height / 2), elel.width, elel.height);
            }
        ctx.strokeStyle = primColor;
        ctx.strokeRect(-(elel.width / 2), -(elel.height / 2), elel.width, elel.height);
        ctx.restore();
    }

    else if (elel.type === "tri"){
        ctx.putImageData(frame, 0, 0);
        ctx.beginPath();
        ctx.strokeStyle = primColor;
        ctx.lineWidth = linewid;
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(elel.x2 - (elel.x1 - lastX), elel.y2 - (elel.y1 - lastY));
        ctx.lineTo(elel.x3 - (elel.x1 - lastX), elel.y3 - (elel.y1 - lastY));
        ctx.closePath();
        if (elel.fillcolor) {
            ctx.fillStyle = elel.fillcolor;
            ctx.fill();
        }
        ctx.stroke();
    }

    else if (elel.type === "text"){      
        ctx.putImageData(frame, 0, 0);
        ctx.font = `${elel.fontSize}rem ${elel.font}`;
        ctx.lineWidth = linewid;
        ctx.fillStyle = primColor;
        ctx.fillText(elel.content, lastX, lastY);
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
            x: lastX,
            y: lastY,
            radius: elel.radius,
            centrex: lastX,
            centrey: lastY,
            angle: elel.angle,
            lineWid: linewid,
            boundcolor: primColor,
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
            x: lastX - elel.width / 2,
            y: lastY - elel.height / 2,
            width: elel.width,
            height: elel.height,
            lineWid: linewid,
            angle: elel.angle,
            centrex: lastX,
            centrey: lastY,
            boundcolor: primColor,
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
            x1: lastX,
            y1: lastY,
            x2: elel.x2 - (elel.x1 - lastX),
            y2: elel.y2 - (elel.y1 - lastY),
            x3: elel.x3 - (elel.x1 - lastX),
            y3: elel.y3 - (elel.y1 - lastY),
            angle: elel.angle,
            centrex: (lastX+elel.x2 - (elel.x1 - lastX)+elel.x3 - (elel.x1 - lastX))/3,
            centrey: (lastY+elel.y2 - (elel.y1 - lastY)+elel.y3 - (elel.y1 - lastY))/3,
            lineWid: linewid,
            boundcolor: primColor,
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

    else if (elel.type === "text") {

        ctx.putImageData(frame, 0, 0);
        frame = null;
        editingTextIndex = null;
        futuretxtx = lastX;
        futuretxty = lastY;
        
        textInput.style.left = lastX + "px";
        textInput.style.top = lastY + "px";
        textInput.style.opacity = "1";
        textInput.style.pointerEvents = "auto";
        textInput.value = elel.content;
        textInput.focus();
    }

    textInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        if (textInput.value.trim() === "") return;

        if (editingTextIndex !== null) {
            renders[editingTextIndex].content = textInput.value;
        } else {
            const el = {
                type: "text",
                x: futuretxtx,
                y: futuretxty,
                content: textInput.value,
                font: "Arial",
                fontSize: linewid * 0.75,
                boundcolor: primColor,
                layer: 0,
                angle: 0,
            };
            renders.pop();
            renders.push(el);
        }

        history.splice(undoptr + 1);
        history.push(JSON.parse(JSON.stringify(renders)));
        undoptr++;
        draw();
        textInput.style.opacity = "0";
        textInput.style.pointerEvents = "none";
        save();
    });
     
    
})


function fillcolr() {
    if (itemchosen === "filc"){
        itemchosen = "";
        let b = document.getElementById("fill");
        b.classList.remove("active");
    }
    else{
        itemchosen = "filc";
        buttonctrl("fill");
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
    let ele = identify(lastX, lastY);
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
        buttonctrl("tri");
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


function drawStok() {
    if(itemchosen === "strk"){
        itemchosen = "";
        let b = document.getElementById("brs1");
        b.classList.remove("active");
    }
    else{
        itemchosen = "strk";
        buttonctrl("brs1");
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
        buttonctrl("brs2");
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
        buttonctrl("txt");
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
        buttonctrl("remv");
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
    console.log(identify(lastX, lastY));
    if (identify(lastX, lastY) === null) {return;}
    elel = renders[identify(lastX, lastY)];
    canvas.style.cursor = "grabbing";
    renders.splice(identify(lastX, lastY), 1);
    console.log(elel);
    history.splice(undoptr + 1);
    undoptr++;
    history.push(JSON.parse(JSON.stringify(renders)));
    draw();
    history.pop();
    undoptr--;
    frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    fortrix = Math.sqrt((lastX - elel.centrex)**2 + (lastY - elel.centrey)**2);
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
        ctx.arc(elel.centrex, elel.centrey, Math.sqrt((lastX - elel.centrex)**2 + (lastY - elel.centrey)**2) , 0, Math.PI * 2);
        if (elel.fillcolor) {
            ctx.fillStyle = elel.fillcolor;
            ctx.fill();
        }
        ctx.stroke();
    }

    else if (elel.type === "rect") {
        ctx.putImageData(frame, 0, 0);
        ctx.save();
        ctx.translate(elel.x + (lastX - elel.x)/2, elel.y + (lastY - elel.y)/2);
        ctx.rotate(elel.angle);
        ctx.lineWidth = elel.lineWid;
        if (elel.fillcolor) {
            ctx.fillStyle = elel.fillcolor;
            ctx.fillRect(-(lastX - elel.x)/2, -(lastY - elel.y)/2, lastX - elel.x, lastY - elel.y);
        }
        ctx.strokeStyle = elel.boundcolor;
        ctx.strokeRect(-(lastX - elel.x)/2, -(lastY - elel.y)/2, lastX - elel.x, lastY - elel.y);
        ctx.restore();
    }

    else if (elel.type === "tri"){
        ctx.putImageData(frame, 0, 0);
        ctx.beginPath();
        ctx.strokeStyle = elel.boundcolor;
        ctx.lineWidth = elel.lineWid;
        ctx.moveTo(elel.centrex + (elel.x1 - elel.centrex) * (Math.sqrt((lastX - elel.centrex)**2 + (lastY - elel.centrey)**2)) / fortrix, elel.centrey + (elel.y1 - elel.centrey) * (Math.sqrt((lastX - elel.centrex)**2 + (lastY - elel.centrey)**2)) / fortrix);
        ctx.lineTo(elel.centrex + (elel.x2 - elel.centrex) * (Math.sqrt((lastX - elel.centrex)**2 + (lastY - elel.centrey)**2)) / fortrix, elel.centrey + (elel.y2 - elel.centrey) * (Math.sqrt((lastX - elel.centrex)**2 + (lastY - elel.centrey)**2)) / fortrix);
        ctx.lineTo(elel.centrex + (elel.x3 - elel.centrex) * (Math.sqrt((lastX - elel.centrex)**2 + (lastY - elel.centrey)**2)) / fortrix, elel.centrey + (elel.y3 - elel.centrey) * (Math.sqrt((lastX - elel.centrex)**2 + (lastY - elel.centrey)**2)) / fortrix);
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
            radius: Math.sqrt((lastX - elel.x)**2 + (lastY - elel.y)**2),
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
            width: Math.abs(lastX - elel.x),
            height: Math.abs(lastY - elel.y),
            lineWid: elel.lineWid,
            angle: elel.angle,
            centrex: elel.x + (lastX - elel.x)/2,
            centrey: elel.y + (lastY - elel.y)/2,
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
            x1: elel.centrex + (elel.x1 - elel.centrex) * (Math.sqrt((lastX - elel.centrex)**2 + (lastY - elel.centrey)**2)) / fortrix,
            y1: elel.centrey + (elel.y1 - elel.centrey) * (Math.sqrt((lastX - elel.centrex)**2 + (lastY - elel.centrey)**2)) / fortrix,
            x2: elel.centrex + (elel.x2 - elel.centrex) * (Math.sqrt((lastX - elel.centrex)**2 + (lastY - elel.centrey)**2)) / fortrix,
            y2: elel.centrey + (elel.y2 - elel.centrey) * (Math.sqrt((lastX - elel.centrex)**2 + (lastY - elel.centrey)**2)) / fortrix,
            x3: elel.centrex + (elel.x3 - elel.centrex) * (Math.sqrt((lastX - elel.centrex)**2 + (lastY - elel.centrey)**2)) / fortrix,
            y3: elel.centrey + (elel.y3 - elel.centrey) * (Math.sqrt((lastX - elel.centrex)**2 + (lastY - elel.centrey)**2)) / fortrix,
            centrex: elel.centrex,
            centrey: elel.centrey,
            angle: elel.angle,
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




function rotation() {
    if(itemchosen === "rot"){
        itemchosen = "";
        let b = document.getElementById("rot");
        b.classList.remove("active");
    }
    else{
        itemchosen = "rot";
        buttonctrl("rot");
    }
    if(itemchosen === "rot") {
        canvas.style.cursor = "grab";
    }
    else {
        canvas.style.cursor = "default";
    }
}

canvas.addEventListener("mousedown", (e) => {
    if (itemchosen !== "rot") return;
    console.log(identify(lastX, lastY));
    if (identify(lastX, lastY) === null) {return;}
    elel = renders[identify(lastX, lastY)];
    canvas.style.cursor = "grabbing";
    renders.splice(identify(lastX, lastY), 1);
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
    if (itemchosen !== "rot") {return;}
    if (!frame) return;
    canvas.style.cursor = "grabbing";

    if (elel.type === "rect"){
        ctx.putImageData(frame, 0, 0);
        ctx.save();
        ctx.translate(elel.centrex, elel.centrey);
        ctx.rotate(Math.atan2(lastY - elel.centrey, lastX - elel.centrex));
        ctx.lineWidth = elel.lineWid;
            if (elel.fillcolor) {
                ctx.fillStyle = elel.fillcolor;
                ctx.fillRect(-elel.width/2, -elel.height/2, elel.width, elel.height);
            }
        ctx.strokeStyle = elel.boundcolor;
        ctx.strokeRect(-elel.width/2, -elel.height/2, elel.width, elel.height);
        ctx.restore();
    }

    else if (elel.type === "tri"){
        ctx.putImageData(frame, 0, 0);
        ctx.save();
        ctx.translate(elel.centrex, elel.centrey);
        ctx.rotate(Math.atan2(lastY - elel.centrey, lastX - elel.centrex));
        ctx.beginPath();
        ctx.strokeStyle = elel.boundcolor;
        ctx.lineWidth = elel.lineWid;
        ctx.moveTo(elel.x1 - elel.centrex, elel.y1 - elel.centrey);
        ctx.lineTo(elel.x2 - elel.centrex, elel.y2 - elel.centrey);
        ctx.lineTo(elel.x3 - elel.centrex, elel.y3 - elel.centrey);
        ctx.closePath();
        if (elel.fillcolor) {
            ctx.fillStyle = elel.fillcolor;
            ctx.fill();
        }
        ctx.stroke();
        ctx.restore();
    }
})

addEventListener("mouseup", (e) => {
    if (itemchosen !== "rot") return;
    if (!frame) return;
    canvas.style.cursor = "grab";
    ctx.putImageData(frame, 0, 0);
    
    if (elel.type === "rect") {
        const el = {
            type: "rect",
            x: elel.centrex - elel.width / 2,
            y: elel.centrey - elel.height / 2,
            width: elel.width,
            height: elel.height,
            lineWid: elel.lineWid,
            centrex: elel.centrex,
            centrey: elel.centrey,
            angle: Math.atan2(lastY - elel.centrey, lastX - elel.centrex),
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
            x1: elel.centrex + (elel.x1 - elel.centrex)*Math.cos(Math.atan2(lastY - elel.centrey, lastX - elel.centrex)) - (elel.y1 - elel.centrey)*Math.sin(Math.atan2(lastY - elel.centrey, lastX - elel.centrex)),
            y1: elel.centrey + (elel.x1 - elel.centrex)*Math.sin(Math.atan2(lastY - elel.centrey, lastX - elel.centrex)) + (elel.y1 - elel.centrey)*Math.cos(Math.atan2(lastY - elel.centrey, lastX - elel.centrex)),
            x2: elel.centrex + (elel.x2 - elel.centrex)*Math.cos(Math.atan2(lastY - elel.centrey, lastX - elel.centrex)) - (elel.y2 - elel.centrey)*Math.sin(Math.atan2(lastY - elel.centrey, lastX - elel.centrex)),
            y2: elel.centrey + (elel.x2 - elel.centrex)*Math.sin(Math.atan2(lastY - elel.centrey, lastX - elel.centrex)) + (elel.y2 - elel.centrey)*Math.cos(Math.atan2(lastY - elel.centrey, lastX - elel.centrex)),
            x3: elel.centrex + (elel.x3 - elel.centrex)*Math.cos(Math.atan2(lastY - elel.centrey, lastX - elel.centrex)) - (elel.y3 - elel.centrey)*Math.sin(Math.atan2(lastY - elel.centrey, lastX - elel.centrex)),
            y3: elel.centrey + (elel.x3 - elel.centrex)*Math.sin(Math.atan2(lastY - elel.centrey, lastX - elel.centrex)) + (elel.y3 - elel.centrey)*Math.cos(Math.atan2(lastY - elel.centrey, lastX - elel.centrex)),
            angle: 0,
            centrex: elel.centrex,
            centrey: elel.centrey,
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
