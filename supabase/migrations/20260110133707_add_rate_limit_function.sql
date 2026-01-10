-- Create the rate_limits table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id BIGSERIAL PRIMARY KEY,
  ip TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_action_created_at 
ON public.rate_limits (ip, action, created_at DESC);

-- Create the rate limit check function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_ip TEXT,
  p_action TEXT,
  p_max INT,
  p_window INTERVAL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM rate_limits
  WHERE ip = p_ip
    AND action = p_action
    AND created_at >= NOW() - p_window;

  IF v_count >= p_max THEN
    RETURN FALSE;
  END IF;

  INSERT INTO rate_limits (ip, action)
  VALUES (p_ip, p_action);

  RETURN TRUE;
END;
$$;