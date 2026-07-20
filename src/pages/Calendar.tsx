import { CALENDAR_ENABLED } from '@/config/features';
import EventCalendarPage from '@/pages/EventCalendarPage';
import CalendarRetiredNotice from '@/pages/CalendarRetiredNotice';

export default function CalendarPage() {
  if (CALENDAR_ENABLED) {
    return <EventCalendarPage />;
  }

  return <CalendarRetiredNotice />;
}
