console.log('The daisyworld simulation has initialized.');

var wrld = [];
var lifeCycle;
var wT = [];
var bT = [];
var pT = [];
var sT = [];

var modal;
var time;
var graph = 1000;

function help() {
    modal = document.getElementById("simInfo");
    modal.style.display = "block";

    document.getElementsByClassName("close")[0].onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    start();
}

function start() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.getElementById('all').innerHTML = '<h1>View on a computer >:(</h1><br/><img src="linus.jpg" alt="ur bad" width="100%">'
    } else {
        document.getElementById('wht').hidden = true;
        document.getElementById('blk').hidden = true;
        for (let x = 0; x < 80; x++) {
            wrld[x] = [];
            for (let y = 0; y < 48; y++) {
                wrld[x][y] = { flwr: undefined, temp: undefined };
                if (Math.random() < 0.01) {
                    if (Math.random() < 0.5) {
                        wrld[x][y] = { flwr: 'w', temp: undefined };
                    } else {
                        wrld[x][y] = { flwr: 'b', temp: undefined };
                    }
                }
            }
        }
        document.getElementById("sun").value = 0;
        temp();
        time = 200;
        wT = [];
        bT = [];
        pT = [];
        sT = [];
        data();
        for (let k = 0; k < graph; k++) {
            wT.push(wT[0]);
            bT.push(bT[0]);
            pT.push(pT[0]);
            sT.push(sT[0]);
        }
        draw();
        clearInterval(lifeCycle);
        document.getElementById('playPause').innerHTML = 'PLAY'

        sun.oninput = function () {
            time = 999;
            sun.oninput = '';
        }

        sun.onchange = function () {
            temp();
            draw();
        }
    }
}

function cycle() {
    if (document.getElementById('playPause').innerHTML == 'PAUSE') {
        clearInterval(lifeCycle);
        document.getElementById('playPause').innerHTML = 'PLAY';
    } else {
        lifeCycle = setInterval(step, 30);
        document.getElementById('playPause').innerHTML = 'PAUSE';
    }
}

function step() {
    if (time < 400) {
        document.getElementById("sun").value = -50 + 0.25 * time;
    } else if (time < 500) {
    } else if (time < 900) {
        document.getElementById("sun").value = 50 - 0.25 * (time - 500);
    } else if (time == 1000) {
        time = 0
    }
    time++;
    temp();
    life();
    data();
    draw();
}

function data() {
    let wCount = 0;
    let bCount = 0;
    let tCount = 0;
    for (let x = 0; x < 40; x++) {
        for (let y = 0; y < 24; y++) {
            if (wrld[x][y].flwr == 'w') {
                wCount++;
            } else if (wrld[x][y].flwr == 'b') {
                bCount++;
            }
            tCount += wrld[x][y].temp
        }
    }
    wT.push(wCount);
    bT.push(bCount);
    pT.push(Math.floor(tCount));
    sT.push(document.getElementById("sun").value / 100 * 40 * 24);

    if (wT.length > graph) {
        wT = wT.slice(wT.length - graph, wT.length)
    }
    if (bT.length > graph) {
        bT = bT.slice(bT.length - graph, bT.length)
    }
    if (pT.length > graph) {
        pT = pT.slice(pT.length - graph, pT.length)
    }
    if (sT.length > graph) {
        sT = sT.slice(sT.length - graph, sT.length)
    }
}

function life() {
    for (let x = 0; x < 80; x++) {
        for (let y = 0; y < 48; y++) {
            if (wrld[x][y].flwr !== undefined && wrld[x][y].flwr.includes('t') !== true) {

                let localPop = 0;
                for (let xl = -4; xl < 5; xl++) {
                    for (let yl = -4; yl < 5; yl++) {
                        if (wrld[x + xl] !== undefined) {
                            if (wrld[x + xl][y + yl] !== undefined) {
                                if (wrld[x + xl][y + yl].flwr == wrld[x][y].flwr) {
                                    localPop++;
                                }
                            }
                        }
                    }
                }

                if (Math.random() < 1 - 0.00068 * Math.pow(40 - localPop, 2)) {
                    wrld[x][y].flwr = undefined;



                } else if (Math.random() < 1 - 0.0034 * Math.pow((-wrld[x][y].temp * 100), 2)) {
                    let newX = Math.floor(Math.random() * 3) - 1 + x;
                    let newY = Math.floor(Math.random() * 3) - 1 + y;
                    if (wrld[newX] !== undefined) {
                        if (wrld[newX][newY] !== undefined) {
                            wrld[newX][newY].flwr = wrld[x][y].flwr + 't';
                        }
                    }
                }
            }
        }
    }
    wrld.forEach(element => element.forEach(updateFlwr));
}

function updateFlwr(element) {
    if (element.flwr == 'wt') {
        element.flwr = 'w'
    } else if (element.flwr == 'bt') {
        element.flwr = 'b'
    };
}

