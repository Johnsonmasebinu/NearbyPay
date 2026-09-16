import { Logout01Icon, Settings01Icon, Tick02Icon, UserIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

import { useToast } from '@/components/ui/toast';
import { getAppTheme } from '@/constants/app-theme';

// TODO(api): GET /me -> User, PATCH /me/preferences, POST /auth/logout

export function ProfileScreen() {
  const { show } = useToast();
  const isDark = useColorScheme() === 'dark';
  const t = getAppTheme(isDark);

  return (
    <View style={styles.content}>
      <Text style={styles.eyebrow}>PROFILE</Text>
      <View style={[styles.card, { backgroundColor: t.cardBg, borderColor: t.cardBorder }]}>
        <View style={[styles.avatar, { backgroundColor: t.pageBg }]}>
          <HugeiconsIcon icon={UserIcon} size={26} color="#2146EB" />
        </View>
        <Text style={[styles.name, { color: t.textPrimary }]}>Chinedu Okafor</Text>
        <Text style={[styles.email, { color: t.textSecondary }]}>chinedu@email.com</Text>
        <View style={styles.badge}>
          <HugeiconsIcon icon={Tick02Icon} size={10} color="#FFFFFF" strokeWidth={3} />
          <Text style={styles.badgeText}>KYC Verified</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.row, { backgroundColor: t.cardBg, borderColor: t.cardBorder }]}
        activeOpacity={0.7}
        onPress={() => show({ message: 'Settings opened.', variant: 'info' })}>
        <HugeiconsIcon icon={Settings01Icon} size={18} color={t.textPrimary} />
        <Text style={[styles.rowText, { color: t.textPrimary }]}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.row, { backgroundColor: t.cardBg, borderColor: '#FECACA' }]}
        activeOpacity={0.7}
        onPress={() => show({ message: 'Logged out (wire backend).', variant: 'info' })}>
        <HugeiconsIcon icon={Logout01Icon} size={18} color="#EF4444" />
        <Text style={[styles.rowText, { color: '#EF4444' }]}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, gap: 10 },
  eyebrow: { fontFamily: 'Montserrat_700Bold', fontSize: 11, letterSpacing: 1.2, color: '#4F46E5' },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  name: { fontFamily: 'Montserrat_700Bold', fontSize: 18 },
  email: { fontFamily: 'Montserrat_400Regular', fontSize: 12 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#16A34A',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 8,
  },
  badgeText: { color: '#FFF', fontFamily: 'Montserrat_600SemiBold', fontSize: 11 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  rowText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
});
