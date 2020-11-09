console.log('The daisyworld simulation has initialized.');

var wrld = [];
var lifeCycle;
var wT = [];
var bT = [];
var pT = [];
var sT = [];
var dT = [];

var eqT = false;
var prT = false;
var evT = false;

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
    audioToggle();
    start();
}


function equator() {
    if (eqT == false) {
        eqT = true;
        document.getElementById("equator").classList.add('green');
    } else {
        eqT = false;
        document.getElementById("equator").classList.remove('green');
    }
    temp();
    draw();
}

function evolve() {
    if (evT == false) {
        evT = true;
        document.getElementById("evolution").classList.add('green');
    } else {
        evT = false;
        document.getElementById("evolution").classList.remove('green');
        wrld.forEach(element => element.forEach(element => element.genetics = 1));
    }
    temp();
    draw();
}

function predator() {
    if (prT == false) {
        prT = true;
        document.getElementById("predator").classList.add('green');
        for (let x = 0; x < 80; x++) {
            for (let y = 0; y < 48; y++) {
                if (Math.random() < 0.003 && wrld[x][y].flwr == undefined) {
                    wrld[x][y].flwr = 'd';
                }
            }
        }
        data();
        for (let k = 0; k < graph; k++) {
            dT.push(dT[0]);
        }
    } else {
        prT = false;
        document.getElementById("predator").classList.remove('green');
        for (let x = 0; x < 80; x++) {
            for (let y = 0; y < 48; y++) {
                if (wrld[x][y].flwr == 'd') {
                    wrld[x][y].flwr = undefined;
                }
            }
        }
        dT = [];
    }
    draw();
}

