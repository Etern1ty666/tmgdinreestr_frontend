import React from 'react';
import { theme } from 'antd';
import NavigationPanel from './components/NavigationPanel';
import Certificate from './components/Certificate';
import EmployeePage from './components/EmployeePage';
import { BrowserRouter, HashRouter } from 'react-router-dom'
import AppRouter from "./router/AppRouter";
import {AuthProvider} from "./context/AuthProvider";

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter/>
      </AuthProvider>
    </BrowserRouter>
  );
};
export default App;
