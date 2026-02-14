
"use client"
import Header from "./Header/header"
import {Provider}  from "react-redux"
import Card from "./card/card"
import store from "./redux/store"
const App = () => {

  return (<>
    <Provider store={store}>

    <Header />
    <Card />
    </Provider>
  </>
  )
}

export default App