-- Buat table
CREATE TABLE public.products (
  id SERIAL NOT NULL,
  name TEXT,
  description TEXT,
  price NUMERIC,
  discount NUMERIC,
  image_url TEXT,
  category TEXT,
  is_available BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Enable RLS (LENGKAP dengan kata SECURITY)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;