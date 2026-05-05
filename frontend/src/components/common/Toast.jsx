import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const styles = {
    success: 'bg-emerald-600/90 border-emerald-500/50',
    error: 'bg-red-600/90 border-red-500/50',
    info: 'bg-amber-600/90 border-amber-500/50'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${styles[type]}`}>
        {icons[type]}
        <span className="text-white font-medium text-sm">{message}</span>
        <button onClick={onClose} className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors">
          <X className="w-4 h-4 text-white/70" />
        </button>
      </div>
    </div>
  );
};

export const useToast = () => {
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast({ message: '', type: 'info' });
  };

  return { toast, showToast, hideToast };
};

export default Toast;