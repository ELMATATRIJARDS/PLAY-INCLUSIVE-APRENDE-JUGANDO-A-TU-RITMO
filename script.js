// ===============================
// LOGIN CON CÓDIGO
// ===============================

const CODIGO_CORRECTO = "1234";

function verificarCodigo(){

    const codigo = document.getElementById("codigo").value;
    const mensaje = document.getElementById("mensaje-error");

    if(codigo === CODIGO_CORRECTO){

        document.getElementById("login").style.display = "none";
        document.getElementById("contenido").style.display = "block";

        // Mostrar Onomatopeyas al entrar
        mostrar("animales");

    }else{

        mensaje.textContent = "❌ Código incorrecto. Intente de nuevo.";

    }
}

// ---- FUNCIÓN PARA CAMBIAR DE SECCIÓN ----
function mostrar(seccion) {
    // Oculta todas las secciones excepto el área de comentarios
    document.querySelectorAll('.seccion').forEach(s => {
        if (!s.id.includes("comentarios")) {
            s.classList.add('oculto');
        }
    });

    // Muestra la sección seleccionada
    const objetivo = document.getElementById(seccion);
    objetivo.classList.remove('oculto');

    // Inicializar memorama si es esa sección
    if (seccion === 'figuras3x3') {
        initMemorama();
    }

    // Inicializar sílabas animales si es esa sección
    if (seccion === 'silabas-animales') {
    initSilabasAnimales();
    }

    if(seccion === 'adivinanzas'){
    initAdivinanzas();
    }

    // Desplaza suavemente
    objetivo.scrollIntoView({ behavior: "smooth" });
}

// ---- FUNCIÓN PARA REPRODUCIR SONIDOS ----
function playSound(id) {
    const audio = document.getElementById(id);

    if (!audio) {
        console.log("Audio no encontrado:", id);
        return;
    }

    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(err => console.log("Error:", err));
}

// ===============================
//  SISTEMA DE COMENTARIOS
// ===============================
document.addEventListener("DOMContentLoaded", function() {
    mostrarComentarios();

    // Botón de envío
    const btn = document.querySelector(".comentario-formulario button");
    btn.addEventListener("click", guardarComentario);
});

function guardarComentario() {
    const textoEl = document.getElementById("coment-text");
    const estrellasEl = document.getElementById("coment-stars");

    const texto = textoEl.value.trim();
    const estrellas = parseInt(estrellasEl.value);

    if (texto === "") {
        alert("Escribe un comentario.");
        return;
    }

    const nuevo = { texto, estrellas };

    // Guardar en localStorage
    let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
    comentarios.push(nuevo);
    localStorage.setItem("comentarios", JSON.stringify(comentarios));

    // Limpiar formulario
    textoEl.value = "";
    estrellasEl.value = "0";

    // Actualizar lista
    mostrarComentarios();
}

function mostrarComentarios() {
    const cont = document.getElementById("lista-comentarios");
    cont.innerHTML = "";

    const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];

    if (comentarios.length === 0) {
        cont.innerHTML = "<p>No hay comentarios aún.</p>";
        return;
    }

    comentarios.forEach(c => {
        const div = document.createElement("div");
        div.className = "comentario-item";
        div.innerHTML = `<p>${c.texto}</p><strong>${"⭐".repeat(c.estrellas)}</strong>`;
        cont.appendChild(div);
    });
}

