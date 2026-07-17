import React, { useState } from 'react'
import {useNavigate}  from 'react-router-dom';

const BlackPage = () => {

    const navigate = useNavigate();

    setTimeout(() => {
        navigate("/loading")
    }, 2000)

  return (
    <div className='bg-black h-screen w-screen'></div>
  )
}

export default BlackPage;