let ctx = canvas.getContext("2d"),
    cx = canvas.width / 2,
    cy = canvas.height / 2;

(function() {
  window.addEventListener("resize", resizeThrottler, false);

  let resizeTimeout;
  function resizeThrottler() {
    if ( !resizeTimeout ) {
      resizeTimeout = setTimeout(() => {
        resizeTimeout = null;
        actualResizeHandler();
       }, 66);
    }
  }
}());

window.addEventListener("load", ()=>{
  actualResizeHandler();
  document.getElementById("canvas").style.display="block";
}, false);

document.documentElement.addEventListener("click", deletePointNode, false);

document.getElementById("addPoint").addEventListener("click", addPointNode, false);

document.getElementById("drawing").addEventListener("click", draw, false);

function actualResizeHandler() {
  let output = document.getElementById("canvas");
  output.width = window.innerWidth * 0.9;
  cx = output.width / 2;
  draw(null);
}

function deletePointNode(event) {
  if (event.target.classList.contains("deletePoint")) {
    if(document.getElementsByClassName("point").length > 3){
      event.target.parentNode.remove();
    }
    else{
      alert("Нельзя задать менее трех точек!");
    }
  }
}

function addPointNode(event) {
  let parent = document.getElementById("div_points"),
      point = document.getElementsByClassName("point"),
      newPoint = point[point.length-1].cloneNode(true);
  parent.appendChild(newPoint);
}

function draw(event) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //оси
    ctx.beginPath();
    ctx.moveTo(20, cy);
    ctx.lineTo(canvas.width - 20, cy);
    ctx.lineTo(canvas.width - 30, cy - 5);
    ctx.lineTo(canvas.width - 30, cy + 5);
    ctx.lineTo(canvas.width - 20, cy);
    ctx.moveTo(cx, canvas.height - 20);
    ctx.lineTo(cx, 20);
    ctx.lineTo(cx - 5, 30);
    ctx.lineTo(cx + 5, 30);
    ctx.lineTo(cx, 20);
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.stroke();
    ctx.fill();
    ctx.font = "14px Arial";
    ctx.fillText("X", canvas.width - 20, cy - 10);
    ctx.fillText("Y", cx - 20, 20);

    //получение точек
    let pointsElem = document.getElementsByClassName("point"),
        points = [];
    for (let i = 0; i < pointsElem.length; i++) {
      points[i] = new PointXY();
      points[i].x = cx + parseFloat(pointsElem[i].getElementsByTagName("input")[0].value);
      points[i].y = cy - parseFloat(pointsElem[i].getElementsByTagName("input")[1].value);
    }
    //сортировка по х
    points.sort((a, b) => a.x - b.x);

    //отрисовка точек и линий ломаной
    ctx.beginPath();
    for (let i = 0, circle = new Path2D(); i < points.length; i++) {
      circle.moveTo(points[i].x, points[i].y)
      circle.arc(points[i].x, points[i].y, 3, 0, 2*Math.PI);
      ctx.fillStyle = "red";
      ctx.fill(circle);

      if (i < points.length - 1) {
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[i+1].x, points[i+1].y);
      }
      else {
          ctx.strokeStyle="black";
          ctx.stroke();
      }
    }
    //cплайн
      //построение матрицы
    let matrix = buildSplineMatrix(points, 0);
      //решение СЛАУ
    let roots = matrixSolution(matrix);
      //отрисовка сплайна
      ctx.fillStyle = "blue";
      for (let splNum = 0; splNum < points.length-1; splNum++) {
        for (let x = points[splNum].x; x <= points[splNum+1].x; x+=0.1) {
          ctx.fillRect(x, (roots[3*splNum] * Math.pow(x,2) +
          roots[3*splNum+1] * x + roots[3*splNum+2]), 1, 1);
        }
      }
}

function buildSplineMatrix(p) {
  let size = 3 * (p.length-1);
  let matrix = [size];
  for (let i = 0; i < size; i++) {
    matrix[i] = new Array(size+1).fill(0);
  }
  for (let i = 0; i < p.length-1; i++) {
    matrix[2*i][3*i] = Math.pow( p[i].x, 2);
    matrix[2*i+1][3*i] = Math.pow( p[i+1].x, 2);
    matrix[2*i][3*i+1] = p[i].x;
    matrix[2*i+1][3*i+1] = p[i+1].x;
    matrix[2*i][3*i+2] = matrix[2*i+1][3*i+2] = 1;
    matrix[2*i][size] = p[i].y;
    matrix[2*i+1][size] = p[i+1].y;
  }
  //равенства первый производных
  for (let i = 0; i < p.length-2; i++) {
    let h = p[i+1].x;
    matrix[2*(p.length-1)+i][3*i] = 2*h;
    matrix[2*(p.length-1)+i][3*i+1] = 1
    matrix[2*(p.length-1)+i][3*(i+1)] = -2*h;
    matrix[2*(p.length-1)+i][3*(i+1)+1] = -1;
  }
  //первая первая производная равна 0
  matrix[size-1][0] = 2*p[0].x;
  matrix[size-1][1] = 1;

  return matrix;
}

function matrixSolution(m) {
  let i, j, k;    //Вспомогательные переменные
  let size = m[0].length - 1;
  Iteration(size);
  return Answers();

  function Iteration(iter_item) { //Функция итеррация
    for(iter_item = 0; iter_item < (size - 1); iter_item++) { //Цикл выполнения итерраций
      if (m[iter_item][iter_item] === 0){
        SwapRows(iter_item); //Проверка на ноль
      }
      for(j = size; j >= iter_item; j--) {
        m[iter_item][j] /= m[iter_item][iter_item]; //Делим строку i на а[i][i]
      }
      for(i = iter_item + 1; i < size; i++) { //Выполнение операций со строками
        for(j = size; j >= iter_item; j--) {
          m[i][j] -= m[iter_item][j] * m[i][iter_item];
        }
      }
    }
  }
  function SwapRows(iter_item) { //Функция перемены строк
    for(i = iter_item + 1; i < size; i++) {
      if(m[i][iter_item] !== 0) {
        for(j = 0; j <= size; j++) {
          k = m[iter_item][j];
          m[iter_item][j] = m[i][j];
          m[i][j] = k;
        }
      return;
      }
    }
  }
  function Answers() { //Функция поиска и вывода корней
    let roots = [size];
    roots[size-1] = m[size-1][size] / m[size-1][size-1];
    for(i = size - 2; i >= 0; i--) {
      k = 0;
      for(j = size - 1; j > i; j--) {
        k = (m[i][j] * roots[j]) + k;
      }
      roots[i] = m[i][size] - k;
    }
    return roots;
  }
}

function PointXY(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}
