import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import picOne from "../../../images/header/113bc499ddc6df6ec03b7a272b3a16aa725fb922_bby.jpg";
import picTwo from "../../../images/header/block1_50.jpg";
import picThree from "../../../images/header/10.24.22_Hero_Desktop.jpg";

import styles from "./index.module.css";

const Header = () => {
  const images = [picOne, picTwo, picThree];
  const [pictures, setPictures] = useState(images);
  const [currentImg, setCurrentImg] = useState(0);
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate("/");
  };
  useEffect(() => {
    const interval = setInterval(changeImage, 10000);
    return () => clearInterval(interval);
  }, [currentImg]);
  const changeImage = () => {
    let newCurrentImg = 0;
    const length = pictures.length;
    if (currentImg !== length - 1) {
      newCurrentImg = currentImg + 1;
    }

    setCurrentImg(newCurrentImg);
  };
  return (
    <div onClick={handleSubmit}>
      <header>
        <div className={styles.container}>
          <img className={styles.picture} src={pictures[currentImg]} alt="" />
          <ul className={styles.listButtons}>
            <li className={styles.listBottom}>
              <button className={styles.button}></button>
            </li>
            <li className={styles.listBottom}>
              <button className={styles.button}></button>
            </li>
            <li className={styles.listBottom}>
              <button className={styles.button}></button>
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
