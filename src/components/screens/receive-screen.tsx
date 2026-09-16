import { Download01Icon, Share08Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

import { useToast } from '@/components/ui/toast';
import { getAppTheme } from '@/constants/app-theme';

// TODO(api): GET /requests/qr + POST /requests { amountMinor, note }
// Expected: { qrPayload: string, amountMinor: number }

export function ReceiveScreen() {
  const { show } = useToast();
  const isDark = useColorScheme() === 'dark';
  const t = getAppTheme(isDark);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.eyebrow}>RECEIVE</Text>
      <Text style={[styles.title, { color: t.textPrimary }]}>Get paid instantly</Text>
      <Text style={[styles.subtitle, { color: t.textSecondary }]}>
        Share your QR or request a specific amount. Money lands in your NearbyPay wallet.
      </Text>

      <View style={[styles.qrCard, { backgroundColor: t.cardBg, borderColor: t.cardBorder }]}>
        <View style={[styles.qrBox, { backgroundColor: t.pageBg, borderColor: t.cardBorder }]}>
          <Text style={styles.qrPlaceholder}>QR</Text>
        </View>
        <Text style={[styles.qrName, { color: t.textPrimary }]}>Chinedu Okafor</Text>
        <Text style={[styles.qrHandle, { color: t.textSecondary }]}>@chinedu • NPP-88231</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => show({ message: 'Amount request opened.', variant: 'info' })}>
          <HugeiconsIcon icon={Download01Icon} size={16} color="#FFFFFF" />
          <Text style={styles.primaryText}>Request amount</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryBtn, { backgroundColor: t.cardBg, borderColor: t.cardBorder }]}
          activeOpacity={0.85}
          onPress={() => show({ message: 'Share link copied.', variant: 'success' })}>
          <HugeiconsIcon icon={Share08Icon} size={16} color="#2146EB" />
          <Text style={styles.secondaryText}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, gap: 10 },
  eyebrow: { fontFamily: 'Montserrat_700Bold', fontSize: 11, letterSpacing: 1.2, color: '#4F46E5' },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 24, letterSpacing: -0.5 },
  subtitle: { fontFamily: 'Montserrat_400Regular', fontSize: 13, lineHeight: 19 },
  qrCard: {
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 24,
    gap: 6,
    marginTop: 8,
  },
  qrBox: {
    width: 160,
    height: 160,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPlaceholder: { fontFamily: 'Montserrat_700Bold', fontSize: 32, color: '#2146EB' },
  qrName: { fontFamily: 'Montserrat_700Bold', fontSize: 15 },
  qrHandle: { fontFamily: 'Montserrat_500Medium', fontSize: 12 },
  row: { flexDirection: 'row', gap: 10, marginTop: 8 },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2B20F0',
    borderRadius: 16,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryText: { color: '#FFF', fontFamily: 'Montserrat_700Bold', fontSize: 14 },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryText: { color: '#2146EB', fontFamily: 'Montserrat_700Bold', fontSize: 14 },
});
