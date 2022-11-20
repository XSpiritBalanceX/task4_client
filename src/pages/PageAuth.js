import React from "react";
import { useState, useContext, useEffect} from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {Button, Modal, Form, Container, Card} from 'react-bootstrap'
import { login, registration } from "../http/userAPI";
import { Context } from "../index";
import {observer} from 'mobx-react-lite';
import decoded from 'jwt-decode';

const PageAuth =observer(()=>{

  const {user}=useContext(Context);
  const location=useLocation();
  const isLogin=location.pathname==='/login';
  const navigate=useNavigate();


  const [form, setForm]=useState({email:'', password:''});
  const [formReg, setFormReg]=useState({nameReg:'', emailReg:'', passwordReg:''});
  const [show, setShow] = useState(false);
  const [modalInfo, setModal]=useState('');
  const handleClose = () => setShow(false);

  const changeLogin=(event)=>{
    setForm({...form, [event.target.name]:event.target.value})
  }
  const changeReg=(event)=>{
    setFormReg({...formReg, [event.target.name]:event.target.value})
  }

  const click=async()=>{
    try{
      let data;
      if(isLogin){
      data=await login(form.email, form.password);
      let blockUser=decoded(data.token);
      if(blockUser.id===parseInt(localStorage.getItem(`blocked ${blockUser.id}`))){
        user.setIsAuth(false);
        navigate('/login');
        setModal('You have been blocked. You cannot enter!')
        setShow(true);
      }else{
        user.setIsAuth(true);
        navigate('/tableUser');
      }   
       setForm({email:'', password:''});  
    }else{
      data=await registration(formReg.nameReg, formReg.emailReg, formReg.passwordReg); 
      setFormReg({nameReg:'', emailReg:'', passwordReg:''});
      setModal(data.message);
      setShow(true);
      navigate('/login');  
    }}catch(e){
      setForm({email:'', password:''})
      setFormReg({nameReg:'', emailReg:'', passwordReg:''})  
      setModal(e.response.data.message)
      setShow(true);     
    }
  }
    return(
        <div>
          <Container className="d-flex justify-content-center align-items-center" style={{height:window.innerHeight-54}}>          
          <Card style={{width:600}} className='p-5'>
            <h2 className="m-auto">{isLogin?'Authorization':'Registration'}</h2>
            {isLogin?<Form className="d-flex flex-column">
              <Form.Control type="email" className="mt-3" placeholder={'Enter email'} value={form.email} name='email' onChange={changeLogin}/>
              <Form.Control type='password' className="mt-3" placeholder={'Password'} name='password' value={form.password} onChange={changeLogin}/>
              <div className=" d-flex  justify-content-between mt-3 pl-3 pr-3">
                <div > No account? <NavLink to='/registration'>Register</NavLink></div>
                <Button  variant="outline-dark" onClick={click}>Sign In</Button>
              </div>              
            </Form>:
            <Form className="d-flex flex-column">
              <Form.Control className="mt-3" placeholder={'Enter your name'} value={formReg.nameReg} name='nameReg' onChange={changeReg}/>
            <Form.Control className="mt-3" type="email" placeholder={'Enter email'} value={formReg.emailReg} name='emailReg' onChange={changeReg}/>
            <Form.Control className="mt-3" type='password' placeholder={'Password'} value={formReg.passwordReg} name='passwordReg' onChange={changeReg}/>
            <div className=" d-flex  justify-content-between mt-3 pl-3 pr-3">
              <div >Have an account?  <NavLink to='/login'>Sign in</NavLink></div>
              <Button  variant="outline-dark" onClick={click}>Register</Button>
            </div>              
          </Form>}
          </Card>
          </Container>

    <Modal show={show} onHide={handleClose}>
        <Modal.Body>{modalInfo}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
        </div>
    )
})

export default PageAuth;