var startAngle = 0;
var arc = Math.PI / 18.5;
var spinTimeout = null;
var spinsize = 150;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;
var ctx;
var check = true;

var total_money = 1000;
var put_money = 0;

var win_number;

function draw() { //初始畫面繪圖
    drawRouletteWheel();
    drawTable();
    var text = document.getElementById("money");
    text.innerHTML += total_money;

    text = document.getElementById("putmoney");
    text.innerHTML += put_money;
}

function isEven(n) {
    return (n % 2 == 0);
}

function isOdd(n) {
    return (Math.abs(n) % 2 == 1);
}

function getText(i) { //輪盤數字
    var text;
    if (i === 36)
        text = "0";
    else if (isEven(i))
        text = (i + 1).toString();
    else if (isOdd(i))
        text = (i + 1).toString();
    return text;
}

function drawRouletteWheel() { //畫輪盤

    var canvas = document.getElementById("wheelcanvas");
    if (canvas.getContext) {
        var outsideRadius = 145;
        var textRadius = 125;
        var insideRadius = 100;

        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 1000, 1000);


        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.font = 'bold 20px Avenir Next, sans-serif';

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
                ctx.fillStyle = "black";
            else if (isEven(i + 1))
                ctx.fillStyle = "black";
            else if (isOdd(i + 1))
                ctx.fillStyle = "white";
            ctx.translate(spinsize + Math.cos(angle + arc / 2) * textRadius, spinsize + Math.sin(angle + arc / 2) *
                textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            var text = getText(i);
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        }

        //Arrow
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.moveTo(spinsize - 4, spinsize - (outsideRadius + 5));
        ctx.lineTo(spinsize + 4, spinsize - (outsideRadius + 5));
        ctx.lineTo(spinsize + 4, spinsize - (outsideRadius - 5));
        ctx.lineTo(spinsize + 9, spinsize - (outsideRadius - 5));
        ctx.lineTo(spinsize + 0, spinsize - (outsideRadius - 13));
        ctx.lineTo(spinsize - 9, spinsize - (outsideRadius - 5));
        ctx.lineTo(spinsize - 4, spinsize - (outsideRadius - 5));
        ctx.lineTo(spinsize - 4, spinsize - (outsideRadius + 5));
        ctx.fill();
    }
}

function spin() {
    if (check == true) {
        if (check_money() == true) {
            var text = document.getElementById("money");
            total_money -= put_money;
            text.innerHTML = "剩餘金額: " + total_money;

            check = false;
            spinAngleStart = Math.random() * 10 + 10;
            spinTime = 0;
            spinTimeTotal = Math.random() * 3 + 4 * 1618;
            rotateWheel();
        } else
            alert("籌碼不夠!!");
    }
}

function rotateWheel() { //輪盤轉動
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
        ctx.fillStyle = "white";
        ctx.shadowColor = "black";
    } else if (isEven(index + 1)) {
        ctx.fillStyle = "red";
        ctx.shadowColor = "white";
    } else if (isOdd(index + 1)) {
        ctx.fillStyle = "black";
        ctx.shadowColor = "white";
    }
    ctx.font = 'bold 150px sans-serif';
    ctx.shadowOffsetX = -2;
    ctx.shadowOffsetY = -2;
    ctx.shadowBlur = 1;

    var text = getText(index);
    win_number = eval(text); //抽到的號碼 //modified 1/1
    ctx.fillText(text, spinsize - ctx.measureText(text).width / 2, spinsize + 52);
    ctx.restore();
    check = true;
    checkwin();

    //test

}

function easeOut(t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}
//////////////////////////////////////////////////////////////////////end  wheel


