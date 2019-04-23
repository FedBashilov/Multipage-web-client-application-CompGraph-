const cx = XY_canvas.width / 2, cy = XY_canvas.height / 2;

let canXY = XY_canvas.getContext("2d"),
    canXYZ = XYZ_canvas.getContext("2d");

canXY.translate(cx, cy);
canXYZ.translate(cx, cy);

window.addEventListener("load",drawXY(null), false);

document.documentElement.addEventListener("input",drawXY, false);

function drawXY(event) {
    if(event !== null){
        if(event.target.classList.contains("rotate")){
            equateRangeAndText(event.target);
        }
    }

    canXY.clearRect(-XY_canvas.width / 2, -XY_canvas.height / 2, XY_canvas.width, XY_canvas.height);
    //оси
    canXY.beginPath();
    canXY.moveTo(-XY_canvas.width / 2 + 20, 0);
    canXY.lineTo(XY_canvas.width / 2 - 20, 0);
    canXY.lineTo(XY_canvas.width / 2 - 30, -5);
    canXY.lineTo(XY_canvas.width / 2 - 30, 5);
    canXY.lineTo(XY_canvas.width / 2 - 20, 0);
    canXY.moveTo(0, XY_canvas.height / 2 - 20);
    canXY.lineTo(0, -XY_canvas.height / 2 + 20);
    canXY.lineTo(-5, -XY_canvas.height / 2 + 30);
    canXY.lineTo(5, -XY_canvas.height / 2 + 30);
    canXY.lineTo(0, -XY_canvas.height / 2 + 20);
    canXY.strokeStyle = "black";
    canXY.fillStyle = "black";
    canXY.stroke();
    canXY.fill();
    canXY.font = "14px Arial";
    canXY.fillText("X", XY_canvas.width / 2 - 20, -10);
    canXY.fillText("Y", -20, -XY_canvas.height / 2 + 20);

    //получение точек
    let rot = parseInt(document.getElementById("text_Rotate").value),
        points = getPoints(rot);
    //отрисовка точек и линий
    canXY.beginPath();
    for (let i = 0, circle = new Path2D(); i < points.length; i++) {
      circle.moveTo(points[i].x, -points[i].y)
      circle.arc(points[i].x, -points[i].y, 3, 0, 2*Math.PI);
      canXY.fillStyle = "red";
      canXY.fill(circle);
      canXY.fillText(points[i].z, points[i].x - 10, -points[i].y - 10);

      if (i < points.length - 1) {
        canXY.moveTo(points[i].x, -points[i].y);
        canXY.lineTo(points[i+1].x, -points[i+1].y);
      }
      else {
        canXY.moveTo(points[points.length-1].x, -points[points.length-1].y);
        canXY.lineTo(points[0].x, -points[0].y);
        canXY.strokeStyle = "red";
        canXY.stroke();
      }
    }
    drawXYZ(points);
}

