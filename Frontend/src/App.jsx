import './App.css'
import { AppRoutes } from './routes.jsx'
import ChatBot from './feature/chat/ChatBot.jsx'

function App() {
  return (
    <>
      <AppRoutes />
      <ChatBot />
    </>
  )
}

export default App
