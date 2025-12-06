import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message) => addToast(message, 'error'), [addToast]);
  const warning = useCallback((message) => addToast(message, 'warning'), [addToast]);
  const info = useCallback((message) => addToast(message, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ id, message, type, onClose }) => {
  const config = {
    success: {
      icon: CheckCircle,
      className: 'bg-green-50 border-green-500 text-green-800',
      iconColor: 'text-green-500'
    },
    error: {
      icon: AlertCircle,
      className: 'bg-red-50 border-red-500 text-red-800',
      iconColor: 'text-red-500'
    },
    warning: {
      icon: AlertTriangle,
      className: 'bg-yellow-50 border-yellow-500 text-yellow-800',
      iconColor: 'text-yellow-500'
    },
    info: {
      icon: Info,
      className: 'bg-blue-50 border-blue-500 text-blue-800',
      iconColor: 'text-blue-500'
    }
  };

  const { icon: Icon, className, iconColor } = config[type];

  return (
    <div 
      className={`${className} border-l-4 rounded-lg shadow-lg p-4 flex items-start gap-3 min-w-[320px] max-w-md animate-slide-in`}
    >
      <Icon className={iconColor} size={20} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button 
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};