function start() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.getElementById('all').innerHTML = '<h1>View on a computer please</h1><br/><img src="linus.jpg" alt="ur bad" width="100%">'
    } else {
        document.getElementById('wht').hidden = true;
        document.getElementById('blk').hidden = true;
        document.getElementById('der').hidden = true;
        for (let x = 0; x < 80; x++) {
            wrld[x] = [];
            for (let y = 0; y < 48; y++) {
                wrld[x][y] = { flwr: undefined, temp: undefined, genetics: 1 };
                if (Math.random() < 0.01) {
                    if (Math.random() < 0.5) {
                        wrld[x][y] = { flwr: 'w', temp: undefined, genetics: 1 };
                    } else {
                        wrld[x][y] = { flwr: 'b', temp: undefined, genetics: 1 };
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
            time = 9999;
            sun.oninput = '';
        }

        sun.onchange = function () {
            temp();
            draw();
        }

        //config refresh
        if (eqT == true) {
            equator();
            equator();
        }
        if (prT == true) {
            predator();
            predator();
        }
        if (evT == true) {
            evolve();
            evolve();
        }
    }
}

function cycle() {
    if (document.getElementById('playPause').innerHTML == 'PAUSE') {
        clearInterval(lifeCycle);
        document.getElementById('playPause').innerHTML = 'PLAY';
        document.getElementById("time").pause();
    } else {
        lifeCycle = setInterval(step, 30);
        document.getElementById('playPause').innerHTML = 'PAUSE';
        document.getElementById("time").play();
    }
}

function audioToggle() {
    let a = document.getElementById("time");
    if (a.volume > 0) {
        a.volume = 0;
        //document.getElementById("music").classList.add('green');
    } else {
        a.volume = 1;
        //document.getElementById("music").classList.remove('green');
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
    let dCount = 0;
    let tCount = 0;
    for (let x = 0; x < 80; x++) {
        for (let y = 0; y < 48; y++) {
            if (wrld[x][y].flwr == 'w') {
                wCount++;
            } else if (wrld[x][y].flwr == 'b') {
                bCount++;
            } else if (wrld[x][y].flwr == 'd') {
                dCount++;
            }
            tCount += wrld[x][y].temp
        }
    }
    wT.push(wCount);
    bT.push(bCount);
    if (prT == true) {
        dT.push(dCount);
    }
    pT.push(Math.floor(tCount));
    sT.push(document.getElementById("sun").value);

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
    if (dT.length > graph) {
        dT = dT.slice(dT.length - graph, dT.length)
    }
}

function life() {
    let gPop = { w: wT[graph - 1], b: bT[graph - 1] };
    for (let x = 0; x < 80; x++) {
        for (let y = 0; y < 48; y++) {
            if ((wrld[x][y].flwr == 'b' || wrld[x][y].flwr == 'w') && wrld[x][y].flwr.includes('t') !== true) {

                let localPop = 0;
                for (let xl = -5; xl < 6; xl++) {
                    for (let yl = -5; yl < 6; yl++) {
                        if (wrld[x + xl] !== undefined) {
                            if (wrld[x + xl][y + yl] !== undefined) {
                                if (wrld[x + xl][y + yl].flwr == wrld[x][y].flwr) {
                                    localPop++;
                                }
                            }
                        }
                    }
                }

                /*if (Math.random() < 2.2 * (1 - 0.00015 * Math.pow(81 - localPop, 2)) && gPop[wrld[x][y].flwr] > 15 ) {
                    wrld[x][y].flwr = undefined;
                    wrld[x][y].genetics = 1;
                    gPop[wrld[x][y].flwr]--;

                } else if (localPop > 1) {
                    wrld[x][y].flwr = undefined;
                    wrld[x][y].genetics = 1;
                    gPop[wrld[x][y].flwr]--;
                }*/
                if (Math.random() < 1.5 * (1 - 0.000103 * Math.pow(100 - localPop, 2))) {
                    wrld[x][y].flwr = undefined;
                    wrld[x][y].genetics = 1;
                    gPop[wrld[x][y].flwr]--;

                } else if (Math.random() < 1 - 0.0034 * Math.pow(wrld[x][y].temp * 100, 2)) {
                    let newX = Math.floor(Math.random() * 3) - 1 + x;
                    let newY = Math.floor(Math.random() * 3) - 1 + y;
                    if (wrld[newX] !== undefined) {
                        if (wrld[newX][newY] !== undefined) {
                            if (wrld[newX][newY].flwr == undefined) {
                                wrld[newX][newY].flwr = wrld[x][y].flwr + 't';
                                let variability = 0.1;
                                if (evT == false) {
                                    wrld[newX][newY].genetics = wrld[x][y].genetics;
                                } else if (wrld[x][y].genetics > 0.25 && wrld[x][y].genetics < 1.75) {
                                    wrld[newX][newY].genetics = wrld[x][y].genetics + Math.random() * variability - variability / 2;
                                } else if (wrld[x][y].genetics < 0.25) {
                                    wrld[newX][newY].genetics = wrld[x][y].genetics + variability / 10;
                                } else if (wrld[x][y].genetics > 1.75) {
                                    wrld[newX][newY].genetics = wrld[x][y].genetics - variability / 10;
                                } else {
                                    wrld[newX][newY].genetics = wrld[x][y].genetics;
                                }
                            }
                        }
                    }
                }
            } else if (wrld[x][y].flwr == 'd') {
                let localPop = 0;
                for (let xl = -12; xl < 13; xl++) {
                    for (let yl = -12; yl < 13; yl++) {
                        if (wrld[x + xl] !== undefined) {
                            if (wrld[x + xl][y + yl] !== undefined) {
                                if (wrld[x + xl][y + yl].flwr == wrld[x][y].flwr) {
                                    localPop++;
                                }
                            }
                        }
                    }
                }
                if (localPop > 1) {
                    if (Math.random() > 0.9 - 0.0002 * Math.pow((-wrld[x][y].temp * 100), 2)) {
                        wrld[x][y].flwr = undefined;
                    }
                }

                for (let attempts = 0; attempts < 2; attempts++) {
                    let newX = Math.floor(Math.random() * 5) - 2 + x;
                    let newY = Math.floor(Math.random() * 5) - 2 + y;
                    if (wrld[newX] !== undefined) {
                        if (wrld[newX][newY] !== undefined) {
                            if (wrld[newX][newY].flwr == 'b' || wrld[newX][newY].flwr == 'w') {
                                if (gPop[wrld[newX][newY].flwr] > 3) {
                                    wrld[newX][newY].flwr = wrld[x][y].flwr + 't';
                                }
                            }
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
    } else if (element.flwr == 'dt') {
        element.flwr = 'd'
    }
}

function temp() {
    let sun = document.getElementById("sun").value / 100;
    let alb = 0.04;
    wrld.forEach(element => element.forEach(element => element.temp = sun * 0.5));
    for (let x = 0; x < 80; x++) {
        for (let y = 0; y < 48; y++) {
            if (eqT == true) {
                wrld[x][y].temp += 0.0265 - 0.00013 * Math.pow(24 - y, 2);
            }
            if (wrld[x][y].flwr !== undefined) {
                let flowerTemp = alb * wrld[x][y].genetics;
                for (let xl = -5; xl < 6; xl++) {
                    for (let yl = -5; yl < 6; yl++) {
                        if (Math.sqrt(Math.pow(xl, 2) + Math.pow(yl, 2)) < 3.5) {
                            if (wrld[x + xl] !== undefined) {
                                if (wrld[x + xl][y + yl] !== undefined) {
                                    if (wrld[x][y].flwr == 'w') {
                                        //let alb = sun * 0.4 + sun * 0.1 * (Math.sqrt(Math.pow(xl, 2) + Math.pow(yl, 2)) / 3.5);
                                        wrld[x + xl][y + yl].temp -= flowerTemp - flowerTemp * Math.sqrt(Math.pow(xl, 2) + Math.pow(yl, 2)) / 3.5;
                                    } else if (wrld[x][y].flwr == 'b') {
                                        //let alb = sun * 0.4 + sun * 0.1 * (Math.sqrt(Math.pow(xl, 2) + Math.pow(yl, 2)) / 3.5);
                                        wrld[x + xl][y + yl].temp += flowerTemp - flowerTemp * Math.sqrt(Math.pow(xl, 2) + Math.pow(yl, 2)) / 3.5;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    /*let totalTemp = 0;
    wrld.forEach(element => element.forEach(element => totalTemp += element.temp));
    wrld.forEach(element => element.forEach(element => element.temp = totalTemp/(80*48)));*/
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
            let geneticSize = (wrld[x][y].genetics - 1) * 10 + 3;

            if (wrld[x][y].flwr == 'w') {
                let flower = wht;
                ctx.drawImage(flower, (x) * sX - geneticSize, (y) * sY - geneticSize, sX + geneticSize, sY + geneticSize);
            }
            if (wrld[x][y].flwr == 'b') {
                let flower = blk;
                ctx.drawImage(flower, (x) * sX - geneticSize, (y) * sY - geneticSize, sX + geneticSize, sY + geneticSize);
            }
            if (wrld[x][y].flwr == 'd') {
                let flower = der;
                ctx.drawImage(flower, (x) * sX, (y) * sY, sX, sY);
            }
            //ctx.fillStyle = "#000";
            //ctx.font = "10px Arial";
            //ctx.fillText(Math.floor(wrld[x][y].temp * 100), x * 25 + 13, y * 25 + 13);
        }
    }

    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4;



    ctx.strokeStyle = "#ffc107";
    ctx.beginPath();
    ctx.moveTo(0, -sT[0] * (ctx.canvas.height / 50 / 2) + ctx.canvas.height / 2);
    for (let k = 0; k <= graph; k++) {
        ctx.lineTo(ctx.canvas.width / graph * k, -sT[k - 1] * (ctx.canvas.height / 50 / 2) + ctx.canvas.height / 2);
    }
    ctx.stroke();

    ctx.strokeStyle = "#ff0000";
    ctx.beginPath();
    ctx.moveTo(0, -pT[0] * (ctx.canvas.height / (80 * 48) * 2) + ctx.canvas.height / 2);
    for (let k = 0; k <= graph; k++) {
        ctx.lineTo(ctx.canvas.width / graph * k, -pT[k - 1] * (ctx.canvas.height / (80 * 48) * 2) + ctx.canvas.height / 2);
    }
    ctx.stroke();

    let maxPop = 400;

    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(0, ctx.canvas.height - Math.floor(wT[0] / maxPop / 4 * ctx.canvas.height));
    for (let k = 0; k <= graph; k++) {
        ctx.lineTo(ctx.canvas.width / graph * k, ctx.canvas.height - Math.floor(wT[k - 1] / maxPop / 4 * ctx.canvas.height));
    }
    ctx.stroke();

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(0, ctx.canvas.height - Math.floor(bT[0] / maxPop / 4 * ctx.canvas.height));
    for (let k = 0; k <= graph; k++) {
        ctx.lineTo(ctx.canvas.width / graph * k, ctx.canvas.height - Math.floor(bT[k - 1] / maxPop / 4 * ctx.canvas.height));
    }
    ctx.stroke();

    if (prT == true) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "#795548";
        ctx.beginPath();
        ctx.moveTo(0, ctx.canvas.height - Math.floor(dT[0] / maxPop / 4 * ctx.canvas.height));
        for (let k = 0; k <= graph; k++) {
            ctx.lineTo(ctx.canvas.width / graph * k, ctx.canvas.height - Math.floor(dT[k - 1] / maxPop / 4 * ctx.canvas.height));
        }
        ctx.stroke();
    }

}