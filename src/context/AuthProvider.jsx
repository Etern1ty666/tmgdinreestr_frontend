import {createContext, useState, useEffect, useMemo} from 'react'
import { jwtDecode } from "jwt-decode";
import {ConfigProvider} from "antd";
import ru_RU from 'antd/locale/ru_RU';
import { theme } from 'antd';
import ThemeSwitch from '../components/ThemeSwitch';
import locale from 'antd/locale/ru_RU';
import dayjs from 'dayjs';

import 'dayjs/locale/ru';

locale = dayjs.locale('ru_RU') 

const { useToken } = theme;
const AuthContext = createContext()

export const ColorModeContext = createContext({ toggleColorMode: () => {} });


export default AuthContext;


export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    let loginUser = async (e )=> {
        console.log(process.env.REACT_APP_API_URL);
        let response = await fetch(process.env.REACT_APP_API_URL + 'api/token/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
        })
        let data = await response.json()

        if(response.status === 200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        }else{
            alert('Проверьте имя пользователя или пароль.')
        }
    }


    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
    }
    
    let updateToken = async ()=> {
        console.log(1, process.env.REACT_APP_API_URL);
        let response = await fetch(process.env.REACT_APP_API_URL + 'api/token/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'refresh':authTokens?.refresh})
        })

        let data = await response.json()

        if (response.status === 200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        }else{
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }


    useEffect(()=> {
        if(loading){
            updateToken()
        }

        let fourMinutes = 1000 * 60 * 4
        let interval =  setInterval(()=> {
            if(authTokens){
                updateToken()
            }
        }, fourMinutes)
        return ()=> clearInterval(interval)

    }, [authTokens, loading])

    const [mode, setMode] = useState(localStorage.getItem("selectedTheme"));

    const toggleMode = () => {
        let prevMode = localStorage.getItem("selectedTheme")
        let mode = prevMode === "dark" ? "light" : "dark"
        localStorage.setItem("selectedTheme", mode)
        if(mode === "dark"){
            document.body.style.background = '#161616';
        }else{
            document.body.style.background = '#fff';
        }
    }

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
                toggleMode();
            },
        }),
        [],
    );

    const dark_theme = {
      }
    const light_theme = {
      }
      
    const { token } = useToken();
    
    return(
        <ColorModeContext.Provider value={colorMode}>
            <ConfigProvider locale={ru_RU} theme={localStorage.getItem('selectedTheme') === 'dark'?dark_theme:light_theme}>
                <AuthContext.Provider value={contextData} >
                    {loading ? <>{children}</> : <>{children}</>}
                </AuthContext.Provider>
            </ConfigProvider>
        </ColorModeContext.Provider>
    )
}

