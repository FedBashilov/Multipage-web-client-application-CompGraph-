let isomCtx=isom.getContext("2d"),
    dimCtx=dim.getContext("2d");
isomCtx.translate(isom.width / 2, isom.height / 1.7);
dimCtx.translate(dim.width / 2, dim.height / 1.7);

window.addEventListener("load", draw(null), false);

document.documentElement.addEventListener("input", draw, false);

function draw(event) {
  if(event !== null){
    equateRangeAndText(event.target);
  }

  let sizeX = parseInt(document.getElementById("rsetX").value),
      sizeY = parseInt(document.getElementById("rsetY").value),
      sizeZ = parseInt(document.getElementById("rsetZ").value);
  //трехмерные вершины
  let tops=[];
  for (let count = 0, x = 0; x < 2; x++)
    for (let y = 0; y < 2; y++)
      for (let z = 0; z < 2; z++, count++)
        tops[count] = [[sizeX * x], [sizeY * y], [sizeZ * z]];
//оси
  drawAxises();
//  ИЗОМЕТРИЯ
  projection(35.264, 45, tops);
//  ДИМЕТРИЯ
  projection(20.705, 22.208, tops);
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

function drawAxises() {
  //изометрия
  isomCtx.clearRect(-isom.width / 2, -isom.height / 1.7, isom.width, isom.height);

  isomCtx.strokeStyle = "black";
  isomCtx.fillStyle = "black";
  isomCtx.font = "14px Arial";

  isomCtx.beginPath();
  for (let i = 0; i < 3; i++) {
    isomCtx.moveTo(0, -(isom.height / 1.7 - 40));
    isomCtx.lineTo(0, -(isom.height / 1.7 - 10));
    isomCtx.lineTo(-5, -(isom.height / 1.7 - 20));
    isomCtx.lineTo(5, -(isom.height / 1.7 - 20));
    isomCtx.lineTo(0, -(isom.height / 1.7 - 10));
    isomCtx.rotate((Math.PI / 180) * 120);
  }
  isomCtx.stroke();
  isomCtx.fill();

  isomCtx.fillText("Y", -20, -(isom.height / 1.7 - 20));
  isomCtx.fillText("X", isom.height / 2.3, isom.height / 3);
  isomCtx.fillText("Z", -(isom.height / 2.3), isom.height / 3);

  //диметрия
  dimCtx.clearRect(-dim.width / 2, -dim.height / 1.7, dim.width, dim.height);


  dimCtx.beginPath();
  for (let i = 0; i < 3; i++) {
    dimCtx.moveTo(0, -(dim.height / 1.9 - 40));
    dimCtx.lineTo(0, -(dim.height / 1.9 - 10));
    dimCtx.lineTo(-5, -(dim.height / 1.9 - 20));
    dimCtx.lineTo(5, -(dim.height / 1.9 - 20));
    dimCtx.lineTo(0, -(dim.height / 1.9 - 10));
    if(i === 0)
      dimCtx.rotate((Math.PI / 180) * 98.2);
    else if(i === 1) {
      dimCtx.rotate((Math.PI / 180) * 130.8);
    }else{
      dimCtx.rotate((Math.PI / 180) * 131);
    }
  }
  dimCtx.strokeStyle = "black";
  dimCtx.fillStyle = "black";
  dimCtx.font = "14px Arial";
  dimCtx.stroke();
  dimCtx.fill();

  dimCtx.fillText("Y", -20, -(dim.height / 1.7 - 20));
  dimCtx.fillText("X", dim.height / 2.3, dim.height / 9);
  dimCtx.fillText("Z", -(dim.height / 2.3), dim.height / 3);
}

function projection(Alf, Bet, tops) {
  let proj;
  if(Alf == 35.264)
    proj = isomCtx;
  else
    proj = dimCtx;

  let alfa = toRadians(Alf),
      betta = toRadians(Bet),
      rotateMatrix=[[Math.cos(betta), 0 ,-Math.sin(betta)],
                    [-Math.sin(alfa) * Math.sin(betta), Math.cos(alfa),
                                            -Math.sin(alfa) * Math.cos(betta)],
                    [0, 0, 0]];
  //вершины
  let projTops=[];
  for (let i = 0; i < tops.length; i++){
    projTops[i] = multiplyMatrix(rotateMatrix, tops[i]);
  }

  //отрисовка
    //рисуем вершины
  proj.fillStyle="red";
  for (i = 0; i < projTops.length; i++) {
    proj.beginPath();
    proj.arc(projTops[i][0][0], -projTops[i][1][0], 2, 0, 2*Math.PI);
    proj.fill();
  }
  //рисуем ребра
  drawEdges(projTops, proj);
}

function drawEdges(projTops, proj) {
  proj.strokeStyle = "blue";

  proj.beginPath();
  proj.lineTo(projTops[0][0][0], -projTops[0][1][0]);
  proj.lineTo(projTops[1][0][0], -projTops[1][1][0]);
  proj.lineTo(projTops[3][0][0], -projTops[3][1][0]);
  proj.lineTo(projTops[2][0][0], -projTops[2][1][0]);
  proj.lineTo(projTops[0][0][0], -projTops[0][1][0]);
  proj.lineTo(projTops[4][0][0], -projTops[4][1][0]);
  proj.lineTo(projTops[5][0][0], -projTops[5][1][0]);
  proj.lineTo(projTops[7][0][0], -projTops[7][1][0]);
  proj.lineTo(projTops[6][0][0], -projTops[6][1][0]);
  proj.lineTo(projTops[4][0][0], -projTops[4][1][0]);
  proj.moveTo(projTops[2][0][0], -projTops[2][1][0]);
  proj.lineTo(projTops[6][0][0], -projTops[6][1][0]);
  proj.moveTo(projTops[3][0][0], -projTops[3][1][0]);
  proj.lineTo(projTops[7][0][0], -projTops[7][1][0]);
  proj.moveTo(projTops[1][0][0], -projTops[1][1][0]);
  proj.lineTo(projTops[5][0][0], -projTops[5][1][0]);

  proj.stroke();
}

function multiplyMatrix(A, B){
    let rowsA = A.length, colsA = A[0].length,
        rowsB = B.length, colsB = B[0].length,
        C = [];
    if (colsA != rowsB)
      return false;
    for (let i = 0; i < rowsA; i++)
      C[ i ] = [];
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