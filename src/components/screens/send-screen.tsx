import { Contact01Icon, Sent02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';

import { useToast } from '@/components/ui/toast';
import { getAppTheme } from '@/constants/app-theme';

// TODO(api): POST /transfers { toUserId, amountMinor, note } -> Transaction
// Errors: 400 INVALID_AMOUNT, 402 INSUFFICIENT_FUNDS, 401 UNAUTHORIZED

const CONTACTS = [
  { id: '1', name: 'Tunde Adeboyo', handle: '@tunde' },
  { id: '2', name: 'Bisi Lawal', handle: '@bisi' },
  { id: '3', name: 'Family Group', handle: '@family' },
];

export function SendScreen() {
  const { show } = useToast();
  const isDark = useColorScheme() === 'dark';
  const t = getAppTheme(isDark);
  const [amount, setAmount] = useState('');
  const [selected, setSelected] = useState('1');

  return (
    <View style={styles.content}>
      <Text style={styles.eyebrow}>SEND</Text>
      <Text style={[styles.title, { color: t.textPrimary }]}>Who are you paying?</Text>
      <Text style={[styles.subtitle, { color: t.textSecondary }]}>Pick a person nearby, then enter an amount.</Text>

      <View style={styles.contactList}>
        {CONTACTS.map((c) => {
          const isActive = selected === c.id;
          return (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.contact,
                { backgroundColor: t.cardBg, borderColor: isActive ? '#2B20F0' : t.cardBorder },
              ]}
              activeOpacity={0.8}
              onPress={() => setSelected(c.id)}>
              <View style={[styles.avatar, { backgroundColor: t.pageBg }]}>
                <HugeiconsIcon icon={Contact01Icon} size={18} color={isActive ? '#2B20F0' : t.iconColor} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactName, { color: t.textPrimary }]}>{c.name}</Text>
                <Text style={[styles.contactHandle, { color: t.textSecondary }]}>{c.handle}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.label, { color: t.textPrimary }]}>Amount (₦)</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="5,000"
        keyboardType="numeric"
        placeholderTextColor={t.muted}
        style={[styles.input, { backgroundColor: t.cardBg, borderColor: t.cardBorder, color: t.textPrimary }]}
      />

      <TouchableOpacity
        style={styles.primaryBtn}
        activeOpacity={0.88}
        onPress={() => show({ message: `Sending ₦${amount || '0'} — connect backend to complete.`, variant: 'info' })}>
        <HugeiconsIcon icon={Sent02Icon} size={16} color="#FFFFFF" />
        <Text style={styles.primaryText}>Send money</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, gap: 10 },
  eyebrow: { fontFamily: 'Montserrat_700Bold', fontSize: 11, letterSpacing: 1.2, color: '#4F46E5' },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 24, letterSpacing: -0.5 },
  subtitle: { fontFamily: 'Montserrat_400Regular', fontSize: 13, lineHeight: 19 },
  contactList: { gap: 8, marginTop: 8 },
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: { flex: 1 },
  contactName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13 },
  contactHandle: { fontFamily: 'Montserrat_400Regular', fontSize: 11 },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, marginTop: 6 },
  input: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 52,
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: '#2B20F0',
    borderRadius: 16,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
  },
  primaryText: { color: '#FFF', fontFamily: 'Montserrat_700Bold', fontSize: 15 },
});
