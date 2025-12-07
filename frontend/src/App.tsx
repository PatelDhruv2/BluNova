
import './App.css'
import HomePage from './components/HomePage'
import { Routes, Route } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import Signup from './components/Signup'
import StudioDashboard from './components/studio'
import ProtectedRoute from './components/Protectedroutes'
function App() {
  

  return (
   <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={
        <Signup/>
        } /> 
      <Route path="/studio/:id" element={
        <ProtectedRoute><StudioDashboard/></ProtectedRoute>
        
        } />
    </Routes>
   </BrowserRouter>
  )
}

export default App