function drawTable() {
    var numf = 1;
    var nums = 0;
    var numt = 0;
    var color = "black";
    var table;
    var newcell;
    var temp;
    for (var i = 1; i < 37; i++) {
        if (i % 3 == 0) {
            table = document.getElementById("third_row");
            newcell = table.insertCell(numt);
            numt++;
        } else if (i % 3 == 1) {
            table = document.getElementById("first_row");
            newcell = table.insertCell(numf);
            numf++;
        } else {
            table = document.getElementById("second_row");
            newcell = table.insertCell(nums);
            nums++;
        }

        if (i % 2 == 0)
            color = "red";
        else
            color = "black";

        temp = "" + i;
        newcell.style.backgroundColor = color;
        newcell.id = temp;

        newcell.onclick = function () { //newcell.onclick = putmoney 不能取得this的資訊
            putmoney(this);
        }

        newcell.onmouseover = function () { //newcell.onclick = putmoney 不能取得this的資訊
            mouseovernum(this);
        }

        newcell.onmouseout = function () { //newcell.onclick = putmoney 不能取得this的資訊
            mouseout(0, 36);
        }

        newcell.innerHTML = temp;
    }

    table = document.getElementById("third_row");
    newcell = table.insertCell(numt);
    newcell.style.backgroundColor = 'green';
    newcell.innerHTML = "2 to 1";
    newcell.id = "39";
    newcell.onclick = function () {
        putmoney(this);
    }
    newcell.onmouseover = function () {
        mouseoverelse(3);
    }
    newcell.onmouseout = function () {
        mouseout(1, 36);
    }

    table = document.getElementById("second_row");
    newcell = table.insertCell(nums);
    newcell.style.backgroundColor = 'green';
    newcell.innerHTML = "2 to 1";
    newcell.id = "38";
    newcell.onclick = function () {
        putmoney(this);
    }
    newcell.onmouseover = function () {
        mouseoverelse(2);
    }
    newcell.onmouseout = function () {
        mouseout(1, 36);
    }

    table = document.getElementById("first_row");
    newcell = table.insertCell(numf);
    newcell.style.backgroundColor = 'green';
    newcell.innerHTML = "2 to 1";
    newcell.id = "37";
    newcell.onclick = function () {
        putmoney(this);
    }
    newcell.onmouseover = function () {
        mouseoverelse(1);
    }
    newcell.onmouseout = function () {
        mouseout(1, 36);
    }
}

//1 dimentional array
//arr[0] = none;
//arr[1] = number1;
// arr[2] = number2;
// ,etc
// arr[36] = number36;
// arr[37] = 2 to 1 first row;
// ...
// arr[40] = 1st 12
// ...
// arr[43] = 1 to 18
// arr[44] = 19 to 36
// arr[45] = even and red;
// arr[46] = odd and black;

//create an array that consists of zeros
var arr = new Array(50).fill(0);


function putmoney(obj) { //數字押注


    var num = new Number(obj.id); //知道投注的東西
    var temp, checkcoin;

    //readCoin as choison coin

    if (num > 0 || num < 49) {
        arr[num] += readCoin;
        put_money += readCoin;
    }

    var text = document.getElementById("putmoney");
    text.innerHTML = "已投注: " + put_money;


    //  投注表  投注//modified
    var odiv = document.createElement("P");
    odiv.id = "willBeDeleteByClean";

    var represent;
    if (num < 37) {
        represent = num;
    } else if (num == 37) {
        represent = "2 to 1 first row";
    } else if (num == 38) {
        represent = "2 to 1 second row";
    } else if (num == 39) {
        represent = "2 to 1 third row";
    } else if (num == 40) {
        represent = "1st 12";
    } else if (num == 41) {
        represent = "2nd 12";
    } else if (num == 42) {
        represent = "3st 12";
    } else if (num == 43) {
        represent = "1 to 18";
    } else if (num == 44) {
        represent = "19 to 36";
    } else if (num == 45) {
        represent = "even";
    } else if (num == 46) {
        represent = "odd";
    } else if (num == 47) {
        represent = "red";
    } else if (num == 48) {
        represent = "black";
    }

    var t = document.createTextNode("投注號碼: " + represent + " 金額 " + readCoin + " 元 " + "共" + arr[num] + "元");
    odiv.id = "willBeDeleteByClean";
    odiv.appendChild(t);
    obox.appendChild(odiv);
    //  

}


function checkwin() {
    var check_table = document.getElementById(win_number);
    var text = document.getElementById("money");

    var winnum = win_number;
    if (winnum > 0) {
        total_money += arr[winnum] * 36;

        if (isOdd(winnum)) {
            total_money += arr[46] * 2;
            total_money += arr[48] * 2;
        } else {
            total_money += arr[47] * 2;
            total_money += arr[49] * 2;
        }

        if (winnum < 19) {
            total_money += arr[43] * 2;
        } else {
            total_money += arr[44] * 2;
        }

        //row
        if (whichRow(winnum) == 1) {
            total_money += arr[37] * 3;
        } else if (whichRow(winnum) == 2) {
            total_money += arr[38] * 3;
        } else {
            total_money += arr[39] * 3;
        }

        if (winnum < 13) {
            total_money += arr[40] * 3;
        } else if (winnum > 24) {
            total_money += arr[42] * 3;
        } else {
            total_money += arr[41] * 3;
        }
    }


    text = document.getElementById("money");
    text.innerHTML = "剩餘金額: " + total_money;

    clean();
}

function whichRow(num) {
    return (num % 3);
}

function check_money() {
    if (total_money < put_money)
        return false;
    else
        return true;
}

