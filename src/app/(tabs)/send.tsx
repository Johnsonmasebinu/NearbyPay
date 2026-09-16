import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SendScreen } from '@/components/screens/send-screen';
import { getAppTheme } from '@/constants/app-theme';

export default function SendTab() {
  const isDark = useColorScheme() === 'dark';
  const t = getAppTheme(isDark);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: t.pageBg }]} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={[styles.container, { backgroundColor: t.pageBg }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <SendScreen />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, width: '100%', maxWidth: 440, alignSelf: 'center' },
  scroll: { flex: 1 },
  content: { flexGrow: 1 },
});
