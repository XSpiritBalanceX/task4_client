import React, {useContext} from "react";
import {Route, Routes, Navigate} from 'react-router-dom';
import PageAuth from './PageAuth';
import PageUsers from "./PageUsers";
import { Context } from "../index";

const PageRouter =()=>{   
   const {user}=useContext(Context);
    return(
        <Routes>
            <Route path="/" element={<PageAuth/>}/>                        
            <Route path="/login" element={<PageAuth/>}/>
            <Route path="/registration" element={<PageAuth />}/>
            
            {user.isAuth&& <Route path="/tableUser" element={<PageUsers/>}/>}
            <Route path="*" element={<Navigate to ={'/registration'}/>}/>
        </Routes>
    )

}

export default PageRouter;
