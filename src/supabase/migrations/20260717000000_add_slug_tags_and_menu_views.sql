-- Polish public menu URLs, item metadata, and lightweight scan analytics.

ALTER TABLE public.cafes
  ADD COLUMN IF NOT EXISTS slug TEXT;

WITH base_slugs AS (
  SELECT
    id,
    COALESCE(
      NULLIF(
        trim(both '-' from lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))),
        ''
      ),
      'cafe'
    ) AS base_slug,
    row_number() OVER (
      PARTITION BY COALESCE(
        NULLIF(
          trim(both '-' from lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))),
          ''
        ),
        'cafe'
      )
      ORDER BY created_at, id
    ) AS slug_rank
  FROM public.cafes
  WHERE slug IS NULL OR slug = ''
)
UPDATE public.cafes AS c
SET slug = CASE
  WHEN b.slug_rank = 1 THEN b.base_slug
  ELSE b.base_slug || '-' || b.slug_rank
END
FROM base_slugs b
WHERE c.id = b.id;

ALTER TABLE public.cafes
  ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS cafes_slug_unique_idx
  ON public.cafes (slug);

ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS allergens TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS dietary_tags TEXT[] NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS public.menu_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cafe_id UUID NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  referrer TEXT,
  user_agent TEXT
);

ALTER TABLE public.menu_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record menu views"
ON public.menu_views
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view menu views for their cafes"
ON public.menu_views
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.cafes
    WHERE cafes.id = menu_views.cafe_id
      AND cafes.user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view public cafes"
ON public.cafes
FOR SELECT
USING (true);

CREATE POLICY "Anyone can view public menu categories"
ON public.menu_categories
FOR SELECT
USING (true);

CREATE POLICY "Anyone can view public menu items"
ON public.menu_items
FOR SELECT
USING (true);
