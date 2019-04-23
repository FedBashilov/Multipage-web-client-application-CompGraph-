let ctx=canvas.getContext("2d"),
    cx=canvas.width/2,
    cy=canvas.height/2,
    lines=[];

(function() {
  window.addEventListener("resize", resizeThrottler, false);

  let resizeTimeout;

  function resizeThrottler() {
    if ( !resizeTimeout ) {
      resizeTimeout = setTimeout( () => {
        resizeTimeout = null;
        actualResizeHandler();
       }, 66);
    }
  }
}());

window.addEventListener("load", ()=>{actualResizeHandler(); document.getElementById("canvas").style.display="block"}, false);

document.getElementById("generateButton").addEventListener("click", generateLines, false);

document.documentElement.addEventListener("input", draw, false);


function actualResizeHandler() {
  let output = document.getElementById("canvas");
  output.width = window.innerWidth*0.9;
  cx = output.width / 2;

  draw(null);
}

function draw(event) {
  fixSizesAndMoves();

  if(event !== null){
    equateRangeAndText(event.target);
  }

  let xmin = parseInt(document.getElementById("rmove_Horiz").value),
      ymin = parseInt(document.getElementById("rmove_Vert").value),
      xmax = xmin + parseInt(document.getElementById("rset_width").value),
      ymax = ymin + parseInt(document.getElementById("rset_height").value);

  //перерисуем линии
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.strokeStyle = "blue";
  for (let i = 0; i < lines.length; i++) {
    ctx.moveTo(lines[i].p1.x,canvas.height - lines[i].p1.y);
    ctx.lineTo(lines[i].p2.x,canvas.height - lines[i].p2.y);
  }
  ctx.stroke();

  //рисуем рамку
  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.moveTo(xmin, canvas.height - ymin);
  ctx.lineTo(xmin, canvas.height - ymax);
  ctx.lineTo(xmin, canvas.height - ymax);
  ctx.lineTo(xmax, canvas.height - ymax);
  ctx.lineTo(xmax, canvas.height - ymin);
  ctx.lineTo(xmin, canvas.height - ymin);
  ctx.stroke();

  //раздаем точкам биты
  for (let i = 0; i < lines.length; i++) {
     lines[i].p1.setPointBits(xmin, xmax, ymin, ymax);
     lines[i].p2.setPointBits(xmin, xmax, ymin, ymax);
  }
  //перекрашиваем
  ctx.beginPath();
  ctx.strokeStyle = "red";

  for (let i = 0; i < lines.length; i++) {
    if(lines[i].p1.b[0]*lines[i].p2.b[0] == 1 ||
      lines[i].p1.b[1]*lines[i].p2.b[1] == 1 ||
      lines[i].p1.b[2]*lines[i].p2.b[2] == 1 ||
      lines[i].p1.b[3]*lines[i].p2.b[3] == 1){
      continue;
    }

    if(sumOfArray(lines[i].p1.b) + sumOfArray(lines[i].p2.b) === 0){
        ctx.moveTo(lines[i].p1.x, canvas.height - lines[i].p1.y);
        ctx.lineTo(lines[i].p2.x, canvas.height - lines[i].p2.y);
        continue;
    }

    //по алгоритму Сазерленда-Коэна сдвигаем границы отрезка к границе окна.
    let buf1 = new PointBitsXY(),
        buf2 = new PointBitsXY();
    buf1.x = lines[i].p1.x;
    buf1.y = lines[i].p1.y;
    buf1.b = lines[i].p1.b;
    buf2.x = lines[i].p2.x;
    buf2.y = lines[i].p2.y;
    buf2.b = lines[i].p2.b;

    let incline = (buf2.y - buf1.y) / (buf2.x - buf1.x);

    if(buf1.b[0] === 1){
      buf1.y += (xmin - buf1.x) * incline;
      buf1.x = xmin;
      buf1.setPointBits(xmin, xmax, ymin, ymax);
    }
    if(buf1.b[2] === 1 || buf1.b[3] === 1){
        let Y = buf1.b[2] === 1 ? ymin : ymax;
        buf1.x += (Y-buf1.y) / incline;
        buf1.y = Y;
    }
    if(buf2.b[1] === 1){
      buf2.y -= (buf2.x - xmax) * incline;
      buf2.x = xmax;
      buf2.setPointBits(xmin, xmax, ymin, ymax);
    }
    if(buf2.b[2] === 1 || buf2.b[3] === 1){
        let Y = buf2.b[2] === 1 ? ymin : ymax;

        buf2.x -= Math.abs((Y - buf2.y) / incline);
        buf2.y = Y;
    }
    if(buf2.x >= buf1.x){
      ctx.moveTo(buf1.x, canvas.height - buf1.y);
      ctx.lineTo(buf2.x, canvas.height - buf2.y);
    }
  }
  ctx.stroke();
}

function fixSizesAndMoves() {
  let output=document.getElementById("canvas"),
      setWidth=document.getElementById("rset_width"),
      setHeight=document.getElementById("rset_height"),
      moveHoriz=document.getElementById("rmove_Horiz"),
      moveVert=document.getElementById("rmove_Vert");

  moveHoriz.max = output.width - parseInt(setWidth.value);
  setWidth.max = output.width - parseInt(moveHoriz.value);
  moveVert.max = output.height - parseInt(setHeight.value);
  setHeight.max = output.height - parseInt(moveVert.value);
}

function equateRangeAndText(elem) {
  if(elem.type === "range"){
    elem.nextElementSibling.value = elem.value;
  }else {
    if(parseInt(elem.value) > elem.previousElementSibling.max){
      elem.value = elem.previousElementSibling.max;
    }
    elem.previousElementSibling.value = elem.value;
  }
}

function generateLines() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  lines = [];

  size = randomInt(1, 20);

  ctx.beginPath();
  ctx.strokeStyle = "blue";
  for (let i = 0; i < size; i++) {
    lines[i]=new Line(randomInt(0, canvas.width) , randomInt(0, canvas.height),
                      randomInt(0, canvas.width), randomInt(0, canvas.height));
    ctx.moveTo(lines[i].p1.x, canvas.height - lines[i].p1.y);
    ctx.lineTo(lines[i].p2.x, canvas.height - lines[i].p2.y);
  }
  ctx.stroke();
}

function randomInt(min, max) {
  return Math.round(min - 0.5 + Math.random()*(max - min + 1) );
}

function sumOfArray(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

function Line(x1, y1, x2, y2) {
  if(x1 < x2){
    this.p1 = new PointBitsXY(x1, y1);
    this.p2 = new PointBitsXY(x2, y2);
  }else{
    this.p2 = new PointBitsXY(x1, y1);
    this.p1 = new PointBitsXY(x2, y2);
  }
}

function PointBitsXY(x, y) {
  this.x = x || 0;
  this.y = y || 0;
  this.b = [0, 0, 0, 0];
  this.setPointBits = function(xmin, xmax, ymin, ymax) {
    this.x <= xmin ? this.b[0] = 1 : this.b[0] = 0;
    this.x >= xmax ? this.b[1] = 1 : this.b[1] = 0;
    this.y <= ymin ? this.b[2] = 1 : this.b[2] = 0;
    this.y >= ymax ? this.b[3] = 1 : this.b[3] = 0;
  }
}

