import s from "./Snake.module.scss";

const Snake = ({ data, direction }) => {
  const getStyle = (dot, i) => {
    const isHead = i === data.length - 1;
    const isTail = i === 0;
    const isBody = !isHead && !isTail;

    const rotation =
      direction === "UP"
        ? "rotate(0deg)"
        : direction === "RIGHT"
        ? "rotate(90deg)"
        : direction === "DOWN"
        ? "rotate(180deg)"
        : "rotate(270deg)";

    const baseSize = 40;
    const overlap = 1;

    let style = {
      transform: `translate(${dot[0]}px, ${dot[1]}px)`,
      width: `${baseSize + overlap}px`,
      height: `${baseSize + overlap}px`,
      position: "absolute",
    };

    if (isHead) {
      style = {
        ...style,
        backgroundColor: "black",
        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        transform: `translate(${dot[0]}px, ${dot[1]}px) ${rotation}`,
        zIndex: 3,
      };
    } else if (isBody) {
      style = {
        ...style,
        backgroundColor: "black",
        width: `${baseSize}px`,
        height: `${baseSize}px`,
        zIndex: 2,
      };
    } else if (isTail) {
      style = {
        ...style,
        backgroundColor: "black",
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        zIndex: 1,
        transform: `translate(${dot[0]}px, ${dot[1]}px) ${rotation} translateY(25%)`,
      };
    }

    return style;
  };

  return (
    <>
      {data.map((dot, i) => (
        <div key={i} className={s.snakeDot} style={getStyle(dot, i)}></div>
      ))}
    </>
  );
};

export default Snake;
