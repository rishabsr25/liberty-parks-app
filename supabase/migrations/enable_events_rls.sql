-- Enable RLS on events just in case it isn't completely configured
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read events
CREATE POLICY "Enable read access for all users" 
  ON "public"."events"
  AS PERMISSIVE FOR SELECT
  TO public
  USING (true);

-- Allow admins to insert events
CREATE POLICY "Enable insert for authenticated admin users only" 
  ON "public"."events"
  AS PERMISSIVE FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.admin = true
    )
  );
