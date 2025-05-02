import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { RefineThemes } from "@refinedev/antd";
import { ConfigProvider, theme as antdTheme } from "antd";

type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = "refine_theme";

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const stored: Theme =
    localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  const [theme, setTheme] = useState<Theme>(stored);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    }
  }, []);

  const toggleTheme = () => {
    const stored = localStorage.getItem(THEME_KEY);
    const newTheme = stored === "light" ? "dark" : "light";
    localStorage.setItem(THEME_KEY, newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ConfigProvider
        theme={{
          ...RefineThemes.Blue,
          algorithm:
            theme === "light"
              ? antdTheme.defaultAlgorithm
              : antdTheme.darkAlgorithm,
          components: {
            Button: {
              borderRadius: 0,
            },
            Typography: {
              colorTextHeading: "#1890ff",
            },
          },
          token: {
            colorPrimary: "#f0f",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
