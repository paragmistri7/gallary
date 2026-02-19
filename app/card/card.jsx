"use client";
import "./cardStyle.css";
import Image from "next/image";
import { addItem, removeItem, clearItem, addCartItem } from "../redux/slice";
import { useDispatch, useSelector } from "react-redux";
const Card = ({data}) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);

  console.log(data)
  return (
    <div className="card">
      <div className="card-image">
        <Image
          src={data?.thumbnail}
          alt={data?.title}
          width={300}
          height={200}
          style={{ objectFit: "cover", width: "100%", height: "auto" }}
        />
        <span className="badge">{data?.category}</span>
      </div>

      <div className="card-content">
        <h3 className="card-title">{data?.title} </h3>
        <p className="weight">{ data?.weight} kg Pack</p>
        <p className="price">{data?.price} </p>
        <div className="quantity">
          <button onClick={() => dispatch(removeItem())}>− </button>
          <span id="qty">{selector?.cart?.value}</span>
          <button onClick={() => dispatch(addItem())}>+</button>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="add-btn" onClick={() => dispatch(addCartItem())}>
            Add to Cart
          </button>
          <button
            className="rm-btn"
            onClick={() => dispatch(clearItem())}
          >
            Remove item
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
