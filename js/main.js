const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;
var pontos = 0;

//movimento e tiro da nave
function flyShip(event) {
    if(event.key === 'ArrowUp' || event.key === 'w') {
        event.preventDefault();
        moveUp();
    } else if (event.key === 'ArrowDown' || event.key === 's') {
        event.preventDefault();
        moveDown();
    } else if (event.key === " ") {
        event.preventDefault();
        fireLaser();
    }
}

//função de subir
function moveUp() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top'); //devolve seu código css, mostra a posição da nave
    if (topPosition === "0px") {
        return;
    } else {
        let position = parseInt(topPosition);
        position = position - 30; //distância dos saltos
        yourShip.style.top = `${position}px`;
    }
}

//função descer
function moveDown() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if (topPosition === "511px") {
        return;
    } else {
        let position = parseInt(topPosition);
        position = position + 30; //distância dos saltos
        yourShip.style.top = `${position}px`;
    }
}

//função do tiro
function fireLaser() {

    //criar elemento
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left')); //fazendo com que o laser saia da nave
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top')); //fazendo com que o laser saia da nave
    let newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser');

    //indicando a posição que vai sair
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;

    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left); //posição do laser, assim que ele foi lançado
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => { //comparação se cada alien foi atingido, se sim, troca o source da imagem
            if (checkLaserColisao(laser, alien)) {
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien')
                alien.classList.add('dead-alien');
                pontos = pontos+100;
            }
        })
        
        if (xPosition === 340) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 8}px`; // ele sempre vai atirar 8 pixels à frente
        }
    }, 10) //tempo que vai demorar para surgir um novo elemento/laser
}

//função para sortear qual monstro vai aparecer
function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; //sortear o número no array e arredondar para ver qual vai aparecer
    newAlien.src = alienSprite;
    newAlien.classList.add('alien'); //conseguir edita-lo no css
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`; //conta, se não colocar px, de pixels, não funciona
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

//função para movimentar o alien vindo para nossa direção
function moveAlien(alien) {
    let moveAlienIntercal = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));

        if (xPosition <= 30) {
            if (Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
            } else {
                gameOver();
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30);

}

//função para colisão
function checkLaserColisao(laser, alien) {
    document.getElementById("pontos").innerHTML = "Pontuação: " + pontos;

    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20; //comparação da área

    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30; //comparação da área

    if (laserLeft != 340 && laserLeft + 40 >= alienLeft) {
        if (laserTop <= alienTop && laserTop >= alienBottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}    


startButton.addEventListener('click', (event) => {
    playGame();
});

//função para inicio do jogo
function playGame() {
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000) //a cada 2 segundos cria um alien novo
};

//função de game over
function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert('game over!!! Pontos totais: ' + pontos);
        pontos = 0;
        yourShip.style.top = "250px";
        startButton.style.display = "block";
        instructionsText.style.display = "block";
    });
}