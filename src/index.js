import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import locale from 'antd/locale/ru_RU';
import dayjs from 'dayjs';

dayjs.locale('ru_RU');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