function drawXYZ(points) {
  canXYZ.clearRect(-XYZ_canvas.width / 2, -XYZ_canvas.height / 2, XYZ_canvas.width, XYZ_canvas.height);
  //оси
  canXYZ.beginPath();
  for (let i = 0; i < 3; i++) {
    canXYZ.moveTo(0, 0);
    canXYZ.lineTo(0, -(XYZ_canvas.height / 2 - 20));
    canXYZ.lineTo(-5, -(XYZ_canvas.height / 2 - 30));
    canXYZ.lineTo(5, -(XYZ_canvas.height / 2 - 30));
    canXYZ.lineTo(0, -(XYZ_canvas.height / 2 - 20));
    canXYZ.rotate((Math.PI / 180) * 120);
  }
  canXYZ.strokeStyle = "black";
  canXYZ.fillStyle = "black";
  canXYZ.stroke();
  canXYZ.fill();

  canXYZ.font = "14px Arial";

  canXYZ.fillText("Y", -20, -(XYZ_canvas.height / 2-30));
  canXYZ.fillText("X", XYZ_canvas.height / 2.3, XYZ_canvas.height / 3);
  canXYZ.fillText("Z", -(XYZ_canvas.height / 2.3), XYZ_canvas.height / 3);
  //отрисовка главных точек
  let buf = new PointXYZ();

  canXYZ.strokeStyle = "red";
  canXYZ.fillStyle = "red";
  for (let i = 0; i < points.length; i++) {
    canXYZ.beginPath()
    buf = transPointToIsom({x: points[i].x, y: points[i].y, z: 0});//проекция на xy
    canXYZ.arc(buf.x, buf.y, 3, 0, 2*Math.PI);
    buf = transPointToIsom(points[i]);
    canXYZ.arc(buf.x, buf.y, 3, 0, 2*Math.PI);
    canXYZ.fill();
    canXYZ.stroke();
  }
  //интерполяционные точки
  let denom = (points[2].x - points[0].x) * (points[2].y - points[0].y);

  canXYZ.strokeStyle = "blue";
  canXYZ.fillStyle = "blue";

  for (let uc = 0; uc <= 1; uc += 0.02) {
    for (let vc = 0; vc <= 1; vc += 0.02) {
      buf.x = points[0].x * (1 - uc) * (1 - vc) +
              points[1].x * uc * (1 - vc) +
              points[2].x * uc * vc +
              points[3].x * (1 - uc) * vc;
      buf.y = points[0].y * (1 - uc) * (1 - vc) +
              points[1].y * uc * (1 - vc) +
              points[2].y * uc * vc +
              points[3].y * (1 - uc) * vc;
      buf.z = points[0].z * (1 - uc) * (1 - vc) +
              points[1].z * uc * (1 - vc) +
              points[2].z * uc * vc +
              points[3].z * (1 - uc) * vc;
      buf = transPointToIsom(buf);//проекция на xy
      canXYZ.beginPath();
      canXYZ.arc(buf.x, buf.y, 1, 0, 2*Math.PI);
      canXYZ.fill();
    }
  }
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

function transPointToIsom(point) {
    let alfa = toRadians(35.264),
      betta = toRadians(45);

  let rotateMatrix = [[Math.cos(betta), 0 ,-Math.sin(betta)],
                    [-Math.sin(alfa) * Math.sin(betta), Math.cos(alfa),
                                             -Math.sin(alfa) * Math.cos(betta)],
                    [0, 0, 0]];
  let p = [[point.x], [point.y], [point.z]];
  p = multiplyMatrix(rotateMatrix, p);
  return {x: p[0][0], y: -p[1][0], z: p[2][0]};
}

function getPoints(rot) {
  let pointsElem=document.getElementsByClassName("point"),
      points=[];
  for (let i = 0; i < pointsElem.length; i++) {
    points[i] = new PointXYZ();
    points[i].x = parseFloat(pointsElem[i].getElementsByTagName("input")[0].value);
    points[i].y = parseFloat(pointsElem[i].getElementsByTagName("input")[1].value);
    points[i].z = parseFloat(pointsElem[i].getElementsByTagName("input")[2].value);
  }
  if(rot){
      points=rotatePoints_AroundZ(points, rot);
  }
  return points;
}

function toRadians(degress) {
  return degress * (Math.PI / 180);
}

function rotatePoints_AroundZ(points, rot) {
  rot = toRadians(rot);
  let rotateMatrix = [[Math.cos(rot), Math.sin(rot), 0 ],
                      [-Math.sin(rot), Math.cos(rot), 0],
                      [0, 0, 0]];
  for (let i = 0, buf; i < points.length; i++){
    buf = [[points[i].x], [points[i].y], [points[i].z]];
    buf = multiplyMatrix(rotateMatrix, buf);
    points[i] = {x: buf[0][0], y: buf[1][0], z: points[i].z};
  }
  return points;
}

function multiplyMatrix(A, B){
    let rowsA = A.length, colsA = A[0].length,
        rowsB = B.length, colsB = B[0].length,
        C = [];
    if (colsA != rowsB)
      return false;
    for (let i = 0; i < rowsA; i++)
      C[i] = [];
    for (let k = 0; k < colsB; k++){
      for (let i = 0; i < rowsA; i++){
        let sum = 0;
          for (let j = 0; j < rowsB; j++)
            sum += A[i][j] * B[j][k];
          C[i][k] = sum;
        }
     }
    return C;
}

function PointXYZ(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}
