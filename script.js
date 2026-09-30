/* =========================================================
   MI UNIVERSO — JAVASCRIPT
   Para Carla ♡
========================================================= */

const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");

const intro = document.getElementById("intro");
const enterBtn = document.getElementById("enterBtn");

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const musicText = document.getElementById("musicText");

const restartBtn = document.getElementById("restartBtn");

let stars = [];
let shootingStars = [];

let width = window.innerWidth;
let height = window.innerHeight;

let animationFrame;


/* =========================================================
   CANVAS RESPONSIVE
========================================================= */

function resizeCanvas() {

  width = window.innerWidth;
  height = window.innerHeight;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  createStars();
}

window.addEventListener("resize", resizeCanvas);


/* =========================================================
   ESTRELLAS
========================================================= */

function createStars() {

  stars = [];

  const amount = Math.min(
    500,
    Math.floor((width * height) / 3500)
  );

  for (let i = 0; i < amount; i++) {

    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,

      radius:
        Math.random() < 0.85
          ? Math.random() * 1.25
          : Math.random() * 2,

      alpha: Math.random() * 0.8 + 0.2,

      speed:
        Math.random() * 0.015 + 0.004,

      phase:
        Math.random() * Math.PI * 2,

      color:
        Math.random() > 0.9
          ? "255,217,138"
          : "255,255,255"
    });
  }
}


/* =========================================================
   ESTRELLAS FUGACES
========================================================= */

function createShootingStar() {

  const fromLeft = Math.random() > 0.5;

  shootingStars.push({
    x: fromLeft
      ? -100
      : Math.random() * width,

    y:
      Math.random() * height * 0.55,

    length:
      Math.random() * 100 + 80,

    speed:
      Math.random() * 7 + 5,

    life: 0,

    maxLife:
      Math.random() * 45 + 35,

    angle:
      fromLeft
        ? Math.random() * 0.35 + 0.25
        : Math.random() * 0.35 + 2.8
  });
}


setInterval(() => {

  if (Math.random() > 0.45) {
    createShootingStar();
  }

}, 3500);


/* =========================================================
   DIBUJAR ESTRELLAS
========================================================= */

function drawStars() {

  for (const star of stars) {

    star.phase += star.speed;

    const twinkle =
      0.45 +
      Math.sin(star.phase) * 0.35;

    ctx.beginPath();

    ctx.arc(
      star.x,
      star.y,
      star.radius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      `rgba(${star.color},${Math.max(.1, twinkle * star.alpha)})`;

    ctx.fill();
  }
}


/* =========================================================
   DIBUJAR ESTRELLAS FUGACES
========================================================= */

function drawShootingStars() {

  for (let i = shootingStars.length - 1; i >= 0; i--) {

    const star = shootingStars[i];

    star.life++;

    star.x +=
      Math.cos(star.angle) * star.speed;

    star.y +=
      Math.sin(star.angle) * star.speed;

    const progress =
      star.life / star.maxLife;

    const opacity =
      progress < 0.2
        ? progress / 0.2
        : 1 - ((progress - 0.2) / 0.8);

    const tailX =
      star.x -
      Math.cos(star.angle) * star.length;

    const tailY =
      star.y -
      Math.sin(star.angle) * star.length;


    const gradient =
      ctx.createLinearGradient(
        tailX,
        tailY,
        star.x,
        star.y
      );

    gradient.addColorStop(
      0,
      "rgba(255,255,255,0)"
    );

    gradient.addColorStop(
      0.7,
      `rgba(255,255,255,${opacity * 0.35})`
    );

    gradient.addColorStop(
      1,
      `rgba(255,230,170,${opacity})`
    );


    ctx.beginPath();

    ctx.moveTo(
      tailX,
      tailY
    );

    ctx.lineTo(
      star.x,
      star.y
    );

    ctx.strokeStyle = gradient;

    ctx.lineWidth = 1.5;

    ctx.stroke();


    if (
      star.life >= star.maxLife ||
      star.x < -200 ||
      star.x > width + 200 ||
      star.y > height + 200
    ) {

      shootingStars.splice(i, 1);
    }
  }
}


/* =========================================================
   ANIMACIÓN PRINCIPAL DEL CIELO
========================================================= */

function animateSpace() {

  ctx.clearRect(
    0,
    0,
    width,
    height
  );

  drawStars();
  drawShootingStars();

  animationFrame =
    requestAnimationFrame(animateSpace);
}


/* =========================================================
   INICIAR CANVAS
========================================================= */

resizeCanvas();
animateSpace();


/* =========================================================
   ENTRAR AL UNIVERSO
========================================================= */

enterBtn.addEventListener("click", async () => {

  intro.classList.add("hidden");

  document.body.style.overflow = "auto";

  /*
    El navegador permite reproducir la música
    porque el usuario acaba de pulsar el botón.
  */

  try {

    await music.play();

    musicText.textContent =
      "Música: Encendida";

  } catch (error) {

    musicText.textContent =
      "Música: Apagada";

    console.log(
      "El navegador bloqueó la reproducción automática."
    );
  }

});


/* =========================================================
   BOTÓN DE MÚSICA
========================================================= */

musicBtn.addEventListener("click", async () => {

  if (music.paused) {

    try {

      await music.play();

      musicText.textContent =
        "Música: Encendida";

    } catch (error) {

      console.log(
        "No se pudo reproducir la música."
      );
    }

  } else {

    music.pause();

    musicText.textContent =
      "Música: Apagada";
  }

});


/* =========================================================
   BOTONES DE SCROLL
========================================================= */

const scrollButtons =
  document.querySelectorAll("[data-scroll]");


scrollButtons.forEach(button => {

  button.addEventListener("click", () => {

    const target =
      document.querySelector(
        button.dataset.scroll
      );

    if (target) {

      target.scrollIntoView({
        behavior: "smooth"
      });

    }

  });

});


/* =========================================================
   ANIMACIONES AL HACER SCROLL
========================================================= */

const revealElements =
  document.querySelectorAll(".reveal");


const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("show");

        }

      });

    },
    {
      threshold: 0.15
    }
  );