// ===============================
// MEMORAMA 2x3 - FIGURAS GRANDES
// ===============================
function initMemorama() {
    const contenedor = document.getElementById('memorama');
    if (!contenedor) return;

    // 3 parejas (6 cartas)
    const figuras = ['estrella', 'estrella', 'corazon', 'corazon', 'triangulo', 'triangulo'];

    // Mezclar cartas
    for (let i = figuras.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [figuras[i], figuras[j]] = [figuras[j], figuras[i]];
    }

    // Limpiar contenedor y crear cartas
    contenedor.innerHTML = '';
    figuras.forEach(figura => {
        const carta = document.createElement('div');
        carta.className = 'memoria';
        carta.dataset.figura = figura;
        carta.textContent = '❓';
        contenedor.appendChild(carta);
    });

    let primeraCarta = null;
    let segundaCarta = null;
    let parejasEncontradas = 0;
    let bloqueo = false; // evitar tocar más cartas

    contenedor.querySelectorAll('.memoria').forEach(carta => {
        carta.addEventListener('click', () => {

            if (bloqueo) return; // bloqueado
            if (carta.classList.contains('lista')) return; // ya encontrada
            if (carta === primeraCarta) return; // mismo click
            if (carta.textContent !== '❓') return; // ya volteada

            // Voltear
            carta.textContent = getFiguraEmoji(carta.dataset.figura);
            carta.classList.add('descubierta');

            if (!primeraCarta) {
                primeraCarta = carta;
                return;
            }

            segundaCarta = carta;
            bloqueo = true;

            if (primeraCarta.dataset.figura === segundaCarta.dataset.figura) {
                // ==========================
                // ✔ PAREJA CORRECTA
                // ==========================
                parejasEncontradas++;

                // Color bonito para ambas cartas
                const colores = {
                    estrella: "#ffe066",   // amarillo suave
                    corazon: "#ff6b6b",    // rosado
                    triangulo: "#6bc7ff"   // celeste
                };
                const colorPareja = colores[primeraCarta.dataset.figura];

                primeraCarta.style.backgroundColor = colorPareja;
                segundaCarta.style.backgroundColor = colorPareja;

                primeraCarta.classList.add('lista');
                segundaCarta.classList.add('lista');

                // confeti
                lanzarConfetiPareja(primeraCarta, segundaCarta);

                // limpiar selección
                primeraCarta = null;
                segundaCarta = null;
                bloqueo = false;

                // ==========================
                // ✔ Todas las parejas encontradas
                // ==========================
                if (parejasEncontradas === 3) {
                    setTimeout(() => {
                        alert("🎉 ¡FELICIDADES! Completaste el memorama 🎉");
                        initMemorama();
                    }, 700);
                }

            } else {
                // ❌ No coinciden
                setTimeout(() => {
                    primeraCarta.textContent = '❓';
                    segundaCarta.textContent = '❓';
                    primeraCarta.classList.remove('descubierta');
                    segundaCarta.classList.remove('descubierta');

                    primeraCarta = null;
                    segundaCarta = null;
                    bloqueo = false;
                }, 900);
            }
        });
    });
}

function getFiguraEmoji(figura) {
    switch(figura) {
        case 'estrella': return '⭐';
        case 'corazon': return '❤️';
        case 'triangulo': return '🔺';
        default: return '❓';
    }
}

// 🎉 CONFETI SOBRE LAS DOS CARTAS DE LA PAREJA
function lanzarConfetiPareja(c1, c2) {
    const rect1 = c1.getBoundingClientRect();
    const rect2 = c2.getBoundingClientRect();
    const centerX = (rect1.left + rect2.right) / 2;
    const centerY = (rect1.top + rect2.bottom) / 2;

    for (let i = 0; i < 20; i++) {
        const c = document.createElement("div");
        c.textContent = "🎉";
        c.style.position = "absolute";
        c.style.left = centerX + (Math.random() * 60 - 30) + "px";
        c.style.top = centerY + "px";
        c.style.fontSize = "30px";
        c.style.pointerEvents = "none";
        c.style.zIndex = "9999";
        document.body.appendChild(c);

        let y = centerY;
        const fall = setInterval(() => {
            y += 4;
            c.style.top = y + "px";
            if (y > window.innerHeight) {
                clearInterval(fall);
                c.remove();
            }
        }, 15);
    }
}


