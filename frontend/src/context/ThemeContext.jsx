import { createContext, useContext, useEffect, useState } from "react";

// 1️⃣ Create context
const ThemeContext = createContext();

// 2️⃣ Custom hook (THIS FIXES YOUR ERROR)
export const useTheme = () => {
    return useContext(ThemeContext);
};

// 3️⃣ Provider
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");

    // Load theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    // Save theme & apply class to <html>
    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.className = theme;
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
