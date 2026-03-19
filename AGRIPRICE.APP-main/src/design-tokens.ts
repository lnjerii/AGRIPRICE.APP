// design-tokens.ts
export const colors = {
  primary: '#2FA44F',
  primaryDark: '#238a3f',
  background: '#FFFFFF',
  text: '#1f4d2d',
  muted: '#3f7a52',
  success: '#16A34A',
  error: '#DC2626',
  info: '#2563EB',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  sizes: {
    body: 14,
    bodyLg: 16,
    subhead: 18,
    h4: 24,
    h3: 32,
    h2: 40,
    h1: 56,
  },
};

export const radius = {
  card: 8,
  input: 6,
  pill: 999,
};

export default { colors, spacing, typography, radius };