// ===============================
// SILABAS ANIMALES - 5 PAREJAS
// ===============================
function initSilabasAnimales() {
    const container = document.getElementById('silabas-container');
    if (!container) return;

    const leftContainer = document.getElementById('col-izq');
    const rightContainer = document.getElementById('col-der');
    const canvas = document.getElementById("lineas");
    const ctx = canvas.getContext("2d");

    let startEl = null;
    let lineas = [];
    let coloresDisponibles = [];

    // 🔀 NUEVO: Función para mezclar los elementos
    function mezclarColumnas() {
        mezclar(Array.from(leftContainer.children), leftContainer);
        mezclar(Array.from(rightContainer.children), rightContainer);
    }

    function generarColoresUnicos(n) {
        const colores = [];
        while(colores.length < n){
            const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
            if(!colores.includes(color)) colores.push(color);
        }
        return colores;
    }

    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        canvas.style.position = "absolute";
        canvas.style.left = "0";
        canvas.style.top = "0";
        dibujarLineas();
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function dibujarLineas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const contRect = container.getBoundingClientRect();

        lineas.forEach(l => {
            const rect1 = l.izq.getBoundingClientRect();
            const rect2 = l.der.getBoundingClientRect();

            const x1 = rect1.right - contRect.left;
            const y1 = rect1.top + rect1.height / 2 - contRect.top;

            const x2 = rect2.left - contRect.left;
            const y2 = rect2.top + rect2.height / 2 - contRect.top;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = l.color;
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.stroke();
        });
    }

    function lanzarConfeti(x, y) {
        for (let i = 0; i < 20; i++) {
            const c = document.createElement('div');
            c.className = 'confeti';
            c.style.left = x + Math.random() * 30 + 'px';
            c.style.top = y + Math.random() * 30 + 'px';
            c.style.backgroundColor = `hsl(${Math.random() * 360},100%,50%)`;
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 1000);
        }
    }

    function reiniciarJuego() {
        lineas = [];
        coloresDisponibles = generarColoresUnicos(5);
        dibujarLineas();

        const leftElems = Array.from(leftContainer.children);
        const rightElems = Array.from(rightContainer.children);
        [...leftElems, ...rightElems].forEach(el => el.style.background = '#ffebcd');

        mezclar(leftElems, leftContainer);
        mezclar(rightElems, rightContainer);
    }

    function mezclar(arr, container) {
        const items = [...arr];
        container.innerHTML = '';
        while(items.length) {
            const i = Math.floor(Math.random() * items.length);
            container.appendChild(items.splice(i,1)[0]);
        }
    }

    [...leftContainer.children, ...rightContainer.children].forEach(el => {
        el.addEventListener('mousedown', ()=> startEl = el);
        el.addEventListener('mouseup', handleDrop);

        el.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startEl = el;
        });

        el.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const targetEl = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.silaba');
            handleDrop({ target: targetEl });
        });
    });

    function handleDrop(ev) {
        if(!startEl || !ev.target) return;

        const targetEl = ev.target.closest('.silaba');
        if(!targetEl || startEl === targetEl) return;

        const izq = startEl.parentElement.id==='col-izq'? startEl : targetEl;
        const der = startEl.parentElement.id==='col-der'? startEl : targetEl;
        if(!izq || !der) return;

        if(lineas.some(l => (l.izq===izq && l.der===der) || (l.izq===der && l.der===izq))) return;

        const colorLinea = coloresDisponibles.shift(); 
        lineas.push({izq, der, color: colorLinea});
        dibujarLineas();

        if(izq.dataset.match === der.dataset.match){

    izq.style.background = '#a2fba2';
    der.style.background = '#a2fba2';

    const rect = izq.getBoundingClientRect();
    lanzarConfeti(rect.left + rect.width/2, rect.top + rect.height/2);

    // 🔊 Reproducir audio del animal
    const animal = izq.dataset.animal;

    const audio = document.getElementById(
        "audio-" + animal
    );

    if(audio){
        audio.currentTime = 0;
        audio.play();
    }
        } else {
            izq.style.background = '#ffb3b3';
            der.style.background = '#ffb3b3';
            setTimeout(()=>{
                izq.style.background = '#ffebcd';
                der.style.background = '#ffebcd';
                lineas.pop();
                coloresDisponibles.unshift(colorLinea);
                dibujarLineas();
            },800);
        }

        startEl = null;

        const correctas = lineas.filter(l => l.izq.dataset.match === l.der.dataset.match).length;
        if(correctas === 5){
            setTimeout(()=>{
                alert('🎉 ¡Felicidades! Completaste todas las parejas. 🎉');
                reiniciarJuego();
            }, 300);
        }
    }

    // Inicializamos colores disponibles
    coloresDisponibles = generarColoresUnicos(5);

    // 🔀 MEZCLA AUTOMÁTICA APENAS INICIA EL JUEGO
    mezclarColumnas();
}


// ===============================
// ADIVINANZAS
// ===============================
function initAdivinanzas() {

    const tarjetas = document.querySelectorAll('.tarjeta-adivinanza');

    tarjetas.forEach(tarjeta => {

        tarjeta.addEventListener('click', () => {

            if (tarjeta.classList.contains('revelada')) return;

            tarjeta.classList.add('revelada');

            const img = tarjeta.querySelector('.tarjeta-img');
            const nuevaImg = tarjeta.dataset.img;

            img.style.transform = 'rotateY(90deg)';

            setTimeout(() => {

                img.src = nuevaImg;
                img.style.transform = 'rotateY(0deg)';

                let nombre = nuevaImg.split('/').pop().split('.')[0];
                nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);

                const p = tarjeta.querySelector('p');
                p.textContent = nombre;
                p.style.color = "#000";
                p.style.fontSize = "1.8rem";

                p.style.transform = 'scale(1.3)';

                setTimeout(() => {
                    p.style.transform = 'scale(1)';
                }, 400);

                // 🔊 Audio de la respuesta
                const audioRespuesta =
                    document.getElementById("audio-" + nombre.toLowerCase());

                if (audioRespuesta) {
                    audioRespuesta.currentTime = 0;
                    audioRespuesta.play();
                }

                // 🎉 Confeti
                lanzarConfeti(tarjeta);

            }, 250);

        });

    });

}

