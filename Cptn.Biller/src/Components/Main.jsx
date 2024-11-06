import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


export function Main() {
    const navigate = useNavigate();
    useEffect(()=>{
        navigate('/');
    },[])

  return (
    <div>  
    </div>
  )
}
