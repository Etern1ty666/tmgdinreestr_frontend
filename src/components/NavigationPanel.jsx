import React, { useEffect, useState } from 'react';
import { BellOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import { Badge, Segmented } from 'antd';
import { useNavigate } from 'react-router-dom';

const iconStyle = { fontSize: '32px', marginTop: 8}

const NavigationPanel = ({currentLocation}) => {
  
  const [selectedPage, setSelectedPage] = useState(currentLocation==='/' || currentLocation.includes('employees')?'employees':currentLocation.slice(1));
  const [countNotifications, setCountNotifications] = useState(currentLocation==='/' || currentLocation.includes('employees')?'employees':currentLocation.slice(1));
  let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)

  const navigate = useNavigate();

  const redirect = (path) => {
    navigate(path);
    setSelectedPage(path)
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
        setCountNotifications(jsonData.count)
    } catch (e) {
        console.log(e);
    }
  } 
  useEffect(() => {
    getNotifications();

    const timer = setInterval(() => {
        getNotifications();
    }, 15000);

    return () => clearInterval(timer);
  }, [])
  return <div style={{
    zIndex: 999,
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
  }}>
    <Segmented
      value={selectedPage}
      onChange={redirect}
      block
      size="large"
      options={[
        {
          value: 'notifications',
          icon: <Badge count={countNotifications} offset={[5, 15]}><BellOutlined style={iconStyle}/></Badge>,
        },
        {
          value: 'employees',
          icon: <TeamOutlined style={iconStyle}/>,
        },
        {
          value: 'settings',
          icon: <SettingOutlined style={iconStyle}/>,
        },
      ]}
    />
  </div>;
};
export default NavigationPanel;