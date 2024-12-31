import s from "./Item.module.scss";

const Item = ({ coordinates, type }) => {
  const style = {
    transform: `translate(${coordinates.x}px, ${coordinates.y}px)`,
    width: "40px",
    height: "40px",
  };

  return <div className={`${s.item} ${s[`item_${type}`]}`} style={style}></div>;
};

export default Item;
