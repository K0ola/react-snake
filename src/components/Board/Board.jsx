import { useEffect, useState, useRef } from "react";
import Snake from "../Snake/Snake";
import s from "./Board.module.scss";
import Item from "../Item/Item";
import {
  clearEffects,
  generateRandomCoordinates,
  defaultControls,
  triggerTrapEffect,
} from "../../utils/utils";
import GameOver from "../GameOver/GameOver";
import Toggle from "../Toggle/Toggle";
import useStore from "../../utils/store";

const TILE_SIZE = 40;
const BOARD_SIZE = 500;

const Board = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [snakeData, setSnakeData] = useState([
    [0, 0],
    [40, 0],
  ]);
  const [trapArray, setTrapArray] = useState([]);
  const [foodArray, setFoodArray] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);

  const speed = useRef(200);
  const direction = useRef("RIGHT");
  const gameInterval = useRef(null);
  const itemInterval = useRef(null);
  const timeInterval = useRef(null);
  const canChangeDirection = useRef(true);
  const { modes } = useStore();
  const modeTimeout = useRef(null);

  // Réinitialise le jeu
  const resetGame = () => {
    clearEffects();
    setSnakeData([
      [0, 0],
      [40, 0],
    ]);
    setTrapArray([]);
    setFoodArray([]);
    setScore(0);
    setGameTime(0);
    speed.current = modes.includes("impossible") ? 50 : 200;
    direction.current = "RIGHT";
    canChangeDirection.current = true;
    clearTimeout(modeTimeout.current);
    stopGame();
  };

  // Gère le spawn des items
  const spawnItem = () => {
    const isTrap = Math.random() < 0.5;
    const setter = isTrap ? setTrapArray : setFoodArray;

    let coordinates;
    do {
      coordinates = generateRandomCoordinates();
    } while (
      [...snakeData, ...foodArray, ...trapArray].some(
        (item) => item.x === coordinates.x && item.y === coordinates.y
      )
    );

    setter((prevItems) => [...prevItems, { ...coordinates }]);
  };

  // Vérifie si le Snake a mangé un item
  const hasEatenItem = ({ getter, setter }) => {
    const head = snakeData[snakeData.length - 1];
    const item = getter.find((item) => item.x === head[0] && item.y === head[1]);

    if (item) {
      setter(getter.filter((_item) => _item !== item));
      return true;
    }
    return false;
  };

  // Gère le déplacement du Snake
  const moveSnake = () => {
    const newSnakeData = [...snakeData];
    let head = newSnakeData[newSnakeData.length - 1];

    switch (direction.current) {
      case "RIGHT":
        head = [head[0] + TILE_SIZE, head[1]];
        break;
      case "LEFT":
        head = [head[0] - TILE_SIZE, head[1]];
        break;
      case "DOWN":
        head = [head[0], head[1] + TILE_SIZE];
        break;
      case "UP":
        head = [head[0], head[1] - TILE_SIZE];
        break;
      default:
        break;
    }

    newSnakeData.push(head);
    newSnakeData.shift();

    if (isOutOfBorder(head) || hasCollapsed(head)) {
      stopGame();
      setGameOver(true);
    } else {
      if (hasEatenItem({ getter: foodArray, setter: setFoodArray })) {
        newSnakeData.unshift([]);
        setScore((prev) => prev + 10);

        if (!modes.includes("impossible")) {
          speed.current = Math.max(speed.current - 10, 50);
        }
      }

      if (hasEatenItem({ getter: trapArray, setter: setTrapArray })) {
        triggerTrapEffect();
        if (modes.includes("impossible")) {
          clearTimeout(modeTimeout.current);
          modeTimeout.current = setTimeout(() => {
            speed.current = 200; // Ralentir après la fin du mode impossible
            clearInterval(gameInterval.current);
            gameInterval.current = setInterval(gameLoop, speed.current);
          }, 5000); // Durée du mode impossible
        }
      }

      setSnakeData(newSnakeData);
    }
  };

  const isOutOfBorder = (head) =>
    head[0] < 0 || head[1] < 0 || head[0] >= BOARD_SIZE || head[1] >= BOARD_SIZE;

  const hasCollapsed = (head) => {
    const body = [...snakeData];
    body.pop();
    return body.some((segment) => segment[0] === head[0] && segment[1] === head[1]);
  };

  const onKeyDown = (e) => {
    if (!canChangeDirection.current) return;

    canChangeDirection.current = false;
    defaultControls(e, direction);
  };

  const gameLoop = () => {
    moveSnake();
    canChangeDirection.current = true;
  };

  const startGame = () => {
    resetGame();
    setIsPlaying(true);
    setGameOver(false);

    gameInterval.current = setInterval(gameLoop, speed.current);
    itemInterval.current = setInterval(() => {
      if (foodArray.length + trapArray.length < 8) {
        spawnItem();
      }
    }, 2000);

    timeInterval.current = setInterval(() => {
      setGameTime((prev) => prev + 1);
    }, 1000);

    window.addEventListener("keydown", onKeyDown);
  };

  const stopGame = () => {
    clearInterval(gameInterval.current);
    clearInterval(itemInterval.current);
    clearInterval(timeInterval.current);
    clearEffects();
    clearTimeout(modeTimeout.current);
    window.removeEventListener("keydown", onKeyDown);
  };

  useEffect(() => {
    if (isPlaying) {
      clearInterval(gameInterval.current);
      gameInterval.current = setInterval(gameLoop, speed.current);
    }
    return () => clearInterval(gameInterval.current);
  }, [snakeData]);

  useEffect(() => {
    return () => stopGame();
  }, []);

  useEffect(() => {
    if (modes.includes("impossible")) {
      speed.current = 50;
    }
  }, [modes]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className={modes.includes("reversed") ? s.reversed : ""}
    >
      {!isPlaying && (
        <div className={s.startScreen}>
          <h1 className={s.title}>Snake Game</h1>
          <button className={s.startButton} onClick={startGame}>
            Play
          </button>
        </div>
      )}
      {isPlaying && (
        <div>
          <div className={s.toggleWrapper}>
            <Toggle mode="impossible" label="Impossible" />
            <Toggle mode="reversed" label="Reversed" />
            <Toggle mode="corner" label="Corner" />
          </div>
          <div id="board" className={s.board}>
            {gameOver && <GameOver replay={startGame} />}
            <Snake data={snakeData} direction={direction.current} />
            {foodArray.map((item, index) => (
              <Item
                key={`food-${index}`}
                coordinates={item}
                type={modes.includes("reversed") ? "trap" : "food"}
              />
            ))}
            {trapArray.map((item, index) => (
              <Item
                key={`trap-${index}`}
                coordinates={item}
                type={modes.includes("reversed") ? "food" : "trap"}
              />
            ))}
          </div>
        </div>
      )}
      {isPlaying && (
        <div className={s.info}>
          <span>Score: {score}</span> | <span>Time: {formatTime(gameTime)}</span>
        </div>
      )}
    </div>
  );
};

export default Board;