function clean() { //賭盤      投注版也要清除  

    var text;
    // var borderColor;
    for (var i = 1; i < 37; i++) {
        text = document.getElementById("" + i);
        // borderColor = document.getElementById("" + i);
        if (i % 2 == 0) {
            text.style.backgroundColor = 'red';
            text.style.border = '2px solid black';
        } else
            text.style.backgroundColor = 'black';
        text.style.border = '2px solid black';
    }

    text = document.getElementById("0");
    text.style.backgroundColor = 'green';
    text.style.border = '2px solid black';
    text = document.getElementById("40");
    text.style.backgroundColor = 'green';
    text.style.border = '2px solid black';
    text = document.getElementById("41");
    text.style.backgroundColor = 'green';
    text.style.border = '2px solid black';
    text = document.getElementById("42");
    text.style.backgroundColor = 'green';
    text.style.border = '2px solid black';
    text = document.getElementById("43");
    text.style.backgroundColor = 'green';
    text.style.border = '1px solid black';
    text = document.getElementById("45");
    text.style.backgroundColor = 'green';
    text.style.border = '1px solid black';
    text = document.getElementById("46");
    text.style.backgroundColor = 'green';
    text.style.border = '2px solid black';
    text = document.getElementById("44");
    text.style.backgroundColor = 'green';
    text.style.border = '2px solid black';
    text = document.getElementById("48");
    text.style.backgroundColor = 'black';
    text.style.border = '2px solid black';
    text = document.getElementById("47");
    text.style.backgroundColor = 'red';
    text.style.border = '2px solid black';
    text = document.getElementById("37");
    text.style.backgroundColor = 'green';
    text.style.border = '2px solid black';
    text = document.getElementById("38");
    text.style.backgroundColor = 'green';
    text.style.border = '2px solid black';
    text = document.getElementById("39");
    text.style.backgroundColor = 'green';
    text.style.border = '2px solid black';
    put_money = 0;
    text = document.getElementById("putmoney");
    text.innerHTML = "已投注: " + put_money;



    //clean the array
    for (let i = 0; i < 50; ++i) {
        arr[i] = 0;
    }
    for (let i = 0; i < 230; i++) {
        deleteElementById("willBeDeleteByClean");
    }
    // var id_count = document.getElementById("willBeDeleteByClean").length();
    // while (id_count > 0) {
    //     deleteElementById("willBeDeleteByClean");
    //     id_count = document.getElementById("willBeDeleteByClean").length();
    // }
}

function deleteElementById(id) //投注表全清除
{
    var d = document.getElementById(id);
    d.remove();

}


// function checkOtherWin(obj) {
//     text = document.getElementById("money");
//     text.innerHTML = "剩餘金額: " + total_money;
//     clean();
// }

/////////////////////////////////////////////   投注表相關

//數字
let oadd = document.getElementById("add");
let odel = document.getElementById("del");
let obox = document.getElementById("box");

//除了數字
let oadd2 = document.getElementById("add2");
let odel2 = document.getElementById("del2");
let obox2 = document.getElementById("box2");




/////////////////////////////////////////////////////////
var readCoin = 0;

function selectCoin(obj) {

    var c10 = document.getElementById("coin10");
    var c25 = document.getElementById("coin25");
    var c50 = document.getElementById("coin50");

    if (obj.id == "coin25") {

        obj.style.border = "3px solid black";
        c10.style.border = "none";
        c50.style.border = "none";
        readCoin = 25;
    }

    if (obj.id == "coin10") {

        obj.style.border = "3px solid black";
        c25.style.border = "none";
        c50.style.border = "none";
        readCoin = 10;
    }

    if (obj.id == "coin50") {

        obj.style.border = "3px solid black";
        c10.style.border = "none";
        c25.style.border = "none";
        readCoin = 50;
    }
}


function mouseover(first, last) { //單一數字除外
    for (var i = first; i <= last; i++) {
        document.getElementById("" + i + "").style.opacity = "0.3";
    }
}

function mouseovernum(number) { //單一數字
    document.getElementById("" + number.id + "").style.opacity = "0.3";
}

function mouseoverelse(row) {
    if (row == 3) { //第三行2to1
        for (var i = 3; i <= 36; i += 3) {
            document.getElementById("" + i + "").style.opacity = "0.3";
        }
    } else if (row == 2) { //第二行2to1
        for (var i = 2; i <= 35; i += 3) {
            document.getElementById("" + i + "").style.opacity = "0.3";
        }
    } else if (row == 1) { //第一行2to1
        for (var i = 1; i <= 34; i += 3) {
            document.getElementById("" + i + "").style.opacity = "0.3";
        }
    } else if (row == 4) { //odd  black
        for (var i = 1; i <= 35; i += 2) {
            document.getElementById("" + i + "").style.opacity = "0.3";
        }
    } else if (row == 5) { //odd  black
        for (var i = 2; i <= 36; i += 2) {
            document.getElementById("" + i + "").style.opacity = "0.3";
        }
    }

}

function mouseout(first, last) {
    for (var i = first; i <= last; i++) {
        document.getElementById("" + i + "").style.opacity = "1";
    }
}

draw();