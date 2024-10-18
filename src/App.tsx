
import { Route, Routes } from 'react-router-dom'
import './App.css'

import Layout from './components/Layout'
import Mainwindow from './components/Mainwindow'


function App() {

  

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path ="/see" element={<Mainwindow />} />
        </Routes>
      </div>
     
    </>
  )
}

export default App
