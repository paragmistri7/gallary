"use client";
import "./cardStyle.css";
import Image from "next/image";
import { addCartItem , removeCartItem } from "../redux/slice";
import { useDispatch, useSelector } from "react-redux";
const Card = ({ data }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state);
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
        <div className="brand">
          {data?.brand}
        </div>
        <p className="weight">{data?.weight} kg Pack {`(${data?.availabilityStatus})`} </p>
        <p className="price">{data?.price} ₹ </p>
        <div style={{ display: "flex", gap: 10 }}>
          {selector?.cart?.items?.find((val) => val?.id === data?.id) ? (
            <button className="rm-btn" onClick={() => dispatch(removeCartItem(data))}>
              Remove item
            </button>
          ) : (
            <button
              className="add-btn"
              onClick={() => dispatch(addCartItem(data))}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