function temp() {
    let sun = document.getElementById("sun").value / 100;
    let alb = 0.04;
    wrld.forEach(element => element.forEach(element => element.temp = sun * 0.5));
    for (let x = 0; x < 80; x++) {
        for (let y = 0; y < 48; y++) {
            wrld[x][y].temp += 0.0265 - 0.00013 * Math.pow(24 - y, 2)
            if (wrld[x][y].flwr !== undefined) {
                for (let xl = -5; xl < 6; xl++) {
                    for (let yl = -5; yl < 6; yl++) {
                        if (Math.sqrt(Math.pow(xl, 2) + Math.pow(yl, 2)) < 3.5) {
                            if (wrld[x + xl] !== undefined) {
                                if (wrld[x + xl][y + yl] !== undefined) {
                                    if (wrld[x][y].flwr == 'w') {
                                        //let alb = sun * 0.4 + sun * 0.1 * (Math.sqrt(Math.pow(xl, 2) + Math.pow(yl, 2)) / 3.5);
                                        wrld[x + xl][y + yl].temp -= alb - alb * Math.sqrt(Math.pow(xl, 2) + Math.pow(yl, 2)) / 3.5;
                                    } else {
                                        //let alb = sun * 0.4 + sun * 0.1 * (Math.sqrt(Math.pow(xl, 2) + Math.pow(yl, 2)) / 3.5);
                                        wrld[x + xl][y + yl].temp += alb - alb * Math.sqrt(Math.pow(xl, 2) + Math.pow(yl, 2)) / 3.5;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function draw() {

    if (document.getElementById("sun").value >= 10) {
        let tempIndicator = "";
        for (k = 0; k <= Math.abs(Math.floor(document.getElementById("sun").value) / 10) - 1; k++) {
            if (k !== 4) {
                tempIndicator += "🔥";
            }
        }
        document.getElementById("hotCold").innerHTML = tempIndicator;

    } else if (document.getElementById("sun").value < -10) {
        let tempIndicator = "";
        for (k = 0; k < Math.abs(Math.floor(document.getElementById("sun").value) / 10) - 1; k++) {
            tempIndicator += "❄️";
        }
        document.getElementById("hotCold").innerHTML = tempIndicator;

    } else {
        document.getElementById("hotCold").innerHTML = "🌡️";
    }

    ctx = document.getElementById('daisyworld').getContext('2d');
    ctx.globalAlpha = 1;
    ctx.canvas.width = window.innerWidth * (1000 / 1920);
    ctx.canvas.height = ctx.canvas.width * (600 / 1000);
    let sX = ctx.canvas.width / 80
    let sY = ctx.canvas.height / 48
    let mg = 0.7;
    for (let x = 0; x < 80; x++) {
        for (let y = 0; y < 48; y++) {
            ctx.fillStyle = "#7a7694";
            ctx.fillRect(x * sX, y * sY, sX + mg, sY + mg);

            ctx.fillStyle = "#f44336";
            if (wrld[x][y].temp > 0) {
                ctx.globalAlpha = wrld[x][y].temp;
                ctx.fillRect(x * sX, y * sY, sX + mg, sY + mg);
            }

            ctx.fillStyle = "#03a9f4";
            if (wrld[x][y].temp < 0) {
                ctx.globalAlpha = -wrld[x][y].temp;
                ctx.fillRect(x * sX, y * sY, sX + mg, sY + mg);
            }

            /*if (Math.abs(25 - wrld[x][y].temp * 100) < 10) {
                ctx.fillStyle = "#9af9d0";
                ctx.globalAlpha = 1;
                ctx.fillRect(x * 25, y * 25, 25, 25);
            }*/

            ctx.globalAlpha = 1;
            if (wrld[x][y].flwr == 'w') {
                let flower = wht;
                ctx.drawImage(flower, (x) * sX, (y) * sY, sX, sY);
            }
            if (wrld[x][y].flwr == 'b') {
                let flower = blk;
                ctx.drawImage(flower, (x) * sX, (y) * sY, sX, sY);
            }
            //ctx.fillStyle = "#000";
            //ctx.font = "10px Arial";
            //ctx.fillText(Math.floor(wrld[x][y].temp * 100), x * 25 + 13, y * 25 + 13);
        }
    }

    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4;


    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(0, 600 - Math.floor(wT[0] / graph * ctx.canvas.height + 3));
    for (let k = 0; k <= graph; k++) {
        ctx.lineTo(ctx.canvas.width / graph * k, 600 - Math.floor(wT[k - 1] / graph * ctx.canvas.height + ctx.lineWidth));
    }
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(0, 600 - Math.floor(bT[0] / graph * ctx.canvas.height + 3));
    for (let k = 0; k <= graph; k++) {
        ctx.lineTo(ctx.canvas.width / graph * k, 600 - Math.floor(bT[k - 1] / graph * ctx.canvas.height + ctx.lineWidth));
    }
    ctx.stroke();

    ctx.strokeStyle = "#ffc107";
    ctx.beginPath();
    ctx.moveTo(0, -sT[0] * (ctx.canvas.height / 2 / 480) + ctx.canvas.height / 2);
    for (let k = 0; k <= graph; k++) {
        ctx.lineTo(ctx.canvas.width / graph * k, -sT[k - 1] * (ctx.canvas.height / 2 / 480) + ctx.canvas.height / 2);
    }
    ctx.stroke();

    ctx.strokeStyle = "#ff0000";
    ctx.beginPath();
    ctx.moveTo(0, -pT[0] * (ctx.canvas.height / 2 / 240) + ctx.canvas.height / 2);
    for (let k = 0; k <= graph; k++) {
        ctx.lineTo(ctx.canvas.width / graph * k, -pT[k - 1] * (ctx.canvas.height / 2 / 240) + ctx.canvas.height / 2);
    }
    ctx.stroke();

}