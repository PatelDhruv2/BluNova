import React from 'react'
import Header from './Header'
import BluNovaHome from './content'
import { useNavigate } from 'react-router-dom'
const HomePage = () => {
  const navigate = useNavigate();
  if(!document.cookie.includes("jwt=")){
    navigate("/");
  }
  return (
    <div>
      <Header />
      <BluNovaHome />
    </div>
  )
}

export default HomePage