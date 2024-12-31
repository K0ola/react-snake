import React from "react";
import useStore from "../../utils/store";
import s from "./Toggle.module.scss";

const Toggle = ({ mode, label }) => {
  const { modes, addMode, removeMode } = useStore();

  const isActive = modes.includes(mode);

  const handleToggle = () => {
    if (isActive) {
      removeMode(mode);
    } else {
      addMode(mode);
    }
  };

  return (
    <div className={`${s.toggle} ${isActive ? s.active : ""}`} onClick={handleToggle}>
      {label}
    </div>
  );
};

export default Toggle;
