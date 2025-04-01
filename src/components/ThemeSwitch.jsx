import React, {useContext} from 'react';
import { FloatButton } from "antd";
import {ColorModeContext} from "../context/AuthProvider";
import { BiMoon, BiSolidSun  } from "react-icons/bi"

const ThemeSwitch = () => {
    const colorMode = useContext(ColorModeContext);
    const selectedTheme = localStorage.getItem("selectedTheme");

    return (
        <div>
            <FloatButton
                shape='square'
                onClick={colorMode.toggleColorMode} 
                icon={selectedTheme === "dark"?<BiSolidSun/>:<BiMoon/>}
            />
        </div>
    );
};

export default ThemeSwitch;
