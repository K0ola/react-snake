import gsap from "gsap";
import useStore from "./store";

let flashTween = null;

const TILE_SIZE = 40;
const BOARD_SIZE = 500;

export const clearEffects = () => {
  if (flashTween) flashTween.kill();
  const flashbang = document.querySelector(".flashbang");
  if (flashbang) flashbang.style.opacity = "0";

  const video = document.getElementById("nether-video");
  if (video) video.style.display = "none";

  const modes = ["impossible", "corner", "reversed"];
  modes.forEach((mode) => useStore.getState().removeMode(mode));
};

export const flashUser = () => {
  const flashbangAudio = new Audio("/audio/csgo-flashbang.mp3");
  flashbangAudio.currentTime = 0;
  flashbangAudio.play();

  const flashbang = document.querySelector(".flashbang");
  if (flashbang) {
    flashbang.style.opacity = "1";
    flashTween = gsap.to(flashbang, {
      opacity: 0,
      duration: 2,
      delay: 0.25,
    });
  }
};

export const wizz = () => {
  gsap.to("#board", {
    duration: 0.05,
    x: "+=20",
    yoyo: true,
    repeat: 5,
  });
};

export const netherPortal = () => {
  const video = document.getElementById("nether-video");
  if (video) {
    video.style.display = "block";
    setTimeout(() => {
      video.style.display = "none";
    }, 3000);
  }
};

export const triggerMode = () => {
  const modes = ["impossible", "corner", "reversed"];
  const selectedMode = modes[Math.floor(Math.random() * modes.length)];
  useStore.getState().addMode(selectedMode);

  setTimeout(() => {
    useStore.getState().removeMode(selectedMode);
  }, 5000);
};

export const generateRandomCoordinates = (mode = "normal") => {
  const gridSize = BOARD_SIZE / TILE_SIZE;

  let x, y;

  if (mode === "corner") {
    // Générer des coordonnées uniquement dans les coins alignés avec la grille
    const positions = [0, (gridSize - 1) * TILE_SIZE]; // Les coins de la grille
    x = positions[Math.floor(Math.random() * positions.length)];
    y = positions[Math.floor(Math.random() * positions.length)];
  } else {
    // Générer des coordonnées alignées avec la grille pour le mode normal
    x = Math.floor(Math.random() * gridSize) * TILE_SIZE;
    y = Math.floor(Math.random() * gridSize) * TILE_SIZE;
  }

  return { x, y };
};





// Gestion des contrôles par défaut
export const defaultControls = (e, direction) => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.current !== "DOWN") direction.current = "UP";
      break;
    case "ArrowDown":
      if (direction.current !== "UP") direction.current = "DOWN";
      break;
    case "ArrowLeft":
      if (direction.current !== "RIGHT") direction.current = "LEFT";
      break;
    case "ArrowRight":
      if (direction.current !== "LEFT") direction.current = "RIGHT";
      break;
    default:
      break;
  }
};

// Déclenche un effet aléatoire sur un trap
export const triggerTrapEffect = () => {
  const effects = [flashUser, wizz, netherPortal, triggerMode];
  const randomEffect = effects[Math.floor(Math.random() * effects.length)];
  randomEffect();
};
