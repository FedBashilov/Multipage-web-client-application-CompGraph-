let ctx = canvas.getContext("2d");
ctx.translate(canvas.width / 2, canvas.height / 1.7);

window.addEventListener("load", draw(null), false);

document.documentElement.addEventListener("input", draw, false);

function draw(event) {
  if(event !== null){
    equateRangeAndText(event.target);
  }

  let sizeX = parseInt(document.getElementById("rsetX").value),
      sizeY = parseInt(document.getElementById("rsetY").value),
      sizeZ = parseInt(document.getElementById("rsetZ").value),
      rotateX = parseInt(document.getElementById("rsetRotate_X").value);
      rotateY = parseInt(document.getElementById("rsetRotate_Y").value);
      rotateZ = parseInt(document.getElementById("rsetRotate_Z").value);

  //очистка холста
  ctx.clearRect(-canvas.width / 2, -canvas.height / 1.7, canvas.width, canvas.height);

  //трехмерные вершины
  let tops = [];
  for (let count = 0, x = 0; x < 2; x++)
    for (let y = 0; y < 2; y++)
      for (let z = 0; z < 2; z++, count++)
        tops[count] = new PointXYZ(sizeX * x, sizeY * y, sizeZ * z);

  tops = rotatePoints_AroundX(tops, rotateX);
  tops = rotatePoints_AroundY(tops, rotateY);
  tops = rotatePoints_AroundZ(tops, rotateZ);

  //векторные произведения двух векторов каждой грани - нормали граней
  let faceNorm = [];
  faceNorm[0] = (new Vector3D(tops[6].x - tops[7].x, tops[6].y - tops[7].y,
        tops[6].z - tops[7].z)).vectorProduct(new Vector3D(tops[3].x - tops[7].x,
                                  tops[3].y - tops[7].y, tops[3].z - tops[7].z));
  faceNorm[1] = (new Vector3D(tops[1].x - tops[5].x, tops[1].y - tops[5].y,
        tops[1].z - tops[5].z)).vectorProduct(new Vector3D(tops[4].x - tops[5].x,
                                  tops[4].y - tops[5].y, tops[4].z - tops[5].z));

  faceNorm[2] = (new Vector3D(tops[3].x - tops[7].x, tops[3].y - tops[7].y,
        tops[3].z - tops[7].z)).vectorProduct(new Vector3D(tops[5].x - tops[7].x,
                                  tops[5].y - tops[7].y, tops[5].z - tops[7].z));

  faceNorm[3] = (new Vector3D(tops[0].x - tops[2].x, tops[0].y - tops[2].y,
        tops[0].z - tops[2].z)).vectorProduct(new Vector3D(tops[3].x - tops[2].x,
                                  tops[3].y - tops[2].y, tops[3].z - tops[2].z));

  faceNorm[4] = (new Vector3D(tops[4].x - tops[6].x, tops[4].y - tops[6].y,
        tops[4].z - tops[6].z)).vectorProduct(new Vector3D(tops[2].x - tops[6].x,
                                  tops[2].y - tops[6].y, tops[2].z - tops[6].z));

  faceNorm[5] = (new Vector3D(tops[4].x - tops[5].x, tops[4].y - tops[5].y,
        tops[4].z - tops[5].z)).vectorProduct(new Vector3D(tops[7].x - tops[5].x,
                                  tops[7].y - tops[5].y, tops[7].z - tops[5].z));

  let light = new Vector3D(1, 1, 1);
  light.normalize();
  //находим интенсивность освещения каждой грани
  let faceIntensity = [];
  for (let i = 0; i < faceNorm.length; i++) {
      faceNorm[i].normalize();
      faceIntensity[i] = faceNorm[i].scalarProduct(light);
  }

  for (let i = 0; i < tops.length; i++) {
    tops[i] = transPointToIsom(tops[i]);
  }

  //рисуем грани
  ctx.strokeStyle  ="black";
    //верхняя грань
  if(faceIntensity[0] > 0) {
    ctx.fillStyle = "rgb("+ Math.round(255 * faceIntensity[0]) + "," +
    Math.round(255 * faceIntensity[0]) + "," +
    Math.round(255 * faceIntensity[0]) + ")";
    ctx.beginPath();
    ctx.moveTo(tops[7].x, tops[7].y);
    ctx.lineTo(tops[3].x, tops[3].y);
    ctx.lineTo(tops[2].x, tops[2].y);
    ctx.lineTo(tops[6].x, tops[6].y);
    ctx.lineTo(tops[7].x, tops[7].y);
    ctx.stroke();
    ctx.fill();
  }
    //нижняя
  if(faceIntensity[1] > 0) {
    ctx.fillStyle = "rgb("+ Math.round(255 * faceIntensity[1]) + "," +
    Math.round(255 * faceIntensity[1]) + "," +
    Math.round(255 * faceIntensity[1])  +  ")";
    ctx.beginPath();
    ctx.moveTo(tops[5].x, tops[5].y);
    ctx.lineTo(tops[1].x, tops[1].y);
    ctx.lineTo(tops[0].x, tops[0].y);
    ctx.lineTo(tops[4].x, tops[4].y);
    ctx.lineTo(tops[5].x, tops[5].y);
    ctx.stroke();
    ctx.fill();
  }
    //боковые
  if(faceIntensity[2] > 0) {
    ctx.fillStyle = "rgb(" + Math.round(255 * faceIntensity[2]) + "," +
    Math.round(255 * faceIntensity[2]) + "," +
    Math.round(255 * faceIntensity[2]) + ")";
    ctx.beginPath();
    ctx.moveTo(tops[5].x, tops[5].y);
    ctx.lineTo(tops[1].x, tops[1].y);
    ctx.lineTo(tops[3].x, tops[3].y);
    ctx.lineTo(tops[7].x, tops[7].y);
    ctx.lineTo(tops[5].x, tops[5].y);
    ctx.stroke();
    ctx.fill();
  }
  if(faceIntensity[3] > 0) {
    ctx.fillStyle = "rgb(" + Math.round(255 * faceIntensity[3]) + "," +
    Math.round(255 * faceIntensity[3]) + "," +
    Math.round(255 * faceIntensity[3]) + ")";
    ctx.beginPath();
    ctx.moveTo(tops[1].x, tops[1].y);
    ctx.lineTo(tops[3].x, tops[3].y);
    ctx.lineTo(tops[2].x, tops[2].y);
    ctx.lineTo(tops[0].x, tops[0].y);
    ctx.lineTo(tops[1].x, tops[1].y);
    ctx.stroke();
    ctx.fill();
  }
  if(faceIntensity[4] > 0) {
    ctx.fillStyle = "rgb(" + Math.round(255 * faceIntensity[4]) + "," +
    Math.round(255 * faceIntensity[4]) + "," +
    Math.round(255 * faceIntensity[4]) + ")";
    ctx.beginPath();
    ctx.moveTo(tops[0].x, tops[0].y);
    ctx.lineTo(tops[2].x, tops[2].y);
    ctx.lineTo(tops[6].x, tops[6].y);
    ctx.lineTo(tops[4].x, tops[4].y);
    ctx.lineTo(tops[0].x, tops[0].y);
    ctx.stroke();
    ctx.fill();
  }
  if(faceIntensity[5] > 0) {
    ctx.fillStyle = "rgb(" + Math.round(255 * faceIntensity[5]) + "," +
    Math.round(255 * faceIntensity[5]) + "," +
    Math.round(255 * faceIntensity[5]) + ")";
    ctx.beginPath();
    ctx.moveTo(tops[5].x, tops[5].y);
    ctx.lineTo(tops[7].x, tops[7].y);
    ctx.lineTo(tops[6].x, tops[6].y);
    ctx.lineTo(tops[4].x, tops[4].y);
    ctx.lineTo(tops[5].x, tops[5].y);
    ctx.stroke();
    ctx.fill();
  }
  //оси
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    ctx.moveTo(0, -(canvas.height / 1.7 - 40));
    ctx.lineTo(0, -(canvas.height / 1.7 - 10));
    ctx.lineTo(-5, -(canvas.height / 1.7 - 20));
    ctx.lineTo(5, -(canvas.height / 1.7 - 20));
    ctx.lineTo(0, -(canvas.height / 1.7 - 10));
    ctx.rotate((Math.PI/180)*120);
  }
  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
  ctx.stroke();
  ctx.fill();

  ctx.font = "14px Arial";
  ctx.fillText("Y", -20, -(canvas.height / 1.7 - 20));
  ctx.fillText("X", canvas.height / 2.3, canvas.height / 3);
  ctx.fillText("Z", -(canvas.height / 2.3), canvas.height / 3);
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