function lanzarConfeti(tarjeta) {
    const rect = tarjeta.getBoundingClientRect();
    for (let i = 0; i < 20; i++) {
        const c = document.createElement('div');
        c.className = 'confeti';
        c.textContent = '🎉';
        c.style.left = rect.left + rect.width / 2 + (Math.random() - 0.5) * 80 + 'px';
        c.style.top = rect.top + rect.height / 2 + 'px';
        c.style.color = `hsl(${Math.random() * 360},100%,50%)`;
        c.style.fontSize = `${20 + Math.random() * 15}px`;
        document.body.appendChild(c);

        let top = parseFloat(c.style.top);
        const interval = setInterval(() => {
            top -= Math.random() * 5 + 2;
            c.style.top = top + 'px';
            c.style.transform = `rotate(${Math.random()*360}deg)`;
            if (top < rect.top - 50) {
                clearInterval(interval);
                c.remove();
            }
        }, 20);
    }
}

document.getElementById("codigo")
.addEventListener("keypress", function(e){

    if(e.key === "Enter"){
        verificarCodigo();
    }

});

function verificarColores() {

    const selects = document.querySelectorAll(
        "#seguimiento-indicaciones select"
    );

    let correctas = 0;

    selects.forEach(select => {

        if (select.value === select.dataset.correcto) {
            correctas++;
        }

    });

    document.getElementById("resultado-colores").innerHTML =
        "Obtuviste " + correctas + " de " + selects.length + " respuestas correctas.";
}

function verificarColor(boton, estado){

    const tarjeta = boton.closest(".tarjeta-indicacion");

    // Evita responder dos veces la misma tarjeta
    if(tarjeta.dataset.resuelta === "true"){
        return;
    }

    if(estado === "correcto"){

        boton.style.border = "4px solid green";

        // 🔊 Audio de felicitación
        playSound("audio-muy-bien");

        // ⭐ Estrella animada
const estrella = document.createElement("div");
estrella.className = "estrella-animada";
estrella.innerHTML = "🌟 ¡Muy bien! 🌟";

tarjeta.appendChild(estrella);

// eliminar después de la animación
setTimeout(() => {
    estrella.remove();
}, 2500);

        // Bloquear opciones
        tarjeta.querySelectorAll(".color").forEach(btn => {
            btn.disabled = true;
        });

        tarjeta.dataset.resuelta = "true";

    }else{

        boton.style.border = "4px solid red";

        // 🔊 Audio de error
        playSound("audio-vuelve-intentar");

        setTimeout(() => {
            boton.style.border = "";
        }, 1000);
    }
}

let respuestasCorrectas = 0;
let totalPreguntas = 3;
let yaMostroBoton = false;

function verificarRespuesta(boton, tipo) {

    const pregunta = boton.parentElement;

    // evita repetir si ya respondió correctamente
    if (pregunta.dataset.resuelto === "true") return;

    // crear o buscar mensaje
    let mensaje = pregunta.querySelector(".mensaje-respuesta");

    if (!mensaje) {
        mensaje = document.createElement("p");
        mensaje.className = "mensaje-respuesta";
        pregunta.appendChild(mensaje);
    }

    if (tipo === "correcto") {

        boton.style.background = "green";
        mensaje.textContent = "✅ ¡Correcto!";
        mensaje.style.color = "green";

        // bloquear SOLO esta pregunta
        const opciones = pregunta.querySelectorAll("button");
        opciones.forEach(b => b.disabled = true);

        pregunta.dataset.resuelto = "true";

        respuestasCorrectas++;

    } else {

        boton.style.background = "red";
        mensaje.textContent = "❌ Intenta otra vez";
        mensaje.style.color = "red";
    }

    // mostrar botón final solo si todas están correctas
    if (respuestasCorrectas === totalPreguntas && !yaMostroBoton) {
        document.getElementById("btn-segundo-cuento").style.display = "block";
        yaMostroBoton = true;
    }
}
let cuentoActual = 1;

function mostrarCuento(num){

    document.querySelectorAll(".cuento").forEach(c => {
        c.classList.add("oculto");
    });

    const siguiente = document.getElementById("cuento-" + num);
    if(siguiente){
        siguiente.classList.remove("oculto");
        cuentoActual = num;
    }
}

function mostrarSegundoCuento() {

    // ocultar cuento 1
    document.getElementById("comprension-lectora").classList.add("oculto");

    // mostrar cuento 2
    const vaca = document.getElementById("cuento-vaca");
    vaca.classList.remove("oculto");

    // llevarlo a la vista
    vaca.scrollIntoView({ behavior: "smooth" });
}

// ===============================
// SISTEMA DE CUENTOS (LIBRO)
// ===============================


function responderCuentoFinal() {

    const btn = document.getElementById("btn-segundo-cuento");

    if (btn) {
        btn.style.display = "none";
    }

    // pasar al siguiente cuento
    cuentoActual++;

    const siguiente = document.getElementById("cuento-" + cuentoActual);

    if (siguiente) {
        mostrarCuento(cuentoActual);
    } else {
        alert("📖 Terminaste todos los cuentos 🎉");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarCuento(1);
});