// Shared NearbyPay theme tokens — same values used on login/signup/forgot.
// Use via `getAppTheme(isDark)` so Home/History/Tabs match auth exactly.

export interface AppTheme {
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  inputBg: string;
  inputBorder: string;
  textPrimary: string;
  textSecondary: string;
  muted: string;
  iconColor: string;
  divider: string;
}

export function getAppTheme(isDark: boolean): AppTheme {
  return {
    pageBg: isDark ? '#020617' : '#EEF3FC',
    cardBg: isDark ? '#0F172A' : '#FFFFFF',
    cardBorder: isDark ? '#1E293B' : '#E4EAF6',
    inputBg: isDark ? '#020617' : '#F8FAFC',
    inputBorder: isDark ? '#1E293B' : '#E2E8F0',
    textPrimary: isDark ? '#F8FAFC' : '#0A1E3C',
    textSecondary: isDark ? '#94A3B8' : '#5A6F8A',
    muted: isDark ? '#64748B' : '#64748B',
    iconColor: isDark ? '#94A3B8' : '#627694',
    divider: isDark ? '#1E293B' : 'rgba(226, 232, 240, 0.7)',
  };
}
