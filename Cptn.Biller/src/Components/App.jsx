import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { Home } from './Home.jsx';
import { Product } from './Product.jsx';
import { Main } from './Main.jsx';
import { Notfound } from './Notfound.jsx';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/main_window' element={<Main />}/>
        <Route path='/add' element={<Product />}/>
        <Route path='*' element={<Notfound />}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