function rotatePoints_AroundX(points, rot) {
  rot = toRadians(rot);
  let rotateMatrix = [[0, 0, 0],
                      [0, Math.cos(rot), Math.sin(rot)],
                      [0, -Math.sin(rot), Math.cos(rot)]];

  for (let i = 0, buf; i < points.length; i++){
    buf = [[points[i].x], [points[i].y], [points[i].z]];
    buf = multiplyMatrix(rotateMatrix, buf);
    points[i] = {x: points[i].x, y: buf[1][0], z: buf[2][0]};
  }
  return points;
}

function rotatePoints_AroundY(points, rot) {
  rot = toRadians(rot);
  let rotateMatrix = [[Math.cos(rot), 0,  -Math.sin(rot)],
                      [0, 0, 0],
                      [Math.sin(rot), 0, Math.cos(rot)]];

  for (let i = 0, buf; i < points.length; i++){
    buf = [[points[i].x], [points[i].y], [points[i].z]];
    buf = multiplyMatrix(rotateMatrix, buf);
    points[i]={x: buf[0][0], y: points[i].y, z: buf[2][0]};
  }
  return points;
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

function toRadians(degress) {
  return degress * (Math.PI / 180);
}

function PointXYZ(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}

function Vector3D(i, j, k) {
  this.i = i;
  this.j = j;
  this.k = k;
  this.length = Math.sqrt(Math.pow(this.i, 2) + Math.pow(this.j, 2) + Math.pow(this.k, 2));
  this.normalize = function () {
    this.i = i / this.length;
    this.j = j / this.length;
    this.k = k / this.length;
    this.length = Math.sqrt(Math.pow(this.i, 2) + Math.pow(this.j, 2) + Math.pow(this.k, 2));
  }
  this.scalarProduct = function (vector) {
    return this.i * vector.i + this.j * vector.j + this.k * vector.k;
  }
  this.vectorProduct = function (vector) {
    return  new Vector3D(this.j * vector.k - vector.j * this.k,
                         -(this.i * vector.k - vector.i * this.k),
                         this.i * vector.j - vector.i * this.j );
  }
}