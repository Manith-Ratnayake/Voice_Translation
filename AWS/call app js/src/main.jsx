import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route} from "react-router-dom"
import { createRoot } from 'react-dom/client'

import Frontend from './Frontend.jsx'
import {Auth} from './Auth.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
              <Route path="/" element={<Auth/>} />          
              <Route path="/Frontend" element={<Frontend/>} />
        </Routes>
    </BrowserRouter>
  </StrictMode>,
);
