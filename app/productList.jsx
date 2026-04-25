"use client";
import { Fragment, useEffect } from "react";
import Card from "./card/card";
import { fetchProducts } from "./redux/productSlice";
import { useDispatch, useSelector } from "react-redux";

const ProductList = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state?.products?.item);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
        height: "85vh",
        overflow: "scroll",
        paddingTop: "15px",
      }}
    >
      {Array.isArray(selector) &&
        selector.map((item, index) => (
          <Fragment key={index}>
            <Card data={item} />
          </Fragment>
        ))}
    </div>
  );
};

export default ProductList;