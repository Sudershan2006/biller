import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import { HashRouter,Routes,Route } from 'react-router-dom';
import { Home } from './Components/Home.jsx';
import { Product } from './Components/Product.jsx';
import { Main } from './Components/Main.jsx';
import { OList } from './Components/List.jsx';
import { Notfound } from './Components/Notfound.jsx';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/main_window' element={<Main />}/>
        <Route path='/add' element={<Product />}/>
        <Route path='/list' element={<OList />}/>
        <Route path='*' element={<Notfound />}/>
      </Routes>
      </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
