-- Enable pg_cron for scheduled cleanup (Supabase Cron).
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Delete calendar events whose date is more than 3 days in the past.
CREATE OR REPLACE FUNCTION public.delete_expired_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.events
  WHERE date::date < (CURRENT_DATE - INTERVAL '3 days');
END;
$$;

-- Run cleanup daily at 3:00 AM UTC (Supabase Cron / pg_cron).
SELECT cron.schedule(
  'delete-expired-calendar-events',
  '0 3 * * *',
  $$SELECT public.delete_expired_events()$$
);
