import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Protected_Routes = (props) => {
  const navigate = useNavigate();
  const { Component } = props
  const user_is_active = localStorage.getItem("user_is_active");

  useEffect(()=>{
    if(!user_is_active){
      navigate("/login")
    }
  })
  return (
    <div><Component /></div>
  )
}

export default Protected_Routes