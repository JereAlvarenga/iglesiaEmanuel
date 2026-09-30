import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[150] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let bgStyle = 'bg-white border-slate-200 text-slate-800 shadow-xl';
        let icon = <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />;

        if (toast.type === 'success') {
          bgStyle = 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xl';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
        } else if (toast.type === 'warning') {
          bgStyle = 'bg-amber-50 border-amber-300 text-amber-950 shadow-xl';
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
        } else if (toast.type === 'error') {
          bgStyle = 'bg-rose-50 border-rose-300 text-rose-950 shadow-xl';
          icon = <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border transition-all animate-in slide-in-from-bottom-2 fade-in duration-200 ${bgStyle}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold leading-tight">{toast.title}</p>
              <p className="text-xs text-slate-600 mt-0.5 leading-normal">{toast.description}</p>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-md"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
