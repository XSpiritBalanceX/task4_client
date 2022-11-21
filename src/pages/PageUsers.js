import React, { useState , useEffect, useContext}from "react";
import {Button,ButtonGroup,Table, Modal } from 'react-bootstrap';
import Users from '../components/Users';
import decoded from 'jwt-decode';
import {useNavigate} from 'react-router-dom';
import { Context } from "../index";
import {observer} from 'mobx-react-lite';


const PageUsers =observer(()=>{

    const {user}=useContext(Context);

    const [checked, setChecked]= useState(false);
    const [dataUser, setDataUser]=useState([]);
    const [isLoad, setLoad]=useState(false);
    const navigate=useNavigate();
    const [show, setShow] = useState(false);
    const [modalInfo, setModal]=useState('');
    const handleClose = () => setShow(false);

    useEffect(()=>{
      fetch('https://task4server-production.up.railway.app/api/table')
      .then(res=>res.json())
      .then(data=>{setLoad(true); transformData(data)})      
    },[]);

    const transformData=(data)=>{
        data.forEach(el=>{
          el.check=false
        })
        setDataUser(data);
    }
    
    
    const selectAllUsers={};

    const selectUser=(userId, chec)=>{ 
      setDataUser(prevState=>
        prevState.map(el=>
          el.id === parseInt(userId) 
          ? { ...el, check: chec }
          : el)); 
    }

    const activUser=decoded(localStorage.getItem('token'));

    const deleteUser=()=>{ 
     let arrDeleteUser=[]
     let newData=[...dataUser];
     newData.forEach((el, ind)=>{
      if(el.check){
        arrDeleteUser.push(el.id);
        if(el.id===activUser.id){
          user.setIsAuth(false);
          localStorage.setItem('token' , null);
          navigate('/login');
        }
        newData.splice(ind,1)
      }
     }) 
     setDataUser(newData);
     fetch('https://task4server-production.up.railway.app/api/table/delete/',{method:'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }, 
        body:JSON.stringify({data:arrDeleteUser})})
      .then(response=>response.json())
      .then(data=>{setModal(data.message); setShow(true)});
    }

    const selectedAllUsersOnButton=(bool)=>{
      setChecked(!bool);
      setDataUser(prevState=>prevState.map(el=>{
        return ({...el, check:!bool})
     })); 
    }

    const blockUser=()=>{
         setDataUser(prevState=>prevState.map(el=>{
             if(el.check ){              
              localStorage.setItem(`blocked ${el.id}` , el.id);
             }
             if(el.id===activUser.id && el.check){
              user.setIsAuth(false);        
              navigate('/login');
             }
             return ({...el, check:false})
          })); 
    }

    const ublockUser=()=>{
      setDataUser(prevState=>prevState.map(el=>{
        if(el.check ){              
         localStorage.removeItem(`blocked ${el.id}` , el.id);
        }
        return ({...el, check:false})
     }));
    }
    
    let users=isLoad?dataUser.map(el=>{
      selectAllUsers[el.id]=checked?true:false;
        return <Users key={el.id} 
        activuser={activUser.id}
        info={el} 
        checkedInput={checked}
        selectUserNow={selectUser}
        check={el.check}       
        blocked={el.id===parseInt(localStorage.getItem(`blocked ${el.id}`))}/>
    }).sort((a,b)=>a.key-b.key):null;
    
    return(<div>
          <div style={{marginTop:'3%'}}>
            <ButtonGroup aria-label="Basic example" >
                <Button variant="secondary" onClick={blockUser}>Block</Button>
                <Button variant="secondary" onClick={ublockUser}>Unblock</Button>
                <Button variant="secondary" onClick={deleteUser}>Delete</Button>
            </ButtonGroup>
        </div>  
        <Table striped>
      <thead>
        <tr>
          <th><Button
          id="toggle-check"
          type="checkbox"
          variant="secondary"
          onClick={() => selectedAllUsersOnButton(checked)}
        >{!checked?'Select All':'Deselect'}</Button></th>
          <th>id</th>
          <th>Name</th>
          <th>Email</th>
          <th>Date reg</th>
          <th>Date log</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {users}
      </tbody>
    </Table>

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

export default PageUsers;