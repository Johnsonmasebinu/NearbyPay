import {
    AddIcon,
    Clock01Icon,
    Home01Icon,
    Sent02Icon,
    UserIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Platform, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { getAppTheme } from '@/constants/app-theme';

export type MainTabKey = 'home' | 'receive' | 'send' | 'history' | 'profile';

const LEFT_TABS: { id: MainTabKey; label: string; icon: typeof Home01Icon }[] = [
  { id: 'home', label: 'Home', icon: Home01Icon },
  { id: 'receive', label: 'Receive', icon: AddIcon },
];

const RIGHT_TABS: { id: MainTabKey; label: string; icon: typeof Home01Icon }[] = [
  { id: 'history', label: 'History', icon: Clock01Icon },
  { id: 'profile', label: 'Profile', icon: UserIcon },
];

interface BottomTabsProps {
  active: MainTabKey;
  onPress: (tab: MainTabKey) => void;
}

export function BottomTabs({ active, onPress }: BottomTabsProps) {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const t = getAppTheme(isDark);
  const inactiveColor = isDark ? '#94A3B8' : '#627694';

  const renderItem = ({ id, label, icon }: { id: MainTabKey; label: string; icon: typeof Home01Icon }) => {
    const isActive = active === id;
    return (
      <TouchableOpacity
        key={id}
        style={[styles.navItem, isActive && styles.navItemActive]}
        activeOpacity={0.8}
        onPress={() => onPress(id)}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={label}>
        <HugeiconsIcon icon={icon} size={isActive ? 18 : 20} color={isActive ? '#FFFFFF' : inactiveColor} />
        <Text style={[styles.navLabel, { color: inactiveColor }, isActive && styles.navLabelActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.bottomNavWrap}>
      <View
        style={[
          styles.bottomNav,
          { backgroundColor: t.cardBg, borderTopColor: t.cardBorder, paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 8 : 6) },
        ]}>
        {LEFT_TABS.map(renderItem)}
        <View style={styles.fabSlot} />
        {RIGHT_TABS.map(renderItem)}
      </View>

      <TouchableOpacity
        style={[styles.fab, { borderColor: t.pageBg }]}
        activeOpacity={0.85}
        onPress={() => onPress('send')}
        accessibilityRole="tab"
        accessibilityState={{ selected: active === 'send' }}
        accessibilityLabel="Send">
        <Svg style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="fabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#3B66FF" />
              <Stop offset="100%" stopColor="#112CC9" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" rx={30} fill="url(#fabGrad)" />
        </Svg>
        <View style={styles.fabRing} pointerEvents="none" />
        <HugeiconsIcon icon={Sent02Icon} size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavWrap: {
    position: 'relative',
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 8,
    paddingHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#0A2045',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: '#0A2045',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
    }),
  },
  fabSlot: {
    width: 72,
  },
  fab: {
    position: 'absolute',
    top: -30,
    alignSelf: 'center',
    width: 62,
    height: 62,
    borderRadius: 31,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#1E44F8',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
      android: {
        elevation: 10,
      },
      web: {
        shadowColor: '#1E44F8',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
    }),
  },
  fabRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    gap: 3,
  },
  navItemActive: {
    backgroundColor: '#4B49F0',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  navLabel: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 9,
  },
  navLabelActive: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#FFFFFF',
  },
});
