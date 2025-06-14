import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

/**
 * Custom hook for managing theme (light/dark mode)
 * @param defaultTheme The default theme to use if no theme is stored
 * @returns An object containing the current theme and a function to toggle the theme
 */
export const useTheme = (defaultTheme: Theme = 'light') => {
  // Get stored theme from localStorage or use default
  const getStoredTheme = (): Theme => {
    // Check localStorage
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    
    // Always default to light mode regardless of system preference
    return defaultTheme;
  };

  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // Apply theme to document when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, toggleTheme };
};
