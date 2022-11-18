import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageWrapper from "../../Components/page-wrapper";
import UserContext from "../../Context";
import styles from "./index.module.css";
import { handleMinus, handlePlus } from "../../utils/size";
import Size from "../../Components/Other/size";
const ProductPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [valueL, setValueL] = useState(0);
  const [valueM, setValueM] = useState(0);
  const [valueS, setValueS] = useState(0);
  const [valueError, setValueError] = useState(false);
  const params = useParams();
  const context = useContext(UserContext);
  const { user } = context;

  const getData = async () => {
    const id = params.id;
    const promise = await fetch(`/item/${id}`);
    if (promise.status === 200) {
      const response = await promise.json();
      setName(response.name);
      setDescription(response.description);
      setImageUrl(response.imageUrl);
      setPrice(response.price.toFixed(2));
    }
  };
  const handleSubmit = async () => {
    if (valueL === 0 && valueM === 0 && valueS === 0) {
      setValueError(true);
    }
    const id = params.id;
    if (
      valueL <= 9 &&
      valueM <= 9 &&
      valueS <= 9 &&
      (valueL > 0 || valueM > 0 || valueS > 0)
    ) {
      if (!user.cart) {
        console.log("1");
        const promise = await fetch("/addToCart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product: id,
            quantity: {
              L: valueL,
              M: valueM,
              S: valueS,
            },
          }),
        });
        const response = await promise.json();
        if (promise.status === 200) {
          const newPromise = await fetch("/user/createCart", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: user._id,
              cartId: response,
            }),
          });
          const newResponse = await newPromise.json();
          console.log(newResponse);
        }
      } else {
        const cart = user.cart;
        const promise2 = await fetch("/updateCart", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: cart,
            product: id,
            quantity: {
              L: valueL,
              M: valueM,
              S: valueS,
            },
          }),
        });
        const response2 = await promise2.json();
        console.log(response2);
      }
    }
  };
  const setMinusL = () => {
    setValueL(handleMinus(valueL));
  };
  const setPlusL = () => {
    setValueL(handlePlus(valueL));
  };
  const setMinusM = () => {
    setValueM(handleMinus(valueM));
  };
  const setPlusM = () => {
    setValueM(handlePlus(valueM));
  };
  const setMinusS = () => {
    setValueS(handleMinus(valueS));
  };
  const setPlusS = () => {
    setValueS(handlePlus(valueS));
  };
  useEffect(() => {
    getData();
  }, []);
  const total = valueL + valueM + valueS;
  return (
    <PageWrapper>
      <div className={styles.container}>
        <div className={styles.left}>
          <img src={imageUrl} className={styles.picture} alt=""></img>
        </div>
        <div className={styles.right}>
          <div className={styles.descriptionPrice}>
            <h1>{name}</h1>
            <div>
              <p className={styles.price}>
                <b>{price} BGN</b>
              </p>
              <p>{description}</p>
            </div>
            <p>
              <b>Size</b>
            </p>
            <div className={styles.size}>
              <Size
                value={valueL}
                onClickMinus={setMinusL}
                onClickPlus={setPlusL}
                onChange={(e) => {
                  const match = /^[0-9]*$/;
                  if (e.target.value.match(match)) {
                    setValueL(Number(e.target.value));
                  }
                }}
                price={price}
                size={"L"}
              />
              <Size
                value={valueM}
                onClickMinus={setMinusM}
                onClickPlus={setPlusM}
                onChange={(e) => {
                  const match = /^[0-9]*$/;
                  if (e.target.value.match(match)) {
                    setValueM(Number(e.target.value));
                  }
                }}
                price={price}
                size="M"
              />
              <Size
                value={valueS}
                onClickMinus={setMinusS}
                onClickPlus={setPlusS}
                onChange={(e) => {
                  const match = /^[0-9]*$/;
                  if (e.target.value.match(match)) {
                    setValueS(Number(e.target.value));
                  }
                }}
                price={price}
                size="S"
              />
            </div>
          </div>
          <button
            className={styles.addToCart}
            type="button"
            onClick={handleSubmit}
          >
            Add to cart
            {total !== 0 ? ` - ${(total * price).toFixed(2)} BGN` : ""}
          </button>
          {valueError ? (
            <div className={styles.valueError}>Please select a size</div>
          ) : (
            ""
          )}
        </div>
      </div>
    </PageWrapper>
  );
};
export default ProductPage;
