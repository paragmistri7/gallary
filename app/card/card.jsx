"use client"
import "./cardStyle.css"
import { addItem } from "../redux/slice"

import { useDispatch } from "react-redux"
const Card = () => {
 const dispatch = useDispatch()
    console.log(dispatch)

  return (
 <div className="card" > 
    <div className="card-image">
        <img src="https://images.unsplash.com/photo-1580910051074-3eb694886505" alt="Fresh Apples"/>
        <span className="badge">Fresh</span>
    </div>

    <div className="card-content">
        <h3>Fresh Apples</h3>
        <p className="weight">1kg Pack</p>
        <p className="price">$3.99</p>x

        <div className="quantity">
            <button onClick={()=>"decrease()"}>−</button>
            <span id="qty">1</span>
            <button onClick={()=>"increase()"}>+</button>
        </div>

        <button className="add-btn" onClick={()=>dispatch(addItem())} >Add to Cart</button>
    </div>
</div>
  )
}

export default Card