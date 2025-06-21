-- Drop existing policies on scam_types
DROP POLICY IF EXISTS "Allow public read access to scam_types" ON public.scam_types;
DROP POLICY IF EXISTS "Allow admin write access to scam_types" ON public.scam_types;
DROP POLICY IF EXISTS "All authenticated users can view scam types" ON public.scam_types;
DROP POLICY IF EXISTS "Admins can manage scam types" ON public.scam_types;
DROP POLICY IF EXISTS "service_role_full_access_scam_types" ON public.scam_types;
DROP POLICY IF EXISTS "authenticated_read_scam_types" ON public.scam_types;

-- Enable RLS
ALTER TABLE public.scam_types ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Enable read access for all authenticated users"
ON public.scam_types FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users only"
ON public.scam_types FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "Enable update for authenticated users only"
ON public.scam_types FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "Enable delete for authenticated users only"
ON public.scam_types FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Grant necessary permissions
GRANT ALL ON public.scam_types TO authenticated;
GRANT USAGE ON SEQUENCE public.scam_types_id_seq TO authenticated; 