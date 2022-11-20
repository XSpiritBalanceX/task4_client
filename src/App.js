import React, {useContext} from 'react';
import {BrowserRouter} from 'react-router-dom';
import PageLinks from './pages/PageLinks';
import PageRouter from './pages/PageRouter';
import {observer} from 'mobx-react-lite';
import {Context} from './index';

const App=observer(()=> {
  const {user}=useContext(Context);
   console.log(user.isAuth)
  

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