revealElements.forEach(element => {

  observer.observe(element);

});


/* =========================================================
   EFECTO PARALLAX SUAVE
========================================================= */

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;


window.addEventListener("mousemove", event => {

  mouseX =
    (event.clientX / width - 0.5) * 2;

  mouseY =
    (event.clientY / height - 0.5) * 2;

});


function parallax() {

  targetX +=
    (mouseX - targetX) * 0.025;

  targetY +=
    (mouseY - targetY) * 0.025;


  const orbital =
    document.querySelector(
      ".orbital-system"
    );


  if (orbital) {

    orbital.style.transform =
      `translate(-50%, -50%)
       translate(${targetX * 10}px, ${targetY * 10}px)`;
  }


  requestAnimationFrame(parallax);
}

parallax();


/* =========================================================
   PAUSAR MÚSICA CUANDO SE SALE DE LA PÁGINA
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (document.hidden) {

      music.pause();

      musicText.textContent =
        "Música: Apagada";

    }

  }
);


/* =========================================================
   BOTÓN VOLVER AL PRINCIPIO
========================================================= */

if (restartBtn) {

  restartBtn.addEventListener(
    "click",
    () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );

}


/* =========================================================
   EFECTO EXTRA: CORAZONES AL HACER CLICK
========================================================= */

document.addEventListener(
  "click",
  event => {

    /*
      No crear corazones cuando se pulsa
      un botón para evitar interferencias.
    */

    if (
      event.target.closest("button") ||
      event.target.closest("a")
    ) {
      return;
    }


    const heart =
      document.createElement("span");

    heart.textContent =
      Math.random() > 0.5
        ? "♡"
        : "✦";

    heart.style.position =
      "fixed";

    heart.style.left =
      event.clientX + "px";

    heart.style.top =
      event.clientY + "px";

    heart.style.pointerEvents =
      "none";

    heart.style.zIndex =
      "80";

    heart.style.color =
      Math.random() > 0.5
        ? "#ff9fb9"
        : "#ffd98a";

    heart.style.fontSize =
      (Math.random() * 12 + 16) + "px";

    heart.style.textShadow =
      "0 0 20px currentColor";

    heart.style.transform =
      "translate(-50%, -50%)";

    heart.style.transition =
      "all 1.2s ease-out";


    document.body.appendChild(heart);


    requestAnimationFrame(() => {

      heart.style.transform =
        "translate(-50%, -130px) scale(1.5)";

      heart.style.opacity =
        "0";

    });


    setTimeout(() => {

      heart.remove();

    }, 1200);

  }
);


/* =========================================================
   MENSAJE DE CONSOLA
========================================================= */

console.log(
  "%c♡ Para Carla ♡",
  "font-size:24px;color:#ff9fb9;"
);

console.log(
  "%cUn pequeño universo hecho con cariño.",
  "font-size:14px;color:#ffd98a;"
);
