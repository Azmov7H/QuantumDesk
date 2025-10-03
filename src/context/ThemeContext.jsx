"use client"
import { useEffect } from "react";
import { useState } from "react";

const { createContext } = require("react");


export const ThemeContext = createContext();

export const ThemeProvider = ({children}) =>{
    const [theme, setTheme] = useState("light")


    useEffect(()=>{
        localStorage.setItem("theme", theme)
    },[theme])


    return(

        <>
        <ThemeContext.Provider value={{theme, setTheme}} >
            {children}
        </ThemeContext.Provider>
        </>
    )

}