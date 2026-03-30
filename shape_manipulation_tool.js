
function remv() {                           //scale/resize
    if(itemchosen === "remv"){
        selection();
        canvas.style.cursor = "drag";
    }
    else{
        itemchosen = "remv";
        buttonctrl("remv");
        canvas.style.cursor = "grab";
    }
}


canvas.addEventListener("mousedown", (e) => {
    if (itemchosen !== "remv") return;
    if(renders[identify(lastX, lastY)].type !== "cir" && renders[identify(lastX, lastY)].type !== "tri" && renders[identify(lastX, lastY)].type !== "rect" && renders[identify(lastX, lastY)].type !== "img") {return;}
    initialisation();
    fortrix = Math.sqrt((lastX - elel.centrex)**2 + (lastY - elel.centrey)**2);
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

    else if (elel.type === "img") {
        ctx.putImageData(frame, 0, 0);
        ctx.save();
        ctx.translate(elel.x + (lastX - elel.x)/2, elel.y + (lastY - elel.y)/2);
        ctx.rotate(elel.angle);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.strokeRect(-(lastX - elel.x)/2, -(lastY - elel.y)/2, lastX - elel.x, lastY - elel.y);
        ctx.restore();
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

        savingthecurrentstate(el);
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

        savingthecurrentstate(el);
    }



    else if (elel.type === "tri") {
        const el = {
            type: "tri",
            x1: mathsfortri(elel.x1, elel.centrex, elel.centrey, fortrix),
            y1: mathsfortriy(elel.y1, elel.centrex, elel.centrey, fortrix),
            x2: mathsfortri(elel.x2, elel.centrex, elel.centrey, fortrix),
            y2: mathsfortriy(elel.y2, elel.centrex, elel.centrey, fortrix),
            x3: mathsfortri(elel.x3, elel.centrex, elel.centrey, fortrix),
            y3: mathsfortriy(elel.y3, elel.centrex, elel.centrey, fortrix),
            centrex: elel.centrex,
            centrey: elel.centrey,
            angle: elel.angle,
            lineWid: elel.lineWid,
            boundcolor: elel.boundcolor,
            fillcolor: elel.fillcolor,
        }

        savingthecurrentstate(el);
    }

    else if (elel.type === "img") {
        const el = {
            type: "img",
            x: elel.x,
            y: elel.y,
            width: Math.abs(lastX - elel.x),
            height: Math.abs(lastY - elel.y),
            lineWid: 1,
            angle: elel.angle,
            centrex: elel.x + (lastX - elel.x)/2,
            centrey: elel.y + (lastY - elel.y)/2,
            content: elel.content,
            layer: 0,
        }

        savingthecurrentstate(el);
    }

})








function rotation() {               //rotation
    if(itemchosen === "rot"){
        selection();
        canvas.style.cursor = "drag";
    }
    else{
        itemchosen = "rot";
        canvas.style.cursor = "grab";
        buttonctrl("rot");
    }
}

canvas.addEventListener("mousedown", (e) => {
    if (itemchosen !== "rot") return;
    if(renders[identify(lastX, lastY)].type !== "tri" && renders[identify(lastX, lastY)].type !== "rect" && renders[identify(lastX, lastY)].type !== "img") {return;}
    initialisation();

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

    else if (elel.type === "rect"){
        ctx.putImageData(frame, 0, 0);
        ctx.save();
        ctx.translate(elel.centrex, elel.centrey);
        ctx.rotate(Math.atan2(lastY - elel.centrey, lastX - elel.centrex));
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.strokeRect(-elel.width/2, -elel.height/2, elel.width, elel.height);
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

        savingthecurrentstate(el);
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

        savingthecurrentstate(el);
    }

    else if (elel.type === "img") {
        const el = {
            type: "img",
            x: elel.centrex - elel.width / 2,
            y: elel.centrey - elel.height / 2,
            width: elel.width,
            height: elel.height,
            lineWid: 1,
            centrex: elel.centrex,
            centrey: elel.centrey,
            angle: Math.atan2(lastY - elel.centrey, lastX - elel.centrex),
            content: elel.content,
            layer: 0,
        }

        savingthecurrentstate(el);
    }
     
    
})







function selection() {                  //move/sele
    if(itemchosen === "sel"){
        itemchosen = "";
        let b = document.getElementById("sele");
        b.classList.remove("active");
        canvas.style.cursor = "grab";
    }
    else{
        itemchosen = "sel";
        canvas.style.cursor = "default";
        buttonctrl("sele");
    }
}

canvas.addEventListener("mousedown", (e) => {
    if (itemchosen !== "sel") return;
    if (renders[identify(lastX, lastY)].type !== "cir" && renders[identify(lastX, lastY)].type !== "tri" && renders[identify(lastX, lastY)].type !== "rect" && renders[identify(lastX, lastY)].type !== "text" && renders[identify(lastX, lastY)].type !== "img") {return;}
    initialisation();

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

    else if (elel.type === "img"){
        ctx.putImageData(frame, 0, 0);
        ctx.lineWidth = 1;
        ctx.save();
        ctx.translate(lastX, lastY);
        ctx.rotate(elel.angle);
        ctx.strokeStyle = "black";
        ctx.strokeRect(-(elel.width / 2), -(elel.height / 2), elel.width, elel.height);
        ctx.restore();
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

        savingthecurrentstate(el);
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

        savingthecurrentstate(el);
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

        savingthecurrentstate(el);
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

    else if (elel.type === "img") {
        const el = {
            type: "img",
            x: lastX - elel.width / 2,
            y: lastY - elel.height / 2,
            width: elel.width,
            height: elel.height,
            lineWid: 1,
            angle: elel.angle,
            centrex: lastX,
            centrey: lastY,
            content: elel.content,
            layer: 0,
        }

        savingthecurrentstate(el);
    }

    textInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        if (textInput.value.trim() === "") return;
        if(itemchosen !== "sel") return;

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