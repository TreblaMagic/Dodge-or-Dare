import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "py-3 px-6 rounded-xl font-bold text-lg transition-all duration-200 active:scale-95 shadow-lg";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30",
    secondary: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30",
    danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30",
    outline: "bg-transparent border-2 border-slate-600 hover:border-slate-400 text-slate-300",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;