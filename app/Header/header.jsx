"use client"
import "./headerStyle.css"
import {useSelector} from "react-redux"

const Header = () => {
    const selector = useSelector((state) => {
        console.log("<<s", state)
        return state?.cart?.cartValue
    })
    
    console.log(selector)
   
  return (
<header className="header">
    <div className="container">
        <div className="logo">MyBrand</div>

        <nav className="nav">
            <ul className="nav-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </nav>

<div className="cart-container">
            <svg className="cart-icon" viewBox="0 0 24 24">
                <path d="M7 4H5L3 14h16l2-8H7z"/>
                <circle cx="10" cy="20" r="2"/>
                <circle cx="18" cy="20" r="2"/>
            </svg>
                  <span className="cart-badge" id="cart-count">{ selector}</span>
        </div>
    </div>
</header>

  )
}

export default Header