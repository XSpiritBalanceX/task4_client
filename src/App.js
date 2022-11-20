import React, {useContext, useState, useEffect} from 'react';
import {BrowserRouter} from 'react-router-dom';
import PageLinks from './pages/PageLinks';
import PageRouter from './pages/PageRouter';
import {observer} from 'mobx-react-lite';
import {Context} from './index';

const App=observer(()=> {
  const {user}=useContext(Context);

  useEffect(()=>{
    console.log(user.isAuth)
  },[user.isAuth===true])

  return (
    <div>
      <BrowserRouter>
       <PageLinks />      
      <PageRouter />
      </BrowserRouter>
    </div>
    
    
    
  );
})

export default App;
