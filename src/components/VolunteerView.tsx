import React, { useState } from 'react';
import { ChurchEvent, RosterAssignment, User } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  DoorOpen,
  GraduationCap,
  MessageSquare,
  CheckCircle,
  ArrowLeftRight,
  Sparkles,
  Award,
  Home,
  User as UserIcon,
  Bell,
  X,
  Send,
  MapPin,
  Check,
  AlertCircle
} from 'lucide-react';

interface VolunteerViewProps {
  user: User;
  events: ChurchEvent[];
  assignments: RosterAssignment[];
  onConfirmAttendance: (assignmentId: string) => void;
  onRequestReplacement: (assignmentId: string, reason: string, notes: string) => void;
  onUndoStatus: (assignmentId: string) => void;
  activeCampus: string;
}

export const VolunteerView: React.FC<VolunteerViewProps> = ({
  user,
  events,
  assignments,
  onConfirmAttendance,
  onRequestReplacement,
  onUndoStatus,
  activeCampus,
}) => {
  const [activeTab, setActiveTab] = useState<'inicio' | 'calendario' | 'mensajes' | 'perfil'>('inicio');
  const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false);
  const [replacementReason, setReplacementReason] = useState('Salud / Reposo');
  const [replacementNotes, setReplacementNotes] = useState('');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(12);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string; time: string }[]>([
    {
      sender: 'Pastora Laura Gómez',
      text: '¡Hola Mateo! Recuerda que este domingo tenemos dinámicas especiales con títeres bíblicos en Kids Joy.',
      time: 'Ayer, 4:15 PM',
    },
    {
      sender: 'Mateo',
      text: '¡Excelente Pastora! Ya tengo preparado el material de la historia.',
      time: 'Ayer, 5:30 PM',
    },
  ]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Mateo's main upcoming shift for Dom 12 Oct
  const upcomingShift = assignments.find((a) => a.id === 'asg-mateo-oct-12');
  const userAssignments = assignments.filter((a) => a.volunteerId === user.id);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatHistory((prev) => [
      ...prev,
      {
        sender: 'Mateo',
        text: chatMessage.trim(),
        time: 'Ahora',
      },
    ]);
    setChatMessage('');

    // Simulated reply after 1.2s
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'Pastora Laura Gómez',
          text: 'Recibido Mateo, ¡gracias por tu dedicación siempre!',
          time: 'En un momento',
        },
      ]);
    }, 1200);
  };

  const handleReplacementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (upcomingShift) {
      onRequestReplacement(upcomingShift.id, replacementReason, replacementNotes);
      setIsReplacementModalOpen(false);
      setReplacementNotes('');
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-white relative pb-20">
      {/* Mobile Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] flex items-center justify-center text-white font-bold text-sm shadow-xs flex-shrink-0">
            ⛪
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 leading-none">
              EcclesiaOps
            </span>
            <span className="text-sm text-slate-900 font-bold truncate leading-tight mt-0.5">
              {activeTab === 'inicio' && 'Inicio'}
              {activeTab === 'calendario' && 'Mi Calendario'}
              {activeTab === 'mensajes' && 'Mensajes Pastorales'}
              {activeTab === 'perfil' && 'Perfil de Servidor'}
            </span>
          </div>
        </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationOpen(!notificationOpen)}
                aria-label="Notificaciones"
                className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white"></span>
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-800">Avisos Recientes</span>
                    <button
                      type="button"
                      onClick={() => setNotificationOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-100">
                      <p className="font-semibold text-blue-900">Recordatorio de Oración</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Domingo 12 Oct a las 9:15 AM en Sala Kids Joy.
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                      <p className="font-semibold text-emerald-900">Roster de Octubre Publicado</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Ya puedes revisar tus 3 compromisos programados.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Picture */}
            <img
              alt="Perfil"
              src={user.avatar}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100 shadow-sm"
            />
          </div>
        </header>

        {/* Tab Content */}
        {activeTab === 'inicio' && (
          <main className="flex-1 px-4 py-4 space-y-4">
            {/* User Profile Card matching Stitch mockup */}
            <section className="bg-white border border-slate-200/70 p-3.5 rounded-xl shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <img
                    className="w-14 h-14 rounded-full object-cover shadow-sm ring-1 ring-slate-100"
                    alt="Mateo"
                    src={user.avatar}
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-100 rounded-full flex items-center justify-center ring-2 ring-white">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-lg font-bold text-slate-900 truncate">¡Hola, Mateo!</h2>
                    <span className="text-base select-none">👋</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="bg-blue-50 text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                      Niños &amp; Familia
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-600" />
                      Central
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end flex-shrink-0 pl-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Estado</span>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Activo
                </span>
              </div>
            </section>

            {/* Core Urgent Call-To-Action Shift Card */}
            <section className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm flex flex-col space-y-3.5 transition-all">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200/80">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                  <span>Próximo Servicio Asignado</span>
                </div>
                <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  En 3 días
                </span>
              </div>

              {/* Service Details */}
              <div className="space-y-3 pt-1">
                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center flex-shrink-0 border border-blue-100">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Fecha y Horario
                    </span>
                    <p className="text-base text-slate-900 font-bold leading-snug">
                      Domingo 12 Oct · 10:00 AM
                    </p>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Llegada para oración: <span className="font-semibold text-slate-900">9:15 AM</span>
                    </p>
                  </div>
                </div>

                {/* Campus & Room */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center flex-shrink-0 border border-blue-100">
                    <DoorOpen className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Sede y Salón
                    </span>
                    <p className="text-xs text-slate-800 font-semibold truncate">
                      Sede Central — Salón Infantil Kids Joy
                    </p>
                    <span className="text-[11px] text-slate-500">Pabellón Este · Planta Baja</span>
                  </div>
                </div>

                {/* Assigned Role */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center flex-shrink-0 border border-blue-100">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Rol Asignado
                    </span>
                    <p className="text-xs text-slate-800 font-semibold truncate">
                      Maestro Principal (Grupo 6–8 años)
                    </p>
                    <p className="text-[11px] text-blue-700 italic mt-0.5 font-medium">
                      Tema: «El valor de compartir historias»
                    </p>
                  </div>
                </div>
              </div>

              {/* Coordinator Micro-Card */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-slate-200"
                    alt="Laura Gómez"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsxvoyPntrjaqu3Vylm3Ynk7DHPq6KTgKLKLH-gnpoLJ2IgjhPKuruSrpGdseT1oXWB8ttdVSXfqm0o_ClkjTfUJ-PXOvuYVrC2uDi9Vcu1CqlCuy0FuaMkphc-bfOQD3SbW5__Gio-uV2LmcfjibIZZLy2LIhue2mec_F-vl-ysYcSXSzyOs7ENnZd7k3NYCWOJf1_wJaOfVCd7CGXhtoVQIMGvU8I3NKJAI7NSQp5u6lJ5Jx0688"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-slate-400 font-medium">Coordinadora de Turno</span>
                    <span className="text-xs text-slate-800 font-semibold truncate">
                      Pastora Laura Gómez
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  aria-label="Escribir a Pastora Laura"
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-700 hover:border-blue-300 transition-colors shadow-2xs"
                  title="Abrir chat rápido"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons / Status Resolution */}
              <div className="pt-1">
                {upcomingShift?.status === 'Confirmado' ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900 transition-all">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold leading-tight">
                          ¡Turno Confirmado! Nos vemos el domingo.
                        </span>
                        <span className="text-[11px] text-emerald-700">
                          Tu asistencia está registrada en el roster general.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onUndoStatus(upcomingShift.id)}
                      className="text-xs text-emerald-800 font-semibold underline hover:text-emerald-950 ml-2 flex-shrink-0"
                    >
                      Modificar
                    </button>
                  </div>
                ) : upcomingShift?.status === 'Rechazado' ? (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-950 transition-all">
                    <div className="flex items-center gap-2 min-w-0">
                      <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold leading-tight">
                          Reemplazo Solicitado ({upcomingShift.replacementReason || 'Fuerza Mayor'})
                        </span>
                        <span className="text-[11px] text-rose-700">
                          Buscando suplente activo... Alerta enviada al panel del Líder.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onUndoStatus(upcomingShift.id)}
                      className="text-xs text-rose-800 font-semibold underline hover:text-rose-950 ml-2 flex-shrink-0"
                    >
                      Cancelar solicitud
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => onConfirmAttendance(upcomingShift?.id || 'asg-mateo-oct-12')}
                      className="w-full py-3 px-4 rounded-xl bg-[#004B1D] hover:bg-[#003816] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-300" />
                      <span>Confirmar Asistencia</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsReplacementModalOpen(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/80 font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-[0.99] transition-all cursor-pointer"
                    >
                      <ArrowLeftRight className="w-4 h-4 text-rose-600" />
                      <span>Solicitar Reemplazo</span>
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Interactive Monthly Schedule Card */}
            <section className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm space-y-3.5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-blue-700" />
                  <h3 className="text-base font-bold text-slate-900">Octubre 2024</h3>
                </div>
                <span className="text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                  3 compromisos
                </span>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-2">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400">
                  <span>L</span>
                  <span>M</span>
                  <span>M</span>
                  <span>J</span>
                  <span>V</span>
                  <span>S</span>
                  <span className="text-blue-700 font-bold">D</span>
                </div>

                {/* Days Grid - Clickable */}
                <div className="grid grid-cols-7 text-center text-xs gap-y-2 select-none">
                  {/* Sept trailing */}
                  <span className="py-1 text-slate-300">30</span>
                  <button type="button" onClick={() => setSelectedCalendarDay(1)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">1</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(2)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">2</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(3)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">3</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(4)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">4</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(5)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">5</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(6)} className="py-1 text-slate-900 font-semibold hover:bg-slate-100 rounded-full">6</button>

                  <button type="button" onClick={() => setSelectedCalendarDay(7)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">7</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(8)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">8</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(9)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">9</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(10)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">10</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(11)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">11</button>

                  {/* Oct 12: Active Key Shift */}
                  <div className="relative py-1 flex flex-col items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setSelectedCalendarDay(12)}
                      className={`w-7 h-7 rounded-full font-bold flex items-center justify-center transition-all ${
                        selectedCalendarDay === 12
                          ? 'ring-2 ring-blue-700 ring-offset-1 bg-blue-600 text-white shadow-sm'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      12
                    </button>
                    <span
                      className={`w-1 h-1 rounded-full mt-0.5 ${
                        upcomingShift?.status === 'Confirmado'
                          ? 'bg-emerald-500'
                          : upcomingShift?.status === 'Rechazado'
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                    ></span>
                  </div>

                  <button type="button" onClick={() => setSelectedCalendarDay(13)} className="py-1 text-slate-900 font-semibold hover:bg-slate-100 rounded-full">13</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(14)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">14</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(15)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">15</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(16)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">16</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(17)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">17</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(18)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">18</button>

                  {/* Oct 19: Confirmed Shift */}
                  <div className="relative py-1 flex flex-col items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setSelectedCalendarDay(19)}
                      className={`w-7 h-7 rounded-full font-semibold flex items-center justify-center transition-all ${
                        selectedCalendarDay === 19
                          ? 'ring-2 ring-emerald-600 ring-offset-1 bg-emerald-100 text-emerald-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      19
                    </button>
                    <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5"></span>
                  </div>

                  <button type="button" onClick={() => setSelectedCalendarDay(20)} className="py-1 text-slate-900 font-semibold hover:bg-slate-100 rounded-full">20</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(21)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">21</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(22)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">22</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(23)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">23</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(24)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">24</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(25)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">25</button>

                  {/* Oct 26: Leadership Training */}
                  <div className="relative py-1 flex flex-col items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setSelectedCalendarDay(26)}
                      className={`w-7 h-7 rounded-full font-semibold flex items-center justify-center transition-all ${
                        selectedCalendarDay === 26
                          ? 'ring-2 ring-blue-500 ring-offset-1 bg-blue-100 text-blue-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      26
                    </button>
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-0.5"></span>
                  </div>

                  <button type="button" onClick={() => setSelectedCalendarDay(27)} className="py-1 text-slate-900 font-semibold hover:bg-slate-100 rounded-full">27</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(28)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">28</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(29)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">29</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(30)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">30</button>
                  <button type="button" onClick={() => setSelectedCalendarDay(31)} className="py-1 text-slate-700 hover:bg-slate-100 rounded-full">31</button>
                  <span className="py-1 text-slate-300">1</span>
                  <span className="py-1 text-slate-300">2</span>
                  <span className="py-1 text-slate-300">3</span>
                </div>
              </div>

              {/* Filter Notice when a day is selected */}
              {selectedCalendarDay && (
                <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
                  <span>Día seleccionado: <strong className="text-slate-800">{selectedCalendarDay} de Octubre</strong></span>
                  {selectedCalendarDay !== 12 && selectedCalendarDay !== 19 && selectedCalendarDay !== 26 && (
                    <span className="text-slate-400 italic">Sin turnos en esta fecha</span>
                  )}
                </div>
              )}

              {/* Agenda Breakdown List matching Stitch mockup */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Turnos Programados
                </span>

                {/* Shift Item Oct 12 */}
                <div
                  onClick={() => setSelectedCalendarDay(12)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                    selectedCalendarDay === 12 ? 'bg-blue-50/60 border-blue-200' : 'bg-slate-50 border-slate-100 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-1.5 h-8 rounded-full flex-shrink-0 ${
                        upcomingShift?.status === 'Confirmado'
                          ? 'bg-emerald-600'
                          : upcomingShift?.status === 'Rechazado'
                          ? 'bg-rose-500'
                          : 'bg-blue-600'
                      }`}
                    ></div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-slate-900 font-semibold truncate">
                        Domingo 12 Oct · 10:00 AM
                      </span>
                      <span className="text-[11px] text-slate-500 truncate">
                        Niños (6-8 años) · Central
                      </span>
                    </div>
                  </div>

                  {upcomingShift?.status === 'Confirmado' ? (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1 flex-shrink-0">
                      <Check className="w-3 h-3" /> Confirmado
                    </span>
                  ) : upcomingShift?.status === 'Rechazado' ? (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold flex items-center gap-1 flex-shrink-0">
                      <ArrowLeftRight className="w-3 h-3" /> Buscando Reemplazo
                    </span>
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold flex-shrink-0">
                      Pendiente
                    </span>
                  )}
                </div>

                {/* Shift Item Oct 19 */}
                <div
                  onClick={() => setSelectedCalendarDay(19)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                    selectedCalendarDay === 19 ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-100 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-1.5 h-8 rounded-full bg-emerald-600 flex-shrink-0"></div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-slate-900 font-semibold truncate">
                        Domingo 19 Oct · 10:00 AM
                      </span>
                      <span className="text-[11px] text-slate-500 truncate">
                        Niños (6-8 años) · Central
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1 flex-shrink-0">
                    <Check className="w-3 h-3" /> Confirmado
                  </span>
                </div>

                {/* Shift Item Oct 26 */}
                <div
                  onClick={() => setSelectedCalendarDay(26)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                    selectedCalendarDay === 26 ? 'bg-blue-50/60 border-blue-200' : 'bg-slate-50 border-slate-100 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-1.5 h-8 rounded-full bg-indigo-500 flex-shrink-0"></div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-slate-900 font-semibold truncate">
                        Sábado 26 Oct · 04:00 PM
                      </span>
                      <span className="text-[11px] text-slate-500 truncate">
                        Capacitación Líderes de Niños
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold flex items-center gap-1 flex-shrink-0">
                    Convocatoria
                  </span>
                </div>
              </div>
            </section>

            {/* Service History & Recognition Milestone Card */}
            <section className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white rounded-xl p-3.5 border border-emerald-200/80 shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 shadow-xs border border-emerald-200">
                <Award className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-slate-900 font-bold">24 turnos cumplidos</span>
                  <span className="text-amber-500 font-bold select-none text-base">★</span>
                </div>
                <p className="text-xs text-slate-600 truncate mt-0.5">
                  Nivel: <span className="font-semibold text-blue-900">Fiel Servidor 2024</span> · 100% puntualidad
                </p>
              </div>
            </section>
          </main>
        )}

        {/* Tab 2: Calendario Completo */}
        {activeTab === 'calendario' && (
          <main className="flex-1 px-4 py-4 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Todos mis turnos programados</h3>
              <p className="text-xs text-slate-500 mb-3">
                Listado detallado de tus servicios del trimestre en {activeCampus === 'todas' ? 'todas las sedes' : activeCampus}.
              </p>
              <div className="space-y-2.5">
                {userAssignments.map((asg) => (
                  <div key={asg.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{asg.roleName}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
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
                    <p className="text-[11px] text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {asg.id.includes('12') ? 'Dom 12 Oct · 10:00 AM' : asg.id.includes('19') ? 'Dom 19 Oct · 10:00 AM' : 'Sáb 26 Oct · 04:00 PM'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Coordinadora: {asg.coordinatorName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* Tab 3: Mensajes */}
        {activeTab === 'mensajes' && (
          <main className="flex-1 px-4 py-4 space-y-3">
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsxvoyPntrjaqu3Vylm3Ynk7DHPq6KTgKLKLH-gnpoLJ2IgjhPKuruSrpGdseT1oXWB8ttdVSXfqm0o_ClkjTfUJ-PXOvuYVrC2uDi9Vcu1CqlCuy0FuaMkphc-bfOQD3SbW5__Gio-uV2LmcfjibIZZLy2LIhue2mec_F-vl-ysYcSXSzyOs7ENnZd7k3NYCWOJf1_wJaOfVCd7CGXhtoVQIMGvU8I3NKJAI7NSQp5u6lJ5Jx0688"
                  alt="Pastora Laura"
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-blue-100"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">Pastora Laura Gómez</span>
                  <span className="text-[11px] text-emerald-600 font-medium">Coordinadora de Niños &amp; Familia · En línea</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-64 overflow-y-auto py-3 space-y-2.5">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'Mateo' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${
                        msg.sender === 'Mateo'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSendChat} className="flex gap-1.5 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="Escribe un mensaje a la coordinadora..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </main>
        )}

        {/* Tab 4: Perfil */}
        {activeTab === 'perfil' && (
          <main className="flex-1 px-4 py-4 space-y-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-blue-50 shadow-sm"
              />
              <h3 className="text-base font-bold text-slate-900 mt-2">{user.name}</h3>
              <p className="text-xs text-slate-500">{user.roleTitle}</p>
              <div className="mt-3 flex justify-center gap-2">
                <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                  {user.ministry}
                </span>
                <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-medium">
                  {user.campus}
                </span>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4 grid grid-cols-2 gap-3 text-left">
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Turnos Realizados</span>
                  <p className="text-base font-bold text-slate-800">{user.turnosCumplidos}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Puntualidad</span>
                  <p className="text-base font-bold text-emerald-700">100%</p>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* Bottom Navigation Bar matching Stitch mockup */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto w-full z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
          <div className="flex justify-around items-center h-16 px-4">
            <button
              type="button"
              onClick={() => setActiveTab('inicio')}
              className={`flex flex-col items-center justify-center w-14 h-12 transition-colors ${
                activeTab === 'inicio' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-1">Inicio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('calendario')}
              className={`flex flex-col items-center justify-center w-14 h-12 transition-colors ${
                activeTab === 'calendario' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-1">Calendario</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('mensajes')}
              className={`relative flex flex-col items-center justify-center w-14 h-12 transition-colors ${
                activeTab === 'mensajes' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-1 right-2.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-bold">
                3
              </span>
              <span className="text-[10px] font-semibold mt-1">Mensajes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('perfil')}
              className={`flex flex-col items-center justify-center w-14 h-12 transition-colors ${
                activeTab === 'perfil' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-1">Perfil</span>
            </button>
          </div>
        </nav>

        {/* Modal: Solicitar Reemplazo */}
        {isReplacementModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <ArrowLeftRight className="w-4 h-4" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Solicitar Reemplazo</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReplacementModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600">
                Notificaremos al equipo de coordinación y a los maestros disponibles para el turno del{' '}
                <strong className="text-slate-900">Dom 12 Oct (10:00 AM)</strong>.
              </p>

              <form onSubmit={handleReplacementSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="replace-reason" className="text-xs font-semibold text-slate-700">
                    Motivo principal
                  </label>
                  <select
                    id="replace-reason"
                    value={replacementReason}
                    onChange={(e) => setReplacementReason(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Salud / Reposo">Motivos de Salud / Reposo médico</option>
                    <option value="Viaje Inesperado">Viaje Inesperado / Familiar</option>
                    <option value="Compromiso Laboral / Académico">Compromiso Laboral / Examen</option>
                    <option value="Otro Motivo Personal">Otro Motivo de Fuerza Mayor</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="replace-notes" className="text-xs font-semibold text-slate-700">
                    Detalles para el suplente (opcional)
                  </label>
                  <textarea
                    id="replace-notes"
                    rows={2}
                    placeholder="Ej. Dejo la lección fotocopiada en la carpeta del aula 2."
                    value={replacementNotes}
                    onChange={(e) => setReplacementNotes(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReplacementModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Solicitud</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Quick Chat with Coordinator */}
        {isChatOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl p-4 shadow-2xl flex flex-col h-[480px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsxvoyPntrjaqu3Vylm3Ynk7DHPq6KTgKLKLH-gnpoLJ2IgjhPKuruSrpGdseT1oXWB8ttdVSXfqm0o_ClkjTfUJ-PXOvuYVrC2uDi9Vcu1CqlCuy0FuaMkphc-bfOQD3SbW5__Gio-uV2LmcfjibIZZLy2LIhue2mec_F-vl-ysYcSXSzyOs7ENnZd7k3NYCWOJf1_wJaOfVCd7CGXhtoVQIMGvU8I3NKJAI7NSQp5u6lJ5Jx0688"
                    alt="Laura Gómez"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Pastora Laura Gómez</h4>
                    <span className="text-[10px] text-emerald-600">Coordinadora de Niños &amp; Familia</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChatOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 space-y-2">
                {chatHistory.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.sender === 'Mateo' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${
                        m.sender === 'Mateo'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5">{m.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-semibold"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
  );
};
