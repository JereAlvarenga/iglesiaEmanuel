import React, { useState } from 'react';
import { ChurchEvent, Ministry, RosterAssignment, User } from '../types';
import { VOLUNTEER_DATABASE } from '../mockData';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  Filter,
  Check,
  X,
  UserCheck,
  Send,
  MoreVertical,
  MessageCircle,
  HelpCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface LeaderViewProps {
  user: User;
  events: ChurchEvent[];
  assignments: RosterAssignment[];
  onUpdateAssignmentStatus: (assignmentId: string, newStatus: 'Confirmado' | 'Pendiente' | 'Rechazado') => void;
  onAcceptAiSuggestion: (vacantAssignmentId: string, volunteerId: string, volunteerName: string) => void;
  activeCampus: string;
}

export const LeaderView: React.FC<LeaderViewProps> = ({
  user,
  events,
  assignments,
  onUpdateAssignmentStatus,
  onAcceptAiSuggestion,
  activeCampus,
}) => {
  const [selectedMinistry, setSelectedMinistry] = useState<string>('Todos');
  const [selectedCellAssignment, setSelectedCellAssignment] = useState<RosterAssignment | null>(null);
  const [isCellModalOpen, setIsCellModalOpen] = useState(false);
  const [dismissedAiBanners, setDismissedAiBanners] = useState<string[]>([]);
  const [selectedVolunteerProfile, setSelectedVolunteerProfile] = useState<typeof VOLUNTEER_DATABASE[0] | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>('evt-oct-12-central');
  const [mobileViewMode, setMobileViewMode] = useState<'cards' | 'matrix'>('cards');

  // Filter events based on active campus
  const filteredEvents = events.filter((evt) => {
    if (activeCampus === 'todas') return true;
    if (activeCampus === 'central') return evt.campus === 'Sede Central';
    if (activeCampus === 'norte') return evt.campus === 'Sede Norte';
    return true;
  });

  // Ensure selectedEventId is valid for current campus
  const activeEvent = filteredEvents.find((e) => e.id === selectedEventId) || filteredEvents[0];

  // Filter assignments based on filtered events and ministry
  const relevantAssignments = assignments.filter((asg) => {
    const event = events.find((e) => e.id === asg.eventId);
    if (!event) return false;
    if (activeCampus === 'central' && event.campus !== 'Sede Central') return false;
    if (activeCampus === 'norte' && event.campus !== 'Sede Norte') return false;
    if (selectedMinistry !== 'Todos' && asg.ministry !== selectedMinistry) return false;
    return true;
  });

  // Detect open vacancies / rejected shifts (for AI Antigravity suggestion banner)
  const rejectedShifts = relevantAssignments.filter(
    (a) => a.status === 'Rechazado' && !dismissedAiBanners.includes(a.id)
  );

  // Compute metrics
  const totalShifts = relevantAssignments.length;
  const confirmedShifts = relevantAssignments.filter((a) => a.status === 'Confirmado').length;
  const pendingShifts = relevantAssignments.filter((a) => a.status === 'Pendiente').length;
  const vacantShifts = relevantAssignments.filter((a) => a.status === 'Rechazado').length;
  const coverageRate = totalShifts > 0 ? Math.round((confirmedShifts / totalShifts) * 100) : 100;

  // Extract unique volunteer roster rows
  const volunteersInMinistry = VOLUNTEER_DATABASE.filter((vol) => {
    if (activeCampus === 'central' && vol.campus !== 'Sede Central') return false;
    if (activeCampus === 'norte' && vol.campus !== 'Sede Norte') return false;
    if (selectedMinistry !== 'Todos' && vol.ministry !== selectedMinistry) return false;
    return true;
  });

  const handleCellClick = (asg: RosterAssignment) => {
    setSelectedCellAssignment(asg);
    setIsCellModalOpen(true);
  };

  // Assignments for currently selected event in mobile card view
  const currentEventAssignments = relevantAssignments.filter((a) => a.eventId === activeEvent?.id);

  return (
    <div className="w-full max-w-md mx-auto px-3.5 py-4 space-y-4 pb-20">
      {/* Mobile Leader Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-100 shadow-xs flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.2 rounded-full uppercase tracking-wider">
                Gestor Roster
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {activeCampus === 'todas' ? 'Todas' : activeCampus === 'central' ? 'Central' : 'Norte'}
              </span>
            </div>
            <h1 className="text-sm font-bold text-slate-900 truncate mt-0.5">{user.name}</h1>
            <p className="text-[11px] text-slate-500 truncate">{user.roleTitle}</p>
          </div>
        </div>

        <div className="text-right flex-shrink-0 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100">
          <span className="text-[10px] text-emerald-800 font-semibold block leading-tight">Cobertura</span>
          <span className="text-base font-bold text-emerald-700 tabular-nums">{coverageRate}%</span>
        </div>
      </div>

      {/* Quick KPI stats in 2x2 mobile grid */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
          <span className="text-[9px] text-slate-400 font-semibold uppercase block">Turnos</span>
          <span className="text-sm font-bold text-slate-800 tabular-nums">{totalShifts}</span>
        </div>

        <div className="bg-emerald-50/80 rounded-xl p-2 border border-emerald-100">
          <span className="text-[9px] text-emerald-700 font-semibold uppercase block">Listos</span>
          <span className="text-sm font-bold text-emerald-700 tabular-nums">{confirmedShifts}</span>
        </div>

        <div className="bg-amber-50/80 rounded-xl p-2 border border-amber-100">
          <span className="text-[9px] text-amber-700 font-semibold uppercase block">Pend.</span>
          <span className="text-sm font-bold text-amber-700 tabular-nums">{pendingShifts}</span>
        </div>

        <div className="bg-rose-50/80 rounded-xl p-2 border border-rose-100">
          <span className="text-[9px] text-rose-700 font-semibold uppercase block">Vacantes</span>
          <span className="text-sm font-bold text-rose-700 tabular-nums">{vacantShifts}</span>
        </div>
      </div>

      {/* AI Suggestion Banner (Antigravity Mock Workflow) - Mobile Formatted */}
      {rejectedShifts.length > 0 && (
        <div className="space-y-2.5">
          {rejectedShifts.map((vacant) => {
            const event = events.find((e) => e.id === vacant.eventId);
            const isMateoReplacement = vacant.volunteerId === 'vol-mateo';

            return (
              <div
                key={vacant.id}
                className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-[#1E3A8A] to-blue-900 text-white rounded-2xl p-4 shadow-md border border-indigo-400/40 animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <div className="space-y-2 relative z-10">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span className="inline-flex items-center gap-1 bg-indigo-500/30 border border-indigo-400/50 text-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                      Sugerencia AI Antigravity
                    </span>
                    <span className="text-[10px] text-rose-200 bg-rose-900/70 px-2 py-0.2 rounded font-medium">
                      {isMateoReplacement ? 'Reemplazo de Mateo' : 'Vacante activa'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white">
                      Vacante: {vacant.roleName}
                    </h3>
                    <p className="text-[11px] text-indigo-200 mt-0.5">
                      Fecha: {event?.dateFormatted || 'Servicio'} · {event?.time}
                    </p>
                  </div>

                  <p className="text-[11px] text-indigo-100 leading-snug bg-white/10 p-2 rounded-xl">
                    Sugerir a <strong className="text-white underline decoration-amber-400">María Pérez</strong>: 100% afinidad ministerial, sin turnos este fin de semana.
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setDismissedAiBanners((prev) => [...prev, vacant.id])}
                      className="py-2 px-2.5 rounded-xl bg-white/10 text-indigo-200 text-xs font-medium hover:bg-white/20 transition-colors"
                    >
                      Omitir
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onAcceptAiSuggestion(
                          vacant.id,
                          'vol-maria',
                          'María Pérez'
                        )
                      }
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Asignar a María Pérez</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ministry Filter Pill Bar - Horizontal Mobile Touch Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar -mx-1 px-1">
        {['Todos', 'Niños & Familia', 'Alabanza & Adoración', 'Protocolo', 'Multimedia'].map(
          (ministry) => (
            <button
              key={ministry}
              type="button"
              onClick={() => setSelectedMinistry(ministry)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                selectedMinistry === ministry
                  ? 'bg-[#1E3A8A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ministry}
            </button>
          )
        )}
      </div>

      {/* View Mode Toggle: Cards (Mobile friendly) vs Matrix (Grid) */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="text-xs font-bold text-slate-800">Planificación de Turnos</span>
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setMobileViewMode('cards')}
            className={`px-2 py-1 rounded-md transition-colors ${
              mobileViewMode === 'cards' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-500'
            }`}
          >
            Vista Cultos
          </button>
          <button
            type="button"
            onClick={() => setMobileViewMode('matrix')}
            className={`px-2 py-1 rounded-md transition-colors ${
              mobileViewMode === 'matrix' ? 'bg-white text-blue-900 shadow-2xs' : 'text-slate-500'
            }`}
          >
            Matriz Completa
          </button>
        </div>
      </div>

      {/* View 1: Mobile Friendly Event-by-Event Roster Cards (Default for phones) */}
      {mobileViewMode === 'cards' && (
        <div className="space-y-3">
          {/* Service Date Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 -mx-1 px-1 no-scrollbar">
            {filteredEvents.map((evt) => {
              const isSelected = activeEvent?.id === evt.id;
              const hasAlert = assignments.some(
                (a) => a.eventId === evt.id && a.status === 'Rechazado'
              );

              return (
                <button
                  key={evt.id}
                  type="button"
                  onClick={() => setSelectedEventId(evt.id)}
                  className={`px-3 py-2 rounded-xl text-left flex-shrink-0 transition-all border ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300 text-blue-950 ring-1 ring-blue-300'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold">{evt.dateFormatted}</span>
                    {hasAlert && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block">{evt.time}</span>
                </button>
              );
            })}
          </div>

          {/* Active Event Information Banner */}
          {activeEvent && (
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{activeEvent.title}</span>
                <span className="text-[11px] text-slate-500">{activeEvent.locationDetail}</span>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">
                {currentEventAssignments.filter((a) => a.status === 'Confirmado').length} / {currentEventAssignments.length} listos
              </span>
            </div>
          )}

          {/* Volunteer Roster Cards for Active Event */}
          <div className="space-y-2">
            {currentEventAssignments.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                No hay servidores asignados para esta fecha en el área seleccionada.
              </div>
            ) : (
              currentEventAssignments.map((asg) => {
                return (
                  <div
                    key={asg.id}
                    onClick={() => handleCellClick(asg)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer bg-white hover:shadow-xs flex items-center justify-between gap-2.5 ${
                      asg.status === 'Confirmado'
                        ? 'border-emerald-200 hover:border-emerald-300'
                        : asg.status === 'Rechazado'
                        ? 'border-rose-200 hover:border-rose-300 bg-rose-50/30'
                        : 'border-amber-200 hover:border-amber-300 bg-amber-50/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={asg.volunteerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={asg.volunteerName}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {asg.volunteerName}
                          </span>
                          {asg.aiSuggested && (
                            <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1 rounded font-semibold border border-indigo-200">
                              IA
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 truncate font-medium">
                          {asg.roleName}
                        </p>
                        <span className="text-[10px] text-slate-400 truncate block">
                          {asg.ministry}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end flex-shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          asg.status === 'Confirmado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : asg.status === 'Rechazado'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {asg.status === 'Confirmado' && <Check className="w-3 h-3" />}
                        {asg.status === 'Rechazado' ? 'Reemplazo' : asg.status}
                      </span>
                      <span className="text-[9px] text-blue-600 underline mt-1">Cambiar</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* View 2: Horizontal Scroll Roster Matrix */}
      {mobileViewMode === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Matriz de Todos los Cultos</span>
            <span className="text-[10px] text-slate-500">Desliza horizontalmente 👉</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5 px-3 sticky left-0 bg-slate-50 z-10 border-r border-slate-200 w-36">
                    Servidor
                  </th>
                  {filteredEvents.map((evt) => (
                    <th key={evt.id} className="py-2 px-2 text-center min-w-[100px] border-r border-slate-100">
                      <p className="font-bold text-slate-800 text-[11px]">{evt.dateFormatted.split(' ')[1]} {evt.dateFormatted.split(' ')[2]}</p>
                      <p className="text-[9px] text-slate-400">{evt.time}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {volunteersInMinistry.map((vol) => (
                  <tr key={vol.id} className="hover:bg-slate-50/50">
                    <td className="py-2 px-2.5 sticky left-0 bg-white z-10 border-r border-slate-200">
                      <div
                        onClick={() => setSelectedVolunteerProfile(vol)}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <img
                          src={vol.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={vol.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-800 text-[11px] truncate max-w-[85px]">
                          {vol.name}
                        </span>
                      </div>
                    </td>

                    {filteredEvents.map((evt) => {
                      const assignment = assignments.find(
                        (a) => a.eventId === evt.id && a.volunteerId === vol.id
                      );

                      if (!assignment) {
                        return (
                          <td key={evt.id} className="py-2 px-2 text-center text-slate-300 border-r border-slate-100">
                            —
                          </td>
                        );
                      }

                      return (
                        <td key={evt.id} className="p-1 border-r border-slate-100">
                          <button
                            type="button"
                            onClick={() => handleCellClick(assignment)}
                            className={`w-full p-1 rounded-md text-left transition-all ${
                              assignment.status === 'Confirmado'
                                ? 'bg-emerald-100 text-emerald-900'
                                : assignment.status === 'Rechazado'
                                ? 'bg-rose-100 text-rose-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            <span className="text-[10px] font-bold block truncate">
                              {assignment.roleName.split(' ')[0]}
                            </span>
                            <span className="text-[8px] opacity-80 block truncate">
                              {assignment.status}
                            </span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Quick Edit Cell Assignment Status (Mobile Bottom Sheet) */}
      {isCellModalOpen && selectedCellAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl space-y-3.5 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Editar Estado de Turno</h4>
                <p className="text-xs text-slate-500">{selectedCellAssignment.volunteerName}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCellModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Rol Asignado</span>
              <p className="text-xs font-bold text-slate-800">{selectedCellAssignment.roleName}</p>
              <p className="text-[11px] text-slate-500">{selectedCellAssignment.ministry}</p>
            </div>

            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-slate-700 block">Selecciona nuevo estado:</label>
              
              <button
                type="button"
                onClick={() => {
                  onUpdateAssignmentStatus(selectedCellAssignment.id, 'Confirmado');
                  setIsCellModalOpen(false);
                }}
                className={`w-full py-3 px-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                  selectedCellAssignment.status === 'Confirmado'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Marcar como Confirmado</span>
                </div>
                {selectedCellAssignment.status === 'Confirmado' && <Check className="w-4 h-4 stroke-[3]" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdateAssignmentStatus(selectedCellAssignment.id, 'Pendiente');
                  setIsCellModalOpen(false);
                }}
                className={`w-full py-3 px-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                  selectedCellAssignment.status === 'Pendiente'
                    ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Dejar como Pendiente</span>
                </div>
                {selectedCellAssignment.status === 'Pendiente' && <Check className="w-4 h-4 stroke-[3]" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  onUpdateAssignmentStatus(selectedCellAssignment.id, 'Rechazado');
                  setIsCellModalOpen(false);
                }}
                className={`w-full py-3 px-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                  selectedCellAssignment.status === 'Rechazado'
                    ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Rechazado / Requiere Suplente</span>
                </div>
                {selectedCellAssignment.status === 'Rechazado' && <Check className="w-4 h-4 stroke-[3]" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Volunteer Profile Drawer (Mobile Bottom Sheet) */}
      {selectedVolunteerProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Ficha de Servidor</h4>
              <button
                type="button"
                onClick={() => setSelectedVolunteerProfile(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={selectedVolunteerProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={selectedVolunteerProfile.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-100"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedVolunteerProfile.name}</h3>
                <p className="text-xs text-slate-500">{selectedVolunteerProfile.ministry}</p>
                <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.2 rounded-full inline-block mt-0.5">
                  {selectedVolunteerProfile.campus}
                </span>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Roles Preferidos:</span>
              <div className="flex flex-wrap gap-1">
                {selectedVolunteerProfile.preferredRoles?.map((r) => (
                  <span key={r} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedVolunteerProfile(null)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

