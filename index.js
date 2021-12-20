var startAngle = 0;
var arc = Math.PI / 18.5;
var spinTimeout = null;
var spinsize = 320;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

function draw() {
  drawRouletteWheel();
}

function isEven(n) {
  return (n % 2 == 0);
}

function isOdd(n) {
  return (Math.abs(n) % 2 == 1);
}

function getText(i) {
  var text;
  if (i === 36)
    text = "0";
  else if (isEven(i))
    text = (i + 1).toString();
  else if (isOdd(i))
    text = (i + 1).toString();
  return text;
}

function drawRouletteWheel() {
  var canvas = document.getElementById("wheelcanvas");
  if (canvas.getContext) {
    var outsideRadius = 250; //240
    var textRadius = 210; //200
    var insideRadius = 100; //165

    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 1000, 1000); // ctx.clearRect(0,0,spinsize,spinsize);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    ctx.font = 'bold 35px Avenir Next, sans-serif';

    for (var i = 0; i < 37; i++) {
      var angle = startAngle + i * arc;
      if (i === 36)
        ctx.fillStyle = "green";
      else if (isEven(i + 1))
        ctx.fillStyle = "red";
      else if (isOdd(i + 1))
        ctx.fillStyle = "black";

      ctx.beginPath();
      ctx.arc(spinsize, spinsize, outsideRadius, angle, angle + arc, false);
      ctx.arc(spinsize, spinsize, insideRadius, angle + arc, angle, true);

      ctx.stroke();
      ctx.fill();

      ctx.save();

      if (i === 36)
        ctx.fillStyle = "white";
      else if (i === 37)
        ctx.fillStyle = "white";
      else if (isEven(i + 1))
        ctx.fillStyle = "black";
      else if (isOdd(i + 1))
        ctx.fillStyle = "white";
      ctx.translate(spinsize + Math.cos(angle + arc / 2) * textRadius, spinsize + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      var text = getText(i);
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }

    //Arrow
    ctx.fillStyle = "gold";
    ctx.beginPath();
    ctx.moveTo(spinsize - 8, spinsize - (outsideRadius + 10));
    ctx.lineTo(spinsize + 8, spinsize - (outsideRadius + 10));
    ctx.lineTo(spinsize + 8, spinsize - (outsideRadius - 10));
    ctx.lineTo(spinsize + 18, spinsize - (outsideRadius - 10));
    ctx.lineTo(spinsize + 0, spinsize - (outsideRadius - 26));
    ctx.lineTo(spinsize - 18, spinsize - (outsideRadius - 10));
    ctx.lineTo(spinsize - 8, spinsize - (outsideRadius - 10));
    ctx.lineTo(spinsize - 8, spinsize - (outsideRadius + 10));
    ctx.fill();
  }
}

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1618;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI / 180);
  drawRouletteWheel();
  spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = startAngle * 180 / Math.PI + 90;
  var arcd = arc * 180 / Math.PI;
  var index = Math.floor((360 - degrees % 360) / arcd);
  ctx.save();
  if (index === 36) {
    ctx.fillStyle = "green";
    ctx.shadowColor = "grey";
  } else if (index === 37) {
    ctx.fillStyle = "green";
    ctx.shadowColor = "grey";
  } else if (isEven(index + 1)) {
    ctx.fillStyle = "black";
    ctx.shadowColor = "white";
  } else if (isOdd(index + 1)) {
    ctx.fillStyle = "red";
    ctx.shadowColor = "white";
  }
  ctx.font = 'bold 100px sans-serif';
  ctx.shadowOffsetX = -2;
  ctx.shadowOffsetY = -2;
  ctx.shadowBlur = 1;

  var text = getText(index);
  ctx.fillText(text, spinsize - ctx.measureText(text).width / 2, spinsize + 20);
  ctx.restore();
}

function easeOut(t, b, c, d) {
  var ts = (t /= d) * t;
  var tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

draw();