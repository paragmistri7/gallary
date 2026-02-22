import Image from "next/image";
import "./allCartitem.css";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeCartItem , clearCartItem } from "../redux/slice";
import { useNavigate } from "react-router-dom";

const AllCartItems = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state?.cart);
  let navigate = useNavigate();

  const handleQuantityChange = (value, id) => {
    let update = selector?.items
      ?.map((item) => {
        if (item?.id === id) {
          return {
            ...item,
            quantity: value,
          };
        }
        return item;
      })
      .map((val) => {
        if (val?.price && val?.quantity) {
          return {
            ...val,
            updatedPrice: val?.price * val?.quantity,
          };
        }
        return val;
      });
    dispatch(addItem(update));
  };

  return (
    <div style={{ margin: "10px" }}>
      <div className="cart-header">
        <h2>Cart Items</h2>
        <h3>{selector?.items?.length || 0} items in cart</h3>
      </div>
      {selector?.items?.length > 0 ? (
        selector?.items?.map((item, index) => (
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
              <p className="category">{item?.brand} </p>
            </div>
            <div className="input-main">
              <input
                type="number"
                defaultValue={1}
                min="1"
                value={item?.quantity}
                className="input-val"
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "0" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  let value = Number(e.target.value);
                  if (value < 1) value = 1;
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
                <button className="rm-btn" onClick={() => dispatch(removeCartItem(item))}>Remove</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-items">No items in cart</div>
      )}
      <div className="cart-footer">
        <button className="place-btn" onClick={() => {
          alert("Order Placed")
          dispatch(clearCartItem())
          navigate("/") 
        }} >Place Order</button> 
        <h3>
          Total :{" "}
          {selector?.items?.length
            ? selector?.items
                ?.reduce(
                  (acc, item) => acc + (item?.updatedPrice || item?.price),
                  0,
                )
                ?.toFixed(2) || 0
            : 0}{" "}
          ₹
        </h3>
      </div>
    </div>
  );
};

export default AllCartItems;
