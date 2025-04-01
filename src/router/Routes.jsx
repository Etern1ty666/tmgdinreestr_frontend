import { useParams } from "react-router-dom";
import Certificate from "../components/Certificate";
import EmployeePage from "../components/EmployeePage";
import Employees from "../components/Employees";
import Login from "../components/Login";
import Notifications from "../components/Notifications";
import Settings from "../components/Settings";
import AddEmployee from "../components/AddEmployee";
import AddCertificate from "../components/AddCertificate";
import AddUser from "../components/AddUser";
import DeleteUser from "../components/DeleteUser";
import UploadExcel from "../components/UploadExcel";

export const privateRoutes = [
    {id: 1, path: '/notifications', name: 'Уведомления', element: <Notifications/>},
    {id: 2, path: '/employees', name: 'Сотрудники', element: <Employees/>},
    {id: 3, path: '/employees/:id', name: 'Сотрудники', element: <EmployeePage/>},
    {id: 4, path: '/certificate/:id', name: 'Сертификаты', element: <Certificate/>},
    {id: 5, path: '/settings', name: 'Настройки', element: <Settings/>},
    {id: 6, path: '/addEmployee', name: 'Добавить сотрудника', element: <AddEmployee/>},
    {id: 7, path: '/addCertificate/:id', name: 'Добавить удостоверение', element: <AddCertificate/>},
    {id: 8, path: '/addUser', name: 'Создать пользователя', element: <AddUser/>},
    {id: 9, path: '/deleteUser', name: 'Удалить пользователя', element: <DeleteUser/>},
    {id: 10, path: '/uploadExcel', name: 'Загрузить данные из excel', element: <UploadExcel/>},

]


export const publicRoutes = [
    {id: 1, path: '/login', name: 'Войти', element: <Login/>},
]
