import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    colors: typeof themes.light;
}

const themes = {
    light: {
        background: '#FFFFFF',
        text: '#1E293B',
        primary: '#0EA5E9',
        secondary: '#94A3B8',
        card: '#F8FAFC',
        border: '#E2E8F0',
        jokeBackground: '#EFF6FF',
        jokeBorder: '#93C5FD',
        jokeText: '#1E40AF',
        error: '#FF4444',
    },
    dark: {
        background: '#1E293B',
        text: '#F8FAFC',
        primary: '#38BDF8',
        secondary: '#94A3B8',
        card: '#334155',
        border: '#475569',
        jokeBackground: '#1E293B',
        jokeBorder: '#38BDF8',
        jokeText: '#BAE6FD',
        error: '#FF6B6B',
    },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemColorScheme = useColorScheme();
    const [theme, setTheme] = useState<Theme>(systemColorScheme || 'light');

    useEffect(() => {
        setTheme(systemColorScheme || 'light');
    }, [systemColorScheme]);

    const toggleTheme = () => {
        setTheme(curr => curr === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            toggleTheme,
            colors: themes[theme]
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 