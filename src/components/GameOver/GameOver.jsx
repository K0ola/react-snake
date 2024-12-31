import { useEffect, useState } from "react";
import s from "./GameOver.module.scss";

const GameOver = ({ replay }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // Lecture de la vidéo de mort au chargement du composant
    const video = document.getElementById("die-video");
    if (video) {
      video.style.display = "block";
      video.currentTime = 0;
      video.play();
    }

    // Affiche l'overlay après 5 secondes (ou à la fin de la vidéo si plus courte)
    const timeout = setTimeout(() => {
      setShowOverlay(true);
      if (video) {
        video.style.display = "none"; // Masque la vidéo après le délai
        video.pause();
      }
    }, 7000); // Temps avant d'afficher l'overlay

    return () => {
      clearTimeout(timeout); // Nettoie le timeout au démontage
      if (video) {
        video.style.display = "none";
        video.pause();
      }
    };
  }, []);

  return (
    <div className={s.gameOver}>
      {showOverlay && (
        <div className={s.overlay}>
          <h1 className={s.title}>YOU DIED</h1>
          <button className={s.replayButton} onClick={replay}>
            Replay
          </button>
        </div>
      )}
      <video
        id="death-video"
        className={s.deathVideo}
        src="/media/dark-souls-death.mp4"
        muted
      />
    </div>
  );
};

export default GameOver;
