import React, { useState , useEffect, useContext}from "react";
import {Button,ButtonGroup,Table,ToggleButton, Modal } from 'react-bootstrap';
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
    const [userSel, setUserSelect]=useState(null);
    const navigate=useNavigate();
    const [show, setShow] = useState(false);
    const [modalInfo, setModal]=useState('');
    const [checUsNow, setChecUsNow]=useState(false);
    const handleClose = () => setShow(false);

    useEffect(()=>{
      fetch('http://localhost:5000/api/table')
      .then(res=>res.json())
      .then(data=>{setLoad(true); setDataUser(data)})      
    },[]);

    const [hashUser, setHashUser]=useState({});
    const selectAllUsers={};
    
    const selectUser=(userId, chec)=>{ 
      hashUser[userId]=chec;
      setHashUser(hashUser);
      setUserSelect(userId) ;
      setChecUsNow(chec); 
    }

    const activUser=decoded(localStorage.getItem('token'));

    const deleteUser=()=>{
      let deleteUs=null;
      let newData=[...dataUser];      
      if(checked){
        deleteUs=selectAllUsers;        
      }else{
        deleteUs=hashUser;        
      }
      let arrUserDel=[];
      for(let k in deleteUs){
        if(deleteUs[k]===true){
          console.log(k)
          newData.forEach((el, ind)=>{if(el.id===parseInt(k)){
            newData.splice(ind,1)
            arrUserDel.push(el.id)
          }})
        }    
      }
      setDataUser(newData);    
      fetch('http://localhost:5000/api/table/delete/',{method:'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }, body:JSON.stringify({data:arrUserDel})})
      .then(response=>response.json())
      .then(data=>{setModal(data.message); setShow(true)});
      
      if(userSel===activUser.id){
        user.setIsAuth(false);
        navigate('/registration');
      }
    }

    const blockUser=()=>{if(checked){
        for(let k in selectAllUsers){
          if(selectAllUsers[k]===true){
            localStorage.setItem(`blocked ${k}` , k);
          }
          if(k==activUser.id){
            user.setIsAuth(false);        
            navigate('/login');
          }
          selectAllUsers[k]=false
        }
      }else{
        for(let k in hashUser){
        if(hashUser[k]===true){
          localStorage.setItem(`blocked ${k}` , k);
        }
        if(k==activUser.id){
          user.setIsAuth(false);        
          navigate('/login');
        }
        hashUser[k]=false
      }
      }
      setChecUsNow(false);  
    }

    const ublockUser=()=>{
      for(let k in hashUser){
        if(hashUser[k]===true){
          localStorage.removeItem(`blocked ${k}`);
        }
        hashUser[k]=false
      }
      setChecUsNow(false);
    }
    
    let users=isLoad?dataUser.map(el=>{
      selectAllUsers[el.id]=checked?true:false;
        return <Users key={el.id} 
        activuser={activUser.id}
        info={el} 
        checkedInput={checked}
        selectUserNow={selectUser}
        valueAllCheck={hashUser}        
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
          <th><ToggleButton
          id="toggle-check"
          type="checkbox"
          variant="secondary"
          checked={checked}
          onChange={(e) => setChecked(e.currentTarget.checked)}
        >{!checked?'Select All':'Deselect'}</ToggleButton></th>
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