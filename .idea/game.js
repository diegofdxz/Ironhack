const container = document.getElementById('container');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tamañoContenedor = 420;
const tamañoCuadrícula = tamañoContenedor / 20;

canvas.width = tamañoContenedor;
canvas.height = tamañoContenedor;

const velocidadSerpiente = 100;

let serpiente = [{ x: 10, y: 10 }];
let comida = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let gameLoop;
let puntuación = 0;

function dibujarSerpiente() {
    ctx.fillStyle = 'green';
    serpiente.forEach(segmento => {
        ctx.fillRect(segmento.x * tamañoCuadrícula, segmento.y * tamañoCuadrícula, tamañoCuadrícula, tamañoCuadrícula);
    });
}

function dibujarComida() {
    ctx.fillStyle = 'red';
    ctx.fillRect(comida.x * tamañoCuadrícula, comida.y * tamañoCuadrícula, tamañoCuadrícula, tamañoCuadrícula);
}

function moverSerpiente() {
    const cabeza = { x: serpiente[0].x + dx, y: serpiente[0].y + dy };
    serpiente.unshift(cabeza);
    if (cabeza.x === comida.x && cabeza.y === comida.y) {
        generarComida();
        puntuación++;
        document.getElementById('currentScore').textContent = puntuación;
    } else {
        serpiente.pop();
    }
}

function generarComida() {
    comida.x = Math.floor(Math.random() * (tamañoContenedor / tamañoCuadrícula));
    comida.y = Math.floor(Math.random() * (tamañoContenedor / tamañoCuadrícula));
}

function verificarColisión() {
    const cabeza = serpiente[0];
    // Comprueba si la cabeza de la serpiente está fuera del área de juego
    if (cabeza.x < 0 || cabeza.x >= tamañoContenedor / tamañoCuadrícula || cabeza.y < 0 || cabeza.y >= tamañoContenedor / tamañoCuadrícula) {
        return true;
    }
    // Comprueba si la cabeza de la serpiente colisiona con su propio cuerpo
    return serpiente.slice(1).some(segmento => segmento.x === cabeza.x && segmento.y === cabeza.y);
}

function juegoTerminado() {
    clearInterval(gameLoop);
    document.getElementById('finalScore').textContent = puntuación;
    document.getElementById('gameOverModal').style.display = 'block';
}

function iniciarJuego() {
    puntuación = 0;
    document.getElementById('currentScore').textContent = puntuación;
    gameLoop = setInterval(actualizar, velocidadSerpiente);
}

function detenerJuego() {
    clearInterval(gameLoop);
}

function reiniciarJuego() {
    clearInterval(gameLoop);
    serpiente = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    generarComida();
    actualizar();
    document.getElementById('gameOverModal').style.display = 'none';
}

function enviarPuntuación() {
    const nombreJugador = document.getElementById('playerName').value;
    alert(`Puntuación enviada!\nJugador: ${nombreJugador}\nPuntuación: ${puntuación}`);
    reiniciarJuego();
}

document.getElementById('startButton').addEventListener('click', iniciarJuego);
document.getElementById('stopButton').addEventListener('click', detenerJuego);
document.getElementById('resetButton').addEventListener('click', reiniciarJuego);
document.getElementById('submitScore').addEventListener('click', enviarPuntuación);

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (dy !== 1) {
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            break;
    }
});

function actualizar() {
    ctx.clearRect(0, 0, tamañoContenedor, tamañoContenedor);
    dibujarSerpiente();
    dibujarComida();
    moverSerpiente();
    if (verificarColisión()) {
        juegoTerminado();
    }
}
