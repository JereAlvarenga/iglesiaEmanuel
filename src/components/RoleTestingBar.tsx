import React from 'react';
import { CampusId, UserRole } from '../types';
import { ShieldCheck, UserCheck, HeartHandshake, MapPin, RotateCcw } from 'lucide-react';

interface RoleTestingBarProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  currentCampus: CampusId;
  onSelectCampus: (campus: CampusId) => void;
  isMobileFrame?: boolean;
  onToggleMobileFrame?: () => void;
  onResetData: () => void;
  pendingReplacementsCount: number;
}

export const RoleTestingBar: React.FC<RoleTestingBarProps> = ({
  currentRole,
  onSelectRole,
  currentCampus,
  onSelectCampus,
  onResetData,
  pendingReplacementsCount,
}) => {
  return (
    <div className="bg-[#0f172a] text-slate-200 border-b border-slate-800 text-xs px-2.5 py-2 sticky top-0 z-[100] shadow-md backdrop-blur-md">
      <div className="max-w-md mx-auto space-y-1.5">
        {/* Row 1: Role Selector */}
        <div className="flex items-center justify-between gap-1">
          <button
            type="button"
            onClick={() => onSelectRole('volunteer')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold text-[11px] transition-all ${
              currentRole === 'volunteer'
                ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-400'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
            <span className="truncate">Voluntario</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectRole('leader')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold text-[11px] transition-all relative ${
              currentRole === 'leader'
                ? 'bg-indigo-600 text-white shadow-xs ring-1 ring-indigo-400'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-300 flex-shrink-0" />
            <span className="truncate">Líder</span>
            {pendingReplacementsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-0.5 flex-shrink-0" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectRole('superadmin')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold text-[11px] transition-all ${
              currentRole === 'superadmin'
                ? 'bg-blue-600 text-white shadow-xs ring-1 ring-blue-400'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300 flex-shrink-0" />
            <span className="truncate">Admin</span>
          </button>
        </div>

        {/* Row 2: Campus Filter & Reset Button */}
        <div className="flex items-center justify-between gap-1.5 text-[10px]">
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 flex-1">
            <span className="px-1.5 text-slate-400 flex items-center gap-0.5 flex-shrink-0">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>Sede:</span>
            </span>
            <div className="flex items-center flex-1 justify-around">
              <button
                type="button"
                onClick={() => onSelectCampus('central')}
                className={`flex-1 py-0.5 px-1 rounded text-[10px] font-semibold transition-colors text-center ${
                  currentCampus === 'central' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Central
              </button>
              <button
                type="button"
                onClick={() => onSelectCampus('norte')}
                className={`flex-1 py-0.5 px-1 rounded text-[10px] font-semibold transition-colors text-center ${
                  currentCampus === 'norte' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Norte
              </button>
              <button
                type="button"
                onClick={() => onSelectCampus('todas')}
                className={`flex-1 py-0.5 px-1 rounded text-[10px] font-semibold transition-colors text-center ${
                  currentCampus === 'todas' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                Todas
              </button>
            </div>
          </div>

          {/* Reset Demo State */}
          <button
            type="button"
            onClick={onResetData}
            title="Restablecer datos de prueba"
            className="flex items-center gap-1 px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg text-[10px] border border-slate-700 transition-colors flex-shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

