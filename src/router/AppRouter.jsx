import React, { useContext, useEffect, useState } from 'react';
import AuthContext from "../context/AuthProvider";
import NavigationPanel from '../components/NavigationPanel';
import EmployeePage from '../components/EmployeePage';
import { Route, Routes } from 'react-router-dom';
import { privateRoutes, publicRoutes } from './Routes';
import { Divider, message } from 'antd';
import Login from '../components/Login';
import Employees from '../components/Employees';

const AppRouter = () => {
    let {user} = useContext(AuthContext)
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)

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
            localStorage.setItem('notifications', jsonData);
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
    return (
        user
            ?
            <>
                <NavigationPanel currentLocation={window.location.pathname}/>
                <Routes>
                    {privateRoutes.map(route =>
                        <Route key={route.id} path={route.path} element={route.element}/>
                    )}
                    <Route path='' element={<Employees/>}/>
                </Routes>
                <Divider/>
                <div style={{height: 50}}/>
            </>
            :
            <>
                <Routes>
                    {publicRoutes.map(route =>
                        <Route key={route.id} path={route.path} element={route.element}/>
                    )}
                    <Route path='*' element={<Login/>}/>
                </Routes>
            </>
    );
};

export default AppRouter;
