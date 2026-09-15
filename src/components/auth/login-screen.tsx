import { useState } from 'react';
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface LoginScreenProps {
  onLogin: () => void;
  onGoToSignup: () => void;
  onForgotPassword: () => void;
}

export function LoginScreen({ onLogin, onGoToSignup, onForgotPassword }: LoginScreenProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.brandRow}>
          <Image source={require('@/assets/images/logo/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.brandName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>NearbyPay</Text>
        </View>

        <View style={styles.content}>
          <ThemedText style={styles.title}>Welcome back</ThemedText>
          <Text style={[styles.subtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            Sign in to manage your wallet and quick transfers.
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: isDark ? '#E2E8F0' : '#334155' }]}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="name@email.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  borderColor: isDark ? '#1E293B' : '#E2E8F0',
                  color: isDark ? '#F8FAFC' : '#0F172A',
                },
              ]}
            />
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: isDark ? '#E2E8F0' : '#334155' }]}>Password</Text>
              <TouchableOpacity onPress={onForgotPassword}>
                <Text style={styles.inlineLink}>Forgot?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                  borderColor: isDark ? '#1E293B' : '#E2E8F0',
                  color: isDark ? '#F8FAFC' : '#0F172A',
                },
              ]}
            />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={onLogin} activeOpacity={0.9}>
            <Text style={styles.primaryButtonText}>Log In</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: isDark ? '#94A3B8' : '#64748B' }]}>New here?</Text>
            <TouchableOpacity onPress={onGoToSignup}>
              <Text style={styles.linkText}>Create account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    gap: 7,
  },
  logo: {
    width: 28,
    height: 28,
  },
  brandName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 17,
    letterSpacing: -0.2,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    gap: 14,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    lineHeight: 19,
  },
  fieldGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11.5,
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    minHeight: 44,
  },
  inlineLink: {
    color: '#2B20F0',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11.5,
  },
  primaryButton: {
    marginTop: 4,
    backgroundColor: '#2B20F0',
    borderRadius: 13,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2B20F0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(148,163,184,0.15)',
    width: '100%',
    marginTop: 6,
    marginBottom: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  footerText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
  },
  linkText: {
    color: '#2B20F0',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
  },
});
