import React, { useEffect, useState } from 'react';
import { Badge, Button, List, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
const { Text } = Typography;

const DeleteUser = () => {
  let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
  const [users, setUsers] = useState([])
  useEffect(() => {
    getUsers();
  }, [])
  const navigate = useNavigate();

  const redirect = (path) => {
    navigate(path);
  }

  let getUsers = async ()=> {
    try {
        let response = await fetch(process.env.REACT_APP_API_URL + "getUsers", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens.access
            },
        })
        const jsonData = await response.json();
        setUsers(jsonData)
        console.log(jsonData)
    } catch (e) {
        console.log(e);
    }
  }
  let deleteUser = async (userId)=> {
    try {
        let response = await fetch(process.env.REACT_APP_API_URL + "deleteUser?id="+Number(userId), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens.access
            },
        })
        const jsonData = await response.json();
        if(jsonData === "Error"){
            console.log('Error delete user')
        }else{
          console.log(jsonData)
          message.open({
            type: 'success',
            content: 'Пользователь удален',
          });
          getUsers();
        }
        
    } catch (e) {
        console.log(e);
    }
    }
  return <>
    <List
        size='large'
        style={{margin: 10}}
        bordered
        dataSource={users}
        renderItem={(item) => (
            <List.Item actions={[<Button type='primary' danger onClick={()=>{deleteUser(item.id)}}><DeleteOutlined /></Button>]}>
               {item.name}
            </List.Item>
        )}
    />
  </>
};
export default DeleteUser;