import React from 'react'
import ProductList from '../productList'
import Header from '../Header/header'
import { Route, Routes } from 'react-router-dom'
import AllCartItems from '../cart/page'
import About from '../about/page'

const Dashboard = () => {
  return (
      <>
          <Header />
          <ProductList />
                 <Routes>
            <Route path="/dashboard" element={<ProductList />} />
            <Route path="/allCartItems" element={<AllCartItems />} />
            <Route path="/about" element={<About />} />
          </Routes> 
    </>
  )
}

export default Dashboard
