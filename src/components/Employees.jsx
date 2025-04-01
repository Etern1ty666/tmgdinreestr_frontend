import React, { useEffect, useState } from 'react';
import { Badge, Button, List, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
const { Text } = Typography;

const data = [
  {name: 'Движко Александр Олегович', id: 1, certificatesCount: 5},
  {name: 'Новиков Игорь Олегович', id: 2, certificatesCount: 2},
  {name: 'Движко Александр Олегович', id: 3, certificatesCount: 1},
];
const Employees = () => {
  let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
  const [employees, setEmployees] = useState([])
  useEffect(() => {
      getEmployees();
  }, [])
  const navigate = useNavigate();

  const redirect = (path) => {
    navigate(path);
  }

  let getEmployees = async ()=> {
    try {
        let response = await fetch(process.env.REACT_APP_API_URL + "getEmployees", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authTokens.access
            },
        })
        const jsonData = await response.json();
        setEmployees(jsonData)
        console.log(jsonData)
    } catch (e) {
        console.log(e);
    }
  }

  return <>
    <List
        size='large'
        header={<div style={{justifyContent: 'space-between', display: 'flex'}}><Text strong>Сотрудники</Text>
          <Button onClick={() => {redirect('/addEmployee')}} type="text" shape="square" icon={<PlusOutlined />} />
</div>}
        style={{margin: 10}}
        bordered
        dataSource={employees}
        renderItem={(item) => (
            <List.Item onClick={ () => {redirect('/employees/'+ item.id)}} actions={[<RightOutlined />]}>
              <Badge count={item.expiredCount} offset={[-30, 0]}>
                <Typography.Text code>{item.certificatesCount}</Typography.Text>
              </Badge>
               {item.name}
            </List.Item>
        )}
    />
  </>
};
export default Employees;