const canvas = document.getElementById('draw');
const ctx = canvas.getContext('2d');
const setcanvas = document.getElementsByTagName('body');

canvas.width = setcanvas[0].clientWidth * 0.6;
canvas.height = canvas.width * 0.6;
canvas.style.cursor = `url("./cursor/pen.png"), auto`;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = '#000000';
ctx.lineCap = ctx.lineJoin = 'round';
ctx.lineWidth = 5;
let isDrawing = false;
// 繪製的起點座標 
let lastX = lastY = 0;
let color = "black";
let nowUsing = 'pen';
var points = [ ];
var PushArray = new Array();
var Step = -1;
canvas.addEventListener('mouseup', () => {
    Push();
    isDrawing = false;
    ctx.shadowBlur = 0;
    points.length = 0;
});
canvas.addEventListener('mouseout', () => {
    // Push();
    isDrawing = false;
    ctx.shadowBlur = 0;
    points.length = 0;
});
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true; // 允許繪製
    points.push({ x: e.offsetX, y: e.offsetY });
    [lastX, lastY] = [e.offsetX, e.offsetY]; // 設定起始點
    ctx.strokeStyle = color;
    ctx.moveTo(lastX, lastY);  // 設定起點
    if(nowUsing!='rainbow'||nowUsing!='brush2'||nowUsing!='regtangle'||nowUsing!='triangle'||nowUsing!='circle'||nowUsing!='line'){
        ctx.beginPath();
    }
    tool2(e);
});
canvas.addEventListener('mousemove', tool1);
function ig(){
    var igg = document.createElement('a');
    igg.target = 'popup';
    igg.href = 'https://www.instagram.com/t1ng_chun/';
    igg.click();
    igg.remove();
}
function settool(newtool){
    nowUsing = newtool;
    canvas.style.cursor = `url("./cursor/${newtool}.png"), auto`;
}
function tool1(e){
    switch (nowUsing){
        case 'pen':
            draw(e);
            break;
        case 'eraser':
            erase(e);
            break;
        case 'line':
            drawLine(e);
            break;
        case 'rainbow':
            rainbow(e);
            break;
        case 'brush1':
            brush1(e);
            break;
        case 'brush2':
            brush2(e);
            break;
        case 'rectangle':
            rectangle(e);
            break;
        case 'triangle':
            triangle(e);
            break;
        case 'circle':
            circle(e);
            break;
        default:
            break;
    }
}  
function tool2(e){
    switch (nowUsing){
        case 'bucket':
            bucket();
            break;
        case 'text':
            text(e);
            console.log('123');
            break;
        default:
            break;
    }
}  
/*========== 繪製 ==========*/
function draw(e){
    if(!isDrawing) return;  // 沒有允許繪製即退出
    ctx.lineTo(e.offsetX, e.offsetY);  // 設定終點
    ctx.stroke();  // 依照設定開始繪製
    [lastX, lastY] = [e.offsetX, e.offsetY];  // 位置更新
}
/*========== 繪製圖形 ==========*/
function load(){
    var p1 = new Promise((resolve, reject)=>{
        var canvasPic = new Image();
        canvasPic.src = PushArray[Step];
        canvasPic.onload = function () { 
            ctx.drawImage(canvasPic, 0, 0);
            resolve();
        }
    });
    return p1;
}
async function rectangle(e){
    if(!isDrawing) return;
    await load();
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(lastX, e.offsetY);
    ctx.closePath();
    ctx.stroke();   
}
async function triangle(e){
    if(!isDrawing) return;
    await load();
    ctx.beginPath();
    ctx.moveTo((lastX+e.offsetX)/2, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(lastX, e.offsetY);
    ctx.closePath();
    ctx.stroke();   
}
async function circle(e){
    if(!isDrawing) return;
    await load();
    ctx.beginPath();
    ctx.arc(lastX, lastY, Math.abs((lastX-e.offsetX))/2, 0, 2*Math.PI);
    ctx.closePath();
    ctx.stroke();   
}
/*========== 畫直線 ==========*/
async function drawLine(e) {
    if(!isDrawing) return;
    await load();
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.closePath();
    ctx.stroke();
}
/*========== 畫筆 ==========*/
function brush1(e){
    if(!isDrawing) return;
    ctx.shadowBlur = 5;
    ctx.shadowColor = color;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}
function brush2(e){
    if(!isDrawing) return;
    points.push({ x: e.offsetX, y: e.offsetY });
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
      var nearPoint = points[i-5];
      if (nearPoint) {
        ctx.moveTo(nearPoint.x, nearPoint.y);
        ctx.lineTo(points[i].x, points[i].y);
      }
    }
    ctx.stroke();
}
/*========== 清除 ==========*/
function erase(e){
    if(!isDrawing) return;
    ctx.strokeStyle = 'white'
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}
/*========== 水桶 ==========*/
function bucket(){
    if(!isDrawing) return;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
/*========== 打字 ==========*/
var isTexting = false;
function text(e){
    if(!isDrawing) return;
    if(isTexting == false){
        isTexting = true;
        var input = document.createElement("input");
        input.style.position = "absolute";
        input.style.top = `${e.y}px`;
        input.style.left = `${e.x}px`;
        var yo = document.getElementById("canvass");
        yo.appendChild(input);
        var fz = document.getElementById("fontadjust_s");
        var ff = document.getElementById("fontadjust_f");
        ctx.font = `${fz.value}px ${ff.options[ff.selectedIndex].value}`
        ctx.fillStyle = color;
        input.addEventListener('keydown', (event) =>{
            if (event.keyCode == 13) {
                isTexting = false;
                ctx.fillText(`${input.value}`, e.offsetX, e.offsetY);
                ctx.stroke();
                input.remove();
            }
        });
    }
}
/*========== 重新 ==========*/
function restart() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    [lastX, lastY] = [0, 0];
    Push();
}
/*========== 彩虹 ==========*/
let hue = 0; // 色相環度數從 0 開始
function rainbow(e){
    if(!isDrawing) return;
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    hue++;
    if (hue >= 360) hue = 0;
    
    ctx.beginPath();
    ctx.moveTo(lastX,lastY);
    ctx.lineTo(e.offsetX, e.offsetY);  // 設定終點
    ctx.stroke();  // 依照設定開始繪製
    ctx.closePath();
    [lastX, lastY] = [e.offsetX, e.offsetY];  // 位置更新
}

function setTextColor(picker) {
    color = '#' + picker.toString(); 
    ctx.strokeStyle = color;
}
/*========== 下載 ==========*/
function download(){
    var link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = "mysketch.png";
    link.click();
}
/*========== 上傳 ==========*/
function upload(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}
/*========== redo/undo ==========*/
function Push(){
    Step++;
    if (Step < PushArray.length) { PushArray.length = Step; }
    PushArray.push(document.getElementById('draw').toDataURL());
}
function Undo(){
    if (Step > 0) {
        Step--;
        var canvasPic = new Image();
        canvasPic.src = PushArray[Step];
        console.log(Step);
        // console.log(PushArray[Step]);
        canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
    }
}
function Redo() {
    if (Step < PushArray.length-1){
        Step++;
        var canvasPic = new Image();
        canvasPic.src = PushArray[Step];
        canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
    }
}
/*========== 按鍵 ==========*/
function highlightBtn(id){
    btn = document.getElementById(id);
    hBtn = document.getElementsByClassName('highlightBtn');
    if (hBtn.length === 1) hBtn[0].classList.remove('highlightBtn');
    btn.classList.add('highlightBtn');
}