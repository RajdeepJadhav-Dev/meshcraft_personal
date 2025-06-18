import { useState } from 'react'
import ServicesPage from './Pages/ServicesPage'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom';
import AboutPage from './Pages/AboutPage';
import Marketplace from './Pages/Marketplace';
import AuthState from "./context/AuthState"
import Assets from "./ASSET/Assets"

function App() {
 

  return (
    <>
    
    <div>
      <AuthState>
      <Routes>
 <Route path='/services' element={<ServicesPage></ServicesPage>}></Route>
 <Route path='/about_us' element={<AboutPage></AboutPage>}></Route>
  <Route path='/marketplace' element={<Marketplace></Marketplace>}></Route>
  <Route path='/asset/:id' element={<Assets />}></Route>
  </Routes>
  </AuthState>
    </div>
    
    </>
  )
}

export default App
