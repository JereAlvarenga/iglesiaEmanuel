import React, { useState } from 'react';
import { ChurchEvent, RosterAssignment, User } from '../types';
import { VOLUNTEER_DATABASE } from '../mockData';
import {
  Users,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Clock,
  MapPin,
  Building2,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  ChevronRight,
  X,
  Check
} from 'lucide-react';

interface AdminViewProps {
  user: User;
  events: ChurchEvent[];
  assignments: RosterAssignment[];
  onAddEvent: (newEvent: Omit<ChurchEvent, 'id'>) => void;
  activeCampus: string;
}

export const AdminView: React.FC<AdminViewProps> = ({
  user,
  events,
  assignments,
  onAddEvent,
  activeCampus,
}) => {
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [inspectingEvent, setInspectingEvent] = useState<ChurchEvent | null>(null);

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventCampus, setEventCampus] = useState<'Sede Central' | 'Sede Norte'>('Sede Central');
  const [eventDate, setEventDate] = useState('2024-11-10');
  const [eventTime, setEventTime] = useState('10:00 AM');
  const [eventLocation, setEventLocation] = useState('Templo Mayor');
  const [eventCategory, setEventCategory] = useState<'Culto Regular' | 'Servicio Juvenil' | 'Capacitación' | 'Especial'>('Culto Regular');
  const [eventVolunteersNeeded, setEventVolunteersNeeded] = useState(12);

  // Dynamic filter based on selected campus
  const filteredEvents = events.filter((evt) => {
    if (activeCampus === 'todas') return true;
    if (activeCampus === 'central') return evt.campus === 'Sede Central';
    if (activeCampus === 'norte') return evt.campus === 'Sede Norte';
    return true;
  });

  const filteredAssignments = assignments.filter((asg) => {
    const event = events.find((e) => e.id === asg.eventId);
    if (!event) return false;
    if (activeCampus === 'central' && event.campus !== 'Sede Central') return false;
    if (activeCampus === 'norte' && event.campus !== 'Sede Norte') return false;
    return true;
  });

  // Calculate dynamic KPIs reacting to campus filter
  const totalVolunteersCount = VOLUNTEER_DATABASE.filter((v) => {
    if (activeCampus === 'central') return v.campus === 'Sede Central';
    if (activeCampus === 'norte') return v.campus === 'Sede Norte';
    return true;
  }).length;

  const totalAssignedSlots = filteredAssignments.length;
  const totalConfirmed = filteredAssignments.filter((a) => a.status === 'Confirmado').length;
  const totalPending = filteredAssignments.filter((a) => a.status === 'Pendiente').length;
  const totalReplacementsAlerts = filteredAssignments.filter((a) => a.status === 'Rechazado').length;
  const coveragePercentage = totalAssignedSlots > 0 ? Math.round((totalConfirmed / totalAssignedSlots) * 100) : 100;

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    // Format human readable date
    const dateObj = new Date(eventDate + 'T12:00:00');
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const formattedDate = `${days[dateObj.getDay()]} ${dateObj.getDate()} ${months[dateObj.getMonth()]}`;

    onAddEvent({
      title: eventTitle.trim(),
      campus: eventCampus,
      locationDetail: `${eventCampus} — ${eventLocation}`,
      date: eventDate,
      dateFormatted: formattedDate,
      time: eventTime,
      arrivalPrayerTime: '9:15 AM',
      category: eventCategory,
      requiredVolunteers: Number(eventVolunteersNeeded),
      description: `Programado por la Dirección Pastoral (${user.name}).`,
    });

    setIsAddEventModalOpen(false);
    setEventTitle('');
  };

  return (
    <div className="w-full max-w-md mx-auto px-3.5 py-4 space-y-4 pb-20">
      {/* Superadmin Mobile Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-100 shadow-xs flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200/80 px-2 py-0.2 rounded-full uppercase tracking-wider">
                Panel Pastoral
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {activeCampus === 'todas'
                  ? 'Todas'
                  : activeCampus === 'central' ? 'Central' : 'Norte'}
              </span>
            </div>
            <h1 className="text-sm font-bold text-slate-900 truncate mt-0.5">{user.name}</h1>
            <p className="text-[11px] text-slate-500 truncate">{user.roleTitle}</p>
          </div>
        </div>

        {/* Action Button: Create Event */}
        <button
          type="button"
          onClick={() => setIsAddEventModalOpen(true)}
          className="p-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all active:scale-[0.98] cursor-pointer flex-shrink-0"
          title="Programar Nuevo Culto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">Nuevo Culto</span>
        </button>
      </div>

      {/* Dynamic KPI Cards in 2x2 Mobile Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* KPI 1: Voluntarios Activos */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Servidores</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
            {totalVolunteersCount} <span className="text-[10px] font-normal text-slate-500">activos</span>
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-1">100% listos</span>
        </div>

        {/* KPI 2: Cobertura de Turnos */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Cobertura</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-emerald-800 mt-1 tabular-nums">
            {coveragePercentage}%
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full"
              style={{ width: `${coveragePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* KPI 3: Cultos Programados */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Cultos</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
            {filteredEvents.length} <span className="text-[10px] font-normal text-slate-500">eventos</span>
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">Octubre – Noviembre</span>
        </div>

        {/* KPI 4: Alertas de Reemplazo */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">Vacantes</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              totalReplacementsAlerts > 0 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-slate-50 text-slate-400'
            }`}>
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-rose-700 mt-1 tabular-nums">
            {totalReplacementsAlerts}
          </p>
          <span className="text-[10px] text-slate-400 block mt-1">
            {totalReplacementsAlerts > 0 ? 'Requiere atención' : 'Todo cubierto'}
          </span>
        </div>
      </div>

      {/* Button to add new event */}
      <button
        type="button"
        onClick={() => setIsAddEventModalOpen(true)}
        className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
      >
        <Plus className="w-4 h-4 text-blue-700 stroke-[3]" />
        <span>+ Programar Nuevo Culto / Evento</span>
      </button>

      {/* Consolidated Service Calendar (Mobile Cards List) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-800" />
            <h2 className="text-xs font-bold text-slate-900">
              Calendario Consolidado de Cultos
            </h2>
          </div>
          <span className="text-[10px] text-slate-400">
            {filteredEvents.length} cultos
          </span>
        </div>

        <div className="space-y-2">
          {filteredEvents.map((evt) => {
            const eventAssignments = assignments.filter((a) => a.eventId === evt.id);
            const confirmed = eventAssignments.filter((a) => a.status === 'Confirmado').length;
            const hasRejection = eventAssignments.some((a) => a.status === 'Rechazado');

            return (
              <div
                key={evt.id}
                onClick={() => setInspectingEvent(evt)}
                className="p-3 rounded-xl border border-slate-200/70 hover:bg-slate-50 transition-colors flex items-center justify-between gap-2.5 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 border border-blue-100 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold uppercase leading-none">
                      {evt.dateFormatted.split(' ')[0].slice(0, 3)}
                    </span>
                    <span className="text-sm font-extrabold leading-none mt-0.5">
                      {evt.dateFormatted.split(' ')[1]}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-xs font-bold text-slate-900 truncate">{evt.title}</h3>
                      {hasRejection && (
                        <span className="text-[9px] bg-rose-50 text-rose-700 px-1 py-0.2 rounded font-semibold border border-rose-200">
                          Vacante
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {evt.time} · {evt.campus.replace('Sede ', '')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800">
                      {confirmed}/{evt.requiredVolunteers}
                    </span>
                    <span className="text-[9px] text-slate-400 block">listos</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ministry Health Overview in Mobile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs space-y-3">
        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
          <Layers className="w-4 h-4 text-blue-800" />
          <h3 className="text-xs font-bold text-slate-900">Salud de Ministerios</h3>
        </div>

        <div className="space-y-2.5 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-800 text-[11px]">Niños &amp; Familia</span>
              <span className="font-bold text-emerald-700 text-[11px]">92%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-800 text-[11px]">Alabanza &amp; Adoración</span>
              <span className="font-bold text-blue-700 text-[11px]">88%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-800 text-[11px]">Protocolo y Ujieres</span>
              <span className="font-bold text-amber-700 text-[11px]">75%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-800 text-[11px]">Multimedia &amp; Sonido</span>
              <span className="font-bold text-emerald-700 text-[11px]">100%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add New Event (Mobile Bottom Sheet) */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl space-y-3.5 animate-in slide-in-from-bottom duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Programar Nuevo Culto</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEventModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Nombre del Culto o Evento</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Culto de Jóvenes / Vigilia Especial"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Sede</label>
                  <select
                    value={eventCampus}
                    onChange={(e) => setEventCampus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                  >
                    <option value="Sede Central">Sede Central</option>
                    <option value="Sede Norte">Sede Norte</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Categoría</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                  >
                    <option value="Culto Regular">Culto Regular</option>
                    <option value="Servicio Juvenil">Servicio Juvenil</option>
                    <option value="Capacitación">Capacitación</option>
                    <option value="Especial">Especial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Fecha</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Horario</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 10:00 AM"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Salón / Espacio</label>
                <input
                  type="text"
                  placeholder="Ej. Templo Mayor / Salón Kids"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">
                  Voluntarios Requeridos
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={eventVolunteersNeeded}
                  onChange={(e) => setEventVolunteersNeeded(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Guardar Culto</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Inspect Event Details & Team (Mobile Bottom Sheet) */}
      {inspectingEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl space-y-3.5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{inspectingEvent.title}</h4>
                <p className="text-[11px] text-slate-500">
                  {inspectingEvent.dateFormatted} · {inspectingEvent.time} ({inspectingEvent.campus})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectingEvent(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-800 block">
                Equipo de Servidores ({assignments.filter((a) => a.eventId === inspectingEvent.id).length} asignados):
              </span>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {assignments
                  .filter((a) => a.eventId === inspectingEvent.id)
                  .map((asg) => (
                    <div
                      key={asg.id}
                      className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={asg.volunteerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={asg.volunteerName}
                          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="truncate">
                          <span className="font-bold text-slate-800 block truncate">
                            {asg.volunteerName}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate block">{asg.roleName}</span>
                        </div>
                      </div>
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          asg.status === 'Confirmado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : asg.status === 'Rechazado'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {asg.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setInspectingEvent(null)}
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
