import React from 'react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme, className = '' }) => {
  return (
    <button
      className={`p-2 rounded-full w-10 h-10 md:w-9 md:h-9 sm:w-8 sm:h-8 flex items-center justify-center transition-colors ${className}`}
      style={{
        backgroundColor: 'var(--theme-toggle-bg)',
      }}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg className="w-6 h-6 md:w-5 md:h-5 sm:w-4 sm:h-4 transition-colors" style={{ color: 'var(--theme-toggle-icon)' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1zm7.071 2.929a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0zm-14.142 0a1 1 0 0 1 1.414 0l.707.707A1 1 0 0 1 5.636 8.05l-.707-.707a1 1 0 0 1 0-1.414zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-8 4a1 1 0 0 1 1 1 1 1 0 1 1-2 0 1 1 0 0 1 1-1zm16 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-9 4a1 1 0 1 0 2 0v-1a1 1 0 1 0-2 0v1zm-5.657 1.657a1 1 0 0 1 1.414 0l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414zm12.728 0a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0z" fill="currentColor" />
        </svg>
      ) : (
        <svg className="w-6 h-6 md:w-5 md:h-5 sm:w-4 sm:h-4 transition-colors" style={{ color: 'var(--theme-toggle-icon)' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
