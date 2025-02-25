import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

//import Main from './Sender3.jsx'
import AudioRecord from './Sender4.jsx'
import { Connection } from './Connection.jsx'
import Receiver from './Receiver.jsx'
import Frontend from './Frontend.jsx'
//import Login from './Login.jsx'

// import Receiver from './Receiver.jsx'
// import DatabaseConnection from "./DatabaseConnection.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Frontend/>
  </StrictMode>,
)
