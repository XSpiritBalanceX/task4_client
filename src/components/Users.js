import React, {useState, useEffect} from 'react';


const Users=(props)=>{ 
    const [ckeckInput, setckeckInput]=useState(props.check);

    useEffect(()=>{
      setckeckInput(props.check)
    },[props.check])
    const processAction=(event)=>{
        setckeckInput(event.target.checked)
        props.selectUserNow(event.target.id, event.target.checked);
    }

   return(
    <tr>
        <td><input type={'checkbox'} id={props.info.id}  checked={ckeckInput}  
           onChange={(event)=>{processAction(event)}}/></td>
        <td>{props.info.id}</td>
        <td>{props.info.name}</td>
        <td>{props.info.email}</td>
        <td>{props.info.data_reg}</td>
        <td>{props.info.data_log}</td>
        <td>{props.activuser===props.info.id?'Active':props.blocked?'Blocked':'Inactive'}</td>
    </tr>
   )
}

export default Users;