// src/renderer/pages/appointments/calendar/components/CalendarView.tsx
import React, { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { AppointmentResponseDto } from '../../../../api/core/appointments';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface CalendarViewProps {
  appointments: AppointmentResponseDto[];
  loading: boolean;
  currentDate: Date;
  onNavigate: (date: Date, view?: string) => void;
  onSelectEvent: (appointment: AppointmentResponseDto) => void;
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  loading,
  currentDate,
  onNavigate,
  onSelectEvent,
  onSelectSlot,
}) => {
  const events = useMemo(() => {
    return appointments.map((apt) => ({
      id: apt.id,
      title: `${apt.clientName} - ${apt.treatmentName}`,
      start: new Date(apt.appointmentDateTime),
      end: new Date(new Date(apt.appointmentDateTime).getTime() + apt.durationMinutes * 60000),
      resource: apt,
    }));
  }, [appointments]);

  return (
    <div className="h-full bg-[var(--card-bg)] rounded-xl p-4 border border-[var(--border-color)]">
      {loading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-xl z-10">
          <div className="bg-[var(--card-bg)] p-4 rounded-lg shadow-lg">Loading...</div>
        </div>
      )}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 180px)' }}
        date={currentDate}
        onNavigate={onNavigate}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        selectable={true}
        views={['month', 'week', 'day']}
        defaultView={Views.MONTH}
        popup
        messages={{
          next: 'Next',
          previous: 'Previous',
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
        }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: 'var(--primary-color)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
          },
        })}
      />
    </div>
  );
};

export default CalendarView;