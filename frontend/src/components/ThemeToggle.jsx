import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const themeContext = useTheme();

  // ✅ Supports BOTH systems
  const isDark = themeContext.darkmode ?? themeContext.theme === "dark";
  const toggleTheme = themeContext.toggleTheme;

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex items-center w-14 h-8 rounded-full p-1 transition-all duration-300
      ${isDark
        ? "bg-gradient-to-r from-indigo-700 to-purple-700 shadow-lg shadow-purple-900/40"
        : "bg-gradient-to-r from-yellow-300 to-orange-400 shadow-lg shadow-orange-400/40"
      }`}
      title="Toggle Theme"
    >
      {/* SLIDING CIRCLE */}
      <span
        className={`absolute w-6 h-6 rounded-full bg-white flex items-center justify-center
        transition-transform duration-300 ease-in-out
        ${isDark ? "translate-x-6" : "translate-x-0"}`}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-purple-700" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-500" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
