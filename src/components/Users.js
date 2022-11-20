import React, {useState} from 'react';


const Users=(props)=>{ 
    const  [chech, setChecked]=useState(props.valueAllCheck);
    
    const processAction=(event)=>{
          
          chech[event.target.id]=event.target.checked     
           setChecked(chech);
           props.selectUserNow(event.target.id, event.target.checked);
    }

   return(
    <tr>
        <td><input type={'checkbox'} id={props.info.id}  checked={props.checkedInput?true:chech[props.info.id]||false}  
           onChange={(event)=>{processAction(event)}}/></td>
        <td>{props.info.id}</td>
        <td>{props.info.name}</td>
        <td>{props.info.email}</td>
        <td>{props.info.data_reg}</td>
        <td>{props.info.data_log}</td>
        <td>{props.activuser==props.info.id?'Active':props.blocked?'Blocked':'Inactive'}</td>
    </tr>
   )
}

export default Users;