"use client";
import Link from "next/link";
import { useSelector } from "react-redux";
import "./headerStyle.css";

const Header = ({ children }) => {
  const selector = useSelector((state) => {
    return state?.cart?.items;
  });


  return (<>
   <header className="header">
      <div className="container">
        <div className="logo">My Shop</div>

        <nav className="nav">
          <ul className="nav-links">
            <li>
              <Link href="/dashboard">Home</Link>
            </li>
            <li>
              <Link href="/dashboard/userList">User List</Link>
            </li>
          </ul>
        </nav>

        <div className="cart-container">
          <Link href="/dashboard/cart">
            <span>🛒</span>
            <span style={{ marginLeft: "5px" , color: "white" }}>{selector?.length || 0}</span>
          </Link>
        </div>
      </div>
    </header>
        {children}
     
  </>
  );
};

export default Header;