/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CampusId, ChurchEvent, RosterAssignment, ToastMessage, UserRole } from './types';
import { INITIAL_ASSIGNMENTS, INITIAL_EVENTS, MOCK_USERS, VOLUNTEER_DATABASE } from './mockData';
import { RoleTestingBar } from './components/RoleTestingBar';
import { VolunteerView } from './components/VolunteerView';
import { LeaderView } from './components/LeaderView';
import { AdminView } from './components/AdminView';
import { ToastContainer } from './components/ToastContainer';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('volunteer');
  const [currentCampus, setCurrentCampus] = useState<CampusId>('central');
  const [events, setEvents] = useState<ChurchEvent[]>(INITIAL_EVENTS);
  const [assignments, setAssignments] = useState<RosterAssignment[]>(INITIAL_ASSIGNMENTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Helper to add animated toast notification
  const addToast = (type: ToastMessage['type'], title: string, description: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Volunteer Flow: Confirm Attendance
  const handleConfirmAttendance = (assignmentId: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, status: 'Confirmado' } : a))
    );
    addToast(
      'success',
      '¡Asistencia Confirmada!',
      'Tu asistencia ha sido confirmada en el Roster General para el Dom 12 Oct.'
    );
  };

  // 2. Volunteer Flow: Request Replacement
  const handleRequestReplacement = (assignmentId: string, reason: string, notes: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              status: 'Rechazado',
              replacementReason: reason,
              replacementNotes: notes,
              requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : a
      )
    );
    addToast(
      'warning',
      'Reemplazo Solicitado',
      `Alerta transmitida a la Pastora Laura Gómez. La IA ha activado la búsqueda de suplente (${reason}).`
    );
  };

  // 3. Undo status / Reset to Pendiente
  const handleUndoStatus = (assignmentId: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, status: 'Pendiente' } : a))
    );
    addToast('info', 'Turno Modificado', 'El estado del turno ha vuelto a Pendiente.');
  };

  // 4. Leader Flow: Manual cell update in Roster Matrix
  const handleUpdateAssignmentStatus = (
    assignmentId: string,
    newStatus: 'Confirmado' | 'Pendiente' | 'Rechazado'
  ) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, status: newStatus } : a))
    );
    addToast('info', 'Estado Actualizado', `El turno ahora figura como ${newStatus}.`);
  };

  // 5. Leader Flow: Accept AI Antigravity Suggestion
  const handleAcceptAiSuggestion = (
    vacantAssignmentId: string,
    volunteerId: string,
    volunteerName: string
  ) => {
    const candidate = VOLUNTEER_DATABASE.find((v) => v.id === volunteerId);

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === vacantAssignmentId
          ? {
              ...a,
              volunteerId,
              volunteerName,
              volunteerAvatar: candidate?.avatar || '',
              status: 'Confirmado',
              aiSuggested: true,
            }
          : a
      )
    );

    addToast(
      'success',
      '✨ Sugerencia AI Aplicada con Éxito',
      `Se asignó y confirmó automáticamente a ${volunteerName} para cubrir la vacante.`
    );
  };

  // 6. Superadmin Flow: Add New Event
  const handleAddEvent = (newEventData: Omit<ChurchEvent, 'id'>) => {
    const newEventId = `evt-${Date.now()}`;
    const newEvent: ChurchEvent = {
      ...newEventData,
      id: newEventId,
    };

    setEvents((prev) => [newEvent, ...prev]);

    // Automatically seed 2 empty/pending roster slots for this new event
    const newSlots: RosterAssignment[] = [
      {
        id: `asg-${Date.now()}-1`,
        eventId: newEventId,
        volunteerId: 'vol-maria',
        volunteerName: 'María Pérez',
        volunteerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        ministry: 'Niños & Familia',
        roleName: 'Maestra de Aula',
        status: 'Pendiente',
        coordinatorName: 'Pastora Laura Gómez',
        coordinatorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsxvoyPntrjaqu3Vylm3Ynk7DHPq6KTgKLKLH-gnpoLJ2IgjhPKuruSrpGdseT1oXWB8ttdVSXfqm0o_ClkjTfUJ-PXOvuYVrC2uDi9Vcu1CqlCuy0FuaMkphc-bfOQD3SbW5__Gio-uV2LmcfjibIZZLy2LIhue2mec_F-vl-ysYcSXSzyOs7ENnZd7k3NYCWOJf1_wJaOfVCd7CGXhtoVQIMGvU8I3NKJAI7NSQp5u6lJ5Jx0688',
      },
      {
        id: `asg-${Date.now()}-2`,
        eventId: newEventId,
        volunteerId: 'vol-carlos',
        volunteerName: 'Carlos Ruiz',
        volunteerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        ministry: 'Alabanza & Adoración',
        roleName: 'Batería',
        status: 'Pendiente',
        coordinatorName: 'Pastora Laura Gómez',
        coordinatorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsxvoyPntrjaqu3Vylm3Ynk7DHPq6KTgKLKLH-gnpoLJ2IgjhPKuruSrpGdseT1oXWB8ttdVSXfqm0o_ClkjTfUJ-PXOvuYVrC2uDi9Vcu1CqlCuy0FuaMkphc-bfOQD3SbW5__Gio-uV2LmcfjibIZZLy2LIhue2mec_F-vl-ysYcSXSzyOs7ENnZd7k3NYCWOJf1_wJaOfVCd7CGXhtoVQIMGvU8I3NKJAI7NSQp5u6lJ5Jx0688',
      },
    ];

    setAssignments((prev) => [...prev, ...newSlots]);

    addToast(
      'success',
      'Culto Programado',
      `"${newEvent.title}" se agregó al calendario consolidado con cupo de ${newEvent.requiredVolunteers} servidores.`
    );
  };

  // Reset to initial demo data
  const handleResetData = () => {
    setEvents(INITIAL_EVENTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    addToast('info', 'Demostración Restablecida', 'Los datos del prototipo han vuelto a su estado inicial.');
  };

  const pendingReplacementsCount = assignments.filter((a) => a.status === 'Rechazado').length;
  const currentUser = MOCK_USERS[currentRole];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      {/* 1. Top Testing Role Bar */}
      <RoleTestingBar
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        currentCampus={currentCampus}
        onSelectCampus={setCurrentCampus}
        onResetData={handleResetData}
        pendingReplacementsCount={pendingReplacementsCount}
      />

      {/* 2. Main Active Role View (Native Mobile Format) */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto bg-white min-h-screen relative shadow-sm">
        {currentRole === 'volunteer' && (
          <VolunteerView
            user={currentUser}
            events={events}
            assignments={assignments}
            onConfirmAttendance={handleConfirmAttendance}
            onRequestReplacement={handleRequestReplacement}
            onUndoStatus={handleUndoStatus}
            activeCampus={currentCampus}
          />
        )}

        {currentRole === 'leader' && (
          <LeaderView
            user={currentUser}
            events={events}
            assignments={assignments}
            onUpdateAssignmentStatus={handleUpdateAssignmentStatus}
            onAcceptAiSuggestion={handleAcceptAiSuggestion}
            activeCampus={currentCampus}
          />
        )}

        {currentRole === 'superadmin' && (
          <AdminView
            user={currentUser}
            events={events}
            assignments={assignments}
            onAddEvent={handleAddEvent}
            activeCampus={currentCampus}
          />
        )}
      </div>

      {/* 3. Global Toast Notifications Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
