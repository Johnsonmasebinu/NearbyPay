import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeDashboard } from '@/components/home-dashboard';
import { getAppTheme } from '@/constants/app-theme';

export default function HomeTab() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';
  const t = getAppTheme(isDark);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: t.pageBg }]} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={[styles.container, { backgroundColor: t.pageBg }]}>
        <HomeDashboard
          onNavigate={(tab) => router.navigate(`/(tabs)/${tab}` as `/(tabs)/${'send' | 'receive' | 'history'}`)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, width: '100%', maxWidth: 440, alignSelf: 'center' },
});
