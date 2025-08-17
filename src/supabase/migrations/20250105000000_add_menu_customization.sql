-- Add menu customization fields to cafes table
ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS menu_design JSONB DEFAULT '{}';

-- Add comment for the new column
COMMENT ON COLUMN public.cafes.menu_design IS 'Stores menu design customization settings including colors, backgrounds, fonts, etc.';

-- Example structure for menu_design field:
-- {
--   "background": {
--     "type": "color" | "gradient" | "image",
--     "value": "#ffffff" | "linear-gradient(...)" | "url(...)"
--   },
--   "colors": {
--     "primary": "#000000",
--     "secondary": "#666666",
--     "accent": "#ff6b35",
--     "text": "#333333",
--     "textMuted": "#888888",
--     "cardBackground": "#ffffff",
--     "cardBorder": "#e5e5e5"
--   },
--   "typography": {
--     "fontFamily": "Inter",
--     "headingSize": "large" | "medium" | "small",
--     "bodySize": "large" | "medium" | "small"
--   },
--   "layout": {
--     "cardStyle": "modern" | "classic" | "minimal",
--     "spacing": "comfortable" | "compact" | "relaxed"
--   }
-- }
