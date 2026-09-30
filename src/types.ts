export type CampusId = 'central' | 'norte' | 'todas';

export type UserRole = 'superadmin' | 'leader' | 'volunteer';

export type ShiftStatus = 'Confirmado' | 'Pendiente' | 'Rechazado';

export type Ministry = 'Niños & Familia' | 'Alabanza & Adoración' | 'Protocolo' | 'Multimedia' | 'Pastoral';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  campus: 'Sede Central' | 'Sede Norte';
  ministry: Ministry;
  avatar: string;
  phone?: string;
  status: 'Activo' | 'En Pausa';
  turnosCumplidos: number;
}

export interface ChurchEvent {
  id: string;
  title: string;
  campus: 'Sede Central' | 'Sede Norte';
  locationDetail: string;
  date: string; // YYYY-MM-DD
  dateFormatted: string; // e.g., "Domingo 12 Oct"
  time: string; // "10:00 AM"
  arrivalPrayerTime: string; // "9:15 AM"
  category: 'Culto Regular' | 'Servicio Juvenil' | 'Capacitación' | 'Especial';
  requiredVolunteers: number;
  description?: string;
}

export interface RosterAssignment {
  id: string;
  eventId: string;
  volunteerId: string;
  volunteerName: string;
  volunteerAvatar: string;
  ministry: Ministry;
  roleName: string; // e.g., "Maestro Principal (Grupo 6–8 años)", "Voz Líder", "Batería"
  theme?: string; // e.g., "«El valor de compartir historias»"
  status: ShiftStatus;
  coordinatorName: string;
  coordinatorAvatar: string;
  replacementReason?: string;
  replacementNotes?: string;
  requestedAt?: string;
  aiSuggested?: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
}
