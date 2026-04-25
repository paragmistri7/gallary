"use client";
import Image from "next/image";
import "./allCartitem.css";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeCartItem, clearCartItem } from "../redux/slice";
import { useNavigate } from "react-router-dom";

const AllCartItems = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state?.cart);
  const navigate = useNavigate();

  const handleQuantityChange = (value, id) => {
    const updated = selector?.items
      ?.map((item) =>
        item?.id === id ? { ...item, quantity: value } : item
      )
      .map((val) =>
        val?.price && val?.quantity
          ? { ...val, updatedPrice: val.price * val.quantity }
          : val
      );
    dispatch(addItem(updated));
  };

  return (
    <div style={{ margin: "10px" }}>
      <div className="cart-header">
        <h2>Cart Items</h2>
        <h3>{selector?.items?.length || 0} items in cart</h3>
      </div>

      {selector?.items?.length > 0 ? (
        selector.items.map((item, index) => (
          <div key={index} className="main-div">
            <Image
              src={item?.thumbnail}
              alt={item?.title}
              width={80}
              height={80}
              style={{ objectFit: "cover" }}
            />
            <div>
              <h3 className="priceAll">{item?.title}</h3>
              <p className="category">{item?.brand}</p>
            </div>
            <div className="input-main">
              <input
                type="number"
                min="1"
                value={item?.quantity || 1}
                className="input-val"
                onKeyDown={(e) => {
                  if (["e", "-", "0"].includes(e.key)) e.preventDefault();
                }}
                onChange={(e) => {
                  const value = Math.max(1, Number(e.target.value));
                  handleQuantityChange(value, item?.id);
                }}
              />
              <div
                style={{
                  justifyItems: "end",
                  marginLeft: "auto",
                  verticalAlign: "middle",
                  paddingRight: "10px",
                }}
              >
                <h3 className="priceAll">
                  {(item?.updatedPrice ?? item?.price)?.toFixed(2)} ₹
                </h3>
                <button
                  className="rm-btn"
                  onClick={() => dispatch(removeCartItem(item))}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-items">No items in cart</div>
      )}

      <div className="cart-footer">
        <button
          className="place-btn"
          onClick={() => {
            alert("Order Placed");
            dispatch(clearCartItem());
            navigate("/");
          }}
        >
          Place Order
        </button>
        <h3>
          Total:{" "}
          {selector?.items?.length
            ? selector.items
                .reduce(
                  (acc, item) => acc + (item?.updatedPrice || item?.price),
                  0
                )
                .toFixed(2)
            : 0}{" "}
          ₹
        </h3>
      </div>
    </div>
  );
};

export default AllCartItems;