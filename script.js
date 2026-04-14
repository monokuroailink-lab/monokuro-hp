// Konami code: ↑↑↓↓←→←→BA
const konamiCode = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a"
];
let konamiIndex = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      activateUraMode();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

// Logo tap detection (for the invisible logo-trigger overlay)
const logoTrigger = document.querySelector(".logo-trigger");
if (logoTrigger) {
  let tapCount = 0;
  let tapTimer;

  logoTrigger.addEventListener("click", () => {
    tapCount++;
    clearTimeout(tapTimer);

    if (tapCount === 3) {
      activateUraMode();
      tapCount = 0;
    } else {
      tapTimer = setTimeout(() => {
        tapCount = 0;
      }, 500);
    }
  });
}

// Mode Switch Function with Glitch Effect
function activateUraMode() {
  const glitch = document.querySelector(".glitch-overlay");
  const isUra = document.body.classList.contains("mode-ura");

  // Visual feedback: Glitch blink
  glitch.style.display = "block";
  
  setTimeout(() => {
    if (isUra) {
      document.body.classList.remove("mode-ura");
      document.body.classList.add("mode-omote");
    } else {
      document.body.classList.remove("mode-omote");
      document.body.classList.add("mode-ura");
    }
    
    // Quick noise blink
    setTimeout(() => {
      glitch.style.display = "none";
    }, 150);
  }, 100);
}

// Initial state
document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("mode-ura")) {
    document.body.classList.add("mode-omote");
  }
});
