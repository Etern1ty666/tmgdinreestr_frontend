import React, { useContext } from 'react';
import { Button, Flex } from 'antd';
import AuthContext from "../context/AuthProvider";
import { useNavigate } from 'react-router-dom';



const Settings = () => {
  let {user, logoutUser} = useContext(AuthContext)
  const navigate = useNavigate();

  let connectTelegram = async ()=> {
    try {
        let response = await fetch(process.env.REACT_APP_API_URL + "connectTelegram", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens.access
            },
            body:JSON.stringify({'id': window.Telegram.WebApp.initDataUnsafe.user.id})
        })
        const jsonData = await response.json();
        console.log(jsonData)
    } catch (e) {
        console.log(e);
    }
  }
  let logOut = () => {
    navigate('/');
    logoutUser();
  }
  return (
      <Flex style={{margin: 10}} vertical gap="middle" align='start'>
        <Button onClick={()=>{navigate('/addUser')}} color="primary" variant="text">
          Создать новую учетную запись
        </Button>
        <Button onClick={()=>{navigate('/deleteUser')}} color="primary" variant="text">
          Удалить учетную запись
        </Button>
        <Button onClick={()=>{navigate('/uploadExcel')}} color="primary" variant="text">
          Загрузить данные из Excel
        </Button>
        <Button onClick={()=>{connectTelegram}} color="primary" variant="text">
          Привязать Telegram
        </Button>
        <Button onClick={logOut} color="primary" variant="text">
          Выйти
        </Button>
      </Flex>
  );
};
export default Settings;
