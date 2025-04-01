import React, { useEffect, useState } from 'react';
import { Alert, Button, message, Popconfirm, Result, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Typography } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
const { Text } = Typography;



const Notifications = () => {
  let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
  const [notifications, setNotifications] = useState({})
  useEffect(() => {
    getNotifications();
  }, [])
  const navigate = useNavigate();

  const redirect = (path) => {
    navigate(path);
  }
  let deleteCertificate = async (id)=> {
    try {
        let response = await fetch(process.env.REACT_APP_API_URL + "deleteCertificate?id="+Number(id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens.access
            },
        })
        const jsonData = await response.json();
        if(jsonData === "Error"){
            console.log('Error delete certificate')
        }else{
          console.log(jsonData)
          message.open({
            type: 'success',
            content: 'Удостоверение удалено',
          });
        }
        
    } catch (e) {
        console.log(e);
    }
    }
  let getNotifications = async ()=> {
    try {
        let response = await fetch(process.env.REACT_APP_API_URL + "getNotifications", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens.access
            },
        })
        const jsonData = await response.json();
        setNotifications(jsonData)
        console.log(jsonData)
    } catch (e) {
        console.log(e);
    }
  }

  const confirm = (certificateId, employeeId) => {
    deleteCertificate(certificateId)
    navigate('/addCertificate/'+employeeId)
  };

  const cancel = (e) => {
    console.log(e);
  };

  return <div style={{margin: 10}}>
    <div>
      {
        notifications.count == 0
        ?<Result
          icon={<SmileOutlined />}
          title={<>Уведомлений нет. <br/> Все в порядке!</>}
        />
        :null
      }
    </div>
    {
      notifications.data?.map((notification)=>{
        let type = 'info'
        let info = 'Осталось менее 30 дней'
        if(notification.type === 'expired'){
          type = 'error'
          info = 'Просрочено'
        }else if(notification.type === '1week'){
          type = 'warning'
          info = 'Осталось менее 7 дней'
        }else{
          type = 'info'
        }
          
        return <>
          <br />
          <Alert
            message={info}
            description={notification.employee_name + '. ' + notification.name}
            type={type}
            showIcon
            action={
              <Popconfirm
                title="Обновить удостоверение"
                description="Удалить старое удостоверение и создать новое?"
                okText="Да"
                cancelText="Нет"
                onConfirm={() => confirm(notification.id, notification.employee_id)}
                onCancel={cancel}
              >
                <Button size="small">
                  Обновить
                </Button>
              </Popconfirm>
          }
          />
        </>
      })
    }
  </div>
};
export default Notifications;