
document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => document.querySelector(selector);

  const opening = $("#opening");
  const enterButton = $("#enterButton");

  const music = $("#music");
  const musicButton = $("#musicButton");
  const musicIcon = $("#musicIcon");
  const musicLabel = $("#musicLabel");
  const musicMessage = $("#musicMessage");

  const progressBar = $("#progressBar");
  const ambientHearts = $("#ambientHearts");

  const surpriseButton = $("#surpriseButton");
  const surpriseContent = $("#surpriseContent");
  const closeSurprise = $("#closeSurprise");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let openingClosed = false;

  // Abertura inicial
  function closeOpening() {
    if (!opening || openingClosed) return;

    openingClosed = true;
    opening.classList.add("dismissed");

    window.setTimeout(() => {
      opening.hidden = true;
    }, 1050);
  }

  if (enterButton) {
    enterButton.addEventListener("click", async () => {
      closeOpening();

      if (music && music.paused) {
        try {
          await music.play();
          updateMusicButton(true);

          if (musicMessage) {
            musicMessage.textContent = "";
          }
        } catch (error) {
          if (musicMessage) {
            musicMessage.textContent =
              "Amor, aperta o botão da música no cantinho para tentar ouvir. ❤️";
          }
        }
      }
    });
  }

  // Se ela não clicar, o site também abre sozinho.
  window.setTimeout(closeOpening, 9000);

  // Música
  function updateMusicButton(isPlaying) {
    if (!musicButton) return;

    musicButton.classList.toggle("playing", isPlaying);
    musicButton.setAttribute(
      "aria-label",
      isPlaying ? "Pausar música" : "Tocar música"
    );

    if (musicLabel) {
      musicLabel.textContent = isPlaying
        ? "pausar música"
        : "nossa música";
    }

    if (musicIcon) {
      musicIcon.textContent = isPlaying ? "♫" : "♪";
    }
  }

  if (music && musicButton) {
    music.volume = 0.6;

    musicButton.addEventListener("click", async () => {
      if (music.paused) {
        try {
          await music.play();

          updateMusicButton(true);

          if (musicMessage) {
            musicMessage.textContent = "";
          }
        } catch (error) {
          if (musicMessage) {
            musicMessage.textContent =
              "Confere se o MP3 está na mesma pasta e se o nome está igual ao do HTML.";
          }
        }
      } else {
        music.pause();
        updateMusicButton(false);
      }
    });

    music.addEventListener("play", () => updateMusicButton(true));
    music.addEventListener("pause", () => updateMusicButton(false));

    music.addEventListener("error", () => {
      if (musicMessage) {
        musicMessage.textContent =
          "Não consegui encontrar a música. Confere o nome do arquivo e a pasta.";
      }
    });
  }

  // Contador do relacionamento: 15 de julho de 2026, à meia-noite.
  const relationshipStart = new Date(2026, 6, 15, 0, 0, 0);

  const daysElement = $("#days");
  const hoursElement = $("#hours");
  const minutesElement = $("#minutes");
  const secondsElement = $("#seconds");

  function updateCounter() {
    const now = new Date();

    if (now < relationshipStart) {
      if (daysElement) daysElement.textContent = "0";
      if (hoursElement) hoursElement.textContent = "00";
      if (minutesElement) minutesElement.textContent = "00";
      if (secondsElement) secondsElement.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(
      (now.getTime() - relationshipStart.getTime()) / 1000
    );

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (daysElement) {
      daysElement.textContent = days.toLocaleString("pt-BR");
    }

    if (hoursElement) {
      hoursElement.textContent = String(hours).padStart(2, "0");
    }

    if (minutesElement) {
      minutesElement.textContent = String(minutes).padStart(2, "0");
    }

    if (secondsElement) {
      secondsElement.textContent = String(seconds).padStart(2, "0");
    }
  }

  updateCounter();
  window.setInterval(updateCounter, 1000);

  // Barra de progresso conforme ela percorre o site.
  function updateProgress() {
    if (!progressBar) return;

    const pageHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage =
      pageHeight > 0 ? (window.scrollY / pageHeight) * 100 : 0;

    progressBar.style.width =
      `${Math.min(100, Math.max(0, percentage))}%`;
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  // Revela as seções conforme a rolagem.
  const revealElements = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("in-view");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  // Corações flutuando discretamente.
  function createAmbientHeart() {
    if (!ambientHearts || reducedMotion || document.hidden) return;

    const heart = document.createElement("span");

    heart.className = "ambient-heart";
    heart.textContent = Math.random() > 0.5 ? "♥" : "♡";
    heart.style.left = `${Math.random() * 96 + 2}%`;
    heart.style.fontSize = `${11 + Math.random() * 13}px`;
    heart.style.animationDuration = `${7 + Math.random() * 4}s`;

    ambientHearts.appendChild(heart);

    window.setTimeout(() => heart.remove(), 12000);
  }

  if (!reducedMotion) {
    window.setInterval(createAmbientHeart, 1700);
  }

  // Pequenos corações ao clicar em áreas livres.
  function createHeartBurst(x, y, amount = 8) {
    if (reducedMotion) return;

    for (let i = 0; i < amount; i++) {
      const heart = document.createElement("span");

      heart.className = "burst-heart";
      heart.textContent = Math.random() > 0.5 ? "♥" : "♡";
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      heart.style.fontSize = `${12 + Math.random() * 13}px`;

      const angle = Math.random() * Math.PI * 2;
      const distance = 35 + Math.random() * 80;

      heart.style.setProperty(
        "--x",
        `${Math.cos(angle) * distance}px`
      );

      heart.style.setProperty(
        "--y",
        `${Math.sin(angle) * distance}px`
      );

      heart.style.setProperty(
        "--r",
        `${Math.random() * 100 - 50}deg`
      );

      document.body.appendChild(heart);

      window.setTimeout(() => heart.remove(), 1200);
    }
  }

  document.addEventListener("click", (event) => {
    if (
      event.target.closest(
        "button, a, input, textarea, select, video"
      )
    ) {
      return;
    }

    createHeartBurst(event.clientX, event.clientY, 4);
  });

  // Esconde imagens extras opcionais caso não existam.
  document.querySelectorAll(".gallery-item img").forEach((img) => {
    img.addEventListener("error", () => {
      const filename = img.getAttribute("src") || "";

      if (
        ["foto4.jpeg", "foto5.jpeg", "foto6.jpeg"].includes(filename)
      ) {
        const figure = img.closest(".gallery-item");
        if (figure) figure.hidden = true;
      }
    });
  });

  // Abre a surpresa final.
  if (surpriseButton && surpriseContent) {
    surpriseButton.addEventListener("click", () => {
      surpriseContent.hidden = false;
      surpriseButton.hidden = true;
      surpriseButton.setAttribute("aria-expanded", "true");

      createHeartBurst(
        window.innerWidth / 2,
        window.innerHeight / 2,
        20
      );

      window.setTimeout(() => {
        surpriseContent.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }, 100);
    });
  }

  // Fecha a surpresa e volta ao botão.
  if (closeSurprise && surpriseContent && surpriseButton) {
    closeSurprise.addEventListener("click", () => {
      surpriseContent.hidden = true;
      surpriseButton.hidden = false;
      surpriseButton.setAttribute("aria-expanded", "false");

      surpriseButton.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "center"
      });
    });
  }
});