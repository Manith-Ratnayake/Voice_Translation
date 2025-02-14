import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Sender from './Sender.jsx'
//import Login from './Login.jsx'

// import Receiver from './Receiver.jsx'
// import DatabaseConnection from "./DatabaseConnection.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Sender/>
  </StrictMode>,
)
