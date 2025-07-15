const canvas = document.getElementById("juego");
const ctx = canvas.getContext("2d");

// IMÁGENES
const fondo = new Image();
fondo.src = "fondo.png";

const personajeImg = new Image();
personajeImg.src = "personaje.png";

const escalonImg = new Image();
escalonImg.src = "escalon.png";

const obstaculoImg = new Image();
obstaculoImg.src = "obstaculo.png";

const estrellaImg = new Image();
estrellaImg.src = "estrella.png";

// PERSONAJE
let jugador = { x: 50, y: 400, width: 70, height: 100, speed: 5, puedeMover: true };

// ESCALONES Y MENSAJES
const escalones = [
    { x: 150, y: 330, ancho: 150, alto: 50, texto: "First step: Never give up 💪" },
    { x: 330, y: 250, ancho: 150, alto: 50, texto: "Every day counts. Keep climbing 🔝" },
    { x: 510, y: 170, ancho: 150, alto: 50, texto: "Discipline beats talent 🧠" },
    { x: 690, y: 90, ancho: 150, alto: 50, texto: "Goal achieved: Vision 2026 🌟" }
];

let nivelActual = -1;
let checkpoint = { x: jugador.x, y: jugador.y };

let obstaculos = [
    { x: 250, y: 0, width: 50, height: 50, speed: 1.5 },
    { x: 500, y: -150, width: 50, height: 50, speed: 2 }
];

let mensaje = "";

// DIBUJAR ESCENA
function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(personajeImg, jugador.x, jugador.y, jugador.width, jugador.height);

    escalones.forEach(e => {
        ctx.drawImage(escalonImg, e.x, e.y, e.ancho, e.alto);
    });

    obstaculos.forEach(o => {
        ctx.drawImage(obstaculoImg, o.x, o.y, o.width, o.height);
    });

    if (nivelActual === escalones.length - 1) {
        ctx.drawImage(estrellaImg, 720, 50, 60, 60);
    }

    if (mensaje !== "") {
        ctx.font = "16px 'Poppins', sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.85)"; // Recuadro blanco semi-transparente

        let textoMedido = ctx.measureText(mensaje).width;
        let boxWidth = textoMedido + 40;
        ctx.fillRect((canvas.width - boxWidth) / 2, 20, boxWidth, 40);

        ctx.fillStyle = "#0077FF"; // Azul eléctrico moderno
        ctx.textAlign = "center";
        ctx.fillText(mensaje, canvas.width / 2, 45);
    }
}

// CONTROLES
document.addEventListener("keydown", function(e) {
    if (e.key === "ArrowRight" && jugador.puedeMover) {
        jugador.x += jugador.speed;
    }
    if (e.key === "ArrowLeft" && jugador.puedeMover) {
        jugador.x -= jugador.speed;
    }
    if (e.key === "ArrowUp" && !jugador.puedeMover) {
        avanzarNivel();
    }
});

// VERIFICAR ESCALÓN
function verificarEscalon() {
    for (let i = 0; i < escalones.length; i++) {
        const esc = escalones[i];
        if (
            jugador.x + jugador.width >= esc.x &&
            jugador.x <= esc.x + esc.ancho &&
            i === nivelActual + 1
        ) {
            jugador.puedeMover = false;
            mensaje = "Press ↑ to jump to the next level ⬆️";
            return;
        }
    }
}

function avanzarNivel() {
    nivelActual++;
    if (nivelActual < escalones.length) {
        let esc = escalones[nivelActual];
        checkpoint.x = esc.x + (esc.ancho / 2) - (jugador.width / 2);
        checkpoint.y = esc.y - jugador.height + 10;
        jugador.x = checkpoint.x;
        jugador.y = checkpoint.y;
        mensaje = escalones[nivelActual].texto;
        jugador.puedeMover = true;
    }
}

// ACTUALIZAR
function actualizar() {
    if (jugador.puedeMover) {
        verificarEscalon();
    }

    obstaculos.forEach(o => {
        o.y += o.speed;
        if (o.y > canvas.height) o.y = -50;

        if (colision(jugador, o)) {
            if (nivelActual > -1) {
                mensaje = "A challenge hit you. Going back one level ⚠️";
                nivelActual = Math.max(nivelActual - 1, -1);
                if (nivelActual >= 0) {
                    let esc = escalones[nivelActual];
                    checkpoint.x = esc.x + (esc.ancho / 2) - (jugador.width / 2);
                    checkpoint.y = esc.y - jugador.height + 10;
                } else {
                    checkpoint.x = 50;
                    checkpoint.y = 400;
                }
                jugador.x = checkpoint.x;
                jugador.y = checkpoint.y;
                jugador.puedeMover = true;
            } else {
                jugador.x = 50;
                jugador.y = 400;
                mensaje = "Try again! 🚧";
            }
        }
    });

    dibujar();
    requestAnimationFrame(actualizar);
}

// COLISIÓN
function colision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

fondo.onload = () => actualizar();






