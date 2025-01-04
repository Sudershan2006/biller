import React from 'react';
import { useNavigate } from 'react-router-dom';


export function Notfound() {
  const navigate = useNavigate();
  return (
    <div style={{textAlign:'center'}}>
      Page not found...
    </div>
  )
}

