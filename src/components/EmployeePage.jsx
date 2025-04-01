import React, { useEffect, useState } from 'react';
import { Button, List, message, Popconfirm } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { DeleteOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const { Text } = Typography;

const data = [
  {name: "Повышение квалификации лиц, на которых возложена трудовая функция по проведению противопожарного инструктажа", id: 11, employeeId: 1, expired: true},
  {name: "ПП, СИЗ, А,Б,В", id: 22, expired: true},
  {name: "Монтажник технологических трубопроводов", id: 33, expired: true},
  {name: "Специалист сварочного производства I уровня НАКС (аттестованный сварщик)", id: 44, expired: false}
];
const EmployeePage = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const redirect = (path) => {
    navigate(path);
  }

  let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
  const [certificates, setCertificates] = useState([])
  const [employeeName, setEmployeeName] = useState('')

  useEffect(() => {
      getCertificates();
      getEmployeeName();
  }, [])

  let getCertificates = async ()=> {
    try {
        let response = await fetch(process.env.REACT_APP_API_URL + "getCertificates?employee=" + Number(id), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens.access
            },
        })
        const jsonData = await response.json();
        setCertificates(jsonData)
        console.log(jsonData)
    } catch (e) {
        console.log(e);
    }
  }

  let getEmployeeName = async ()=> {
    try {
        let response = await fetch(process.env.REACT_APP_API_URL + "getEmployeeName?id=" + Number(id), {  
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens.access
            },
        })
        const jsonData = await response.json();
        setEmployeeName(jsonData)
        console.log(jsonData)
    } catch (e) {
        console.log(e);
    }
  }
  let deleteEmployee = async (userId)=> {
    try {
        let response = await fetch(process.env.REACT_APP_API_URL + "deleteEmployee?id="+Number(id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens.access
            },
        })
        const jsonData = await response.json();
        if(jsonData === "Error"){
            console.log('Error delete employee')
        }else{
          console.log(jsonData)
          message.open({
            type: 'success',
            content: 'Сотрудник удален',
          });
          redirect('/employees')
        }
        
    } catch (e) {
        console.log(e);
    }
    }
  return <>
    <List
        size='large'
        header={<div style={{justifyContent: 'space-between', display: 'flex'}}><Text strong>{employeeName}/Удостоверения</Text>
        <div>
        <Popconfirm
          title="Удалить сотрудника?"
          okText="Да"
          cancelText="Нет"
          onConfirm={deleteEmployee}
          
        >
          <Button type="text" shape="square" icon={<DeleteOutlined />} />
        </Popconfirm>
          <Button onClick={() => {redirect('/addCertificate/'+id)}} type="text" shape="square" icon={<PlusOutlined />} />
        </div>
        </div>}
        style={{margin: 10}}
        bordered
        dataSource={certificates}
        renderItem={(item) => (
            <List.Item onClick={ () => {redirect('/certificate/'+ item.id)}}>
              <div style={{width: '100%', justifyContent: 'space-between', display: 'flex'}}>
                <Text type={item.expired?'danger':null}>{item.name}</Text>
                <RightOutlined />
              </div>
            </List.Item>

        )}
    />
  </>
};
export default EmployeePage;