import {
    ArrowRight01Icon,
    Clock01Icon,
    Download01Icon,
    Home01Icon,
    MoreHorizontalIcon,
    Notification03Icon,
    Sent02Icon,
    Tick02Icon,
    UserGroupIcon,
    UserIcon,
    ViewIcon,
    ViewOffSlashIcon,
    Wallet03Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef, useMemo } from 'react';
import {
    Animated,
    Easing,
    Image,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { useToast } from '@/components/ui/toast';
import TransactionHistoryScreen from '@/components/transaction-history';
import WalletScreen from '@/components/wallet-screen';
import ProfileScreen from '@/components/profile-screen';
import { useAppTheme } from '@/hooks/theme-provider';
import { Colors, type ThemeColors } from '@/constants/theme';

type TabKey = 'home' | 'wallet' | 'history' | 'profile';

type StarSpec = {
  id: number;
  left: number;
  top: number;
  size: number;
  drift: number;
  duration: number;
  delay: number;
};

const QUICK_ACTIONS = [
  { id: 'send', label: 'Send', icon: Sent02Icon },
  { id: 'receive', label: 'Receive', icon: Download01Icon },
  { id: 'history', label: 'History', icon: Clock01Icon },
  { id: 'more', label: 'More', icon: MoreHorizontalIcon },
];

const TRANSACTIONS = [
  {
    id: '1',
    title: 'Sent to Tunde Adeboyo',
    date: 'Jun 28, 10:24 AM',
    amount: '- ₦5,000',
    type: 'sent',
    icon: UserIcon,
    iconColor: '#2563EB',
    amountColor: '#EF4444',
  },
  {
    id: '2',
    title: 'Received from Bisi Lawal',
    date: 'Jun 27, 04:12 PM',
    amount: '+ ₦20,000',
    type: 'received',
    icon: Download01Icon,
    iconColor: '#16A34A',
    amountColor: '#16A34A',
  },
  {
    id: '3',
    title: 'Sent to Family',
    date: 'Jun 25, 09:45 PM',
    amount: '- ₦12,500',
    type: 'sent',
    icon: UserGroupIcon,
    iconColor: '#2563EB',
    amountColor: '#EF4444',
  },
];

function TwinklingStar({ star }: { star: StarSpec }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(star.delay * 1000),
      Animated.loop(
        Animated.timing(progress, {
          toValue: 1,
          duration: Math.round(star.duration * 1000),
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ),
    ]);
    animation.start();
    return () => animation.stop();
  }, [progress, star]);

  const opacity = progress.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [0, 0.9, 0],
  });
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -star.drift],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -star.drift * 0.7],
  });
  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: `${star.left}%`,
        top: `${star.top}%`,
        width: star.size,
        height: star.size,
        opacity,
        transform: [{ translateX }, { translateY }, { scale }],
      }}>
      <Svg width={star.size} height={star.size} viewBox="0 0 24 24">
        <Path
          d="M12 0C13.2 6.8 17.2 10.8 24 12C17.2 13.2 13.2 17.2 12 24C10.8 17.2 6.8 13.2 0 12C6.8 10.8 10.8 6.8 12 0Z"
          fill="#FFFFFF"
        />
      </Svg>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { show } = useToast();
  const { colors, isDark } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('home');  const [starPositions, setStarPositions] = useState<StarSpec[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  useEffect(() => {
    const stars: StarSpec[] = [];
    for (let i = 0; i < 6; i++) {
      stars.push({
        id: i,
        left: Math.random() * 16 + 78,
        top: Math.random() * 20 + 66,
        size: Math.random() * 5 + 6,
        drift: Math.random() * 14 + 10,
        duration: Math.random() * 4 + 4,
        delay: Math.random() * 3,
      });
    }
    setStarPositions(stars);
  }, []);

  const handleActionPress = (action: string) => {
    show({
      message: `${action} feature opened.`,
      variant: 'info',
    });
  };

  const navTabs: { id: TabKey; label: string; icon: typeof Home01Icon }[] = [
    { id: 'home', label: 'Home', icon: Home01Icon },
    { id: 'wallet', label: 'Wallet', icon: Wallet03Icon },
    { id: 'history', label: 'History', icon: Clock01Icon },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  const renderNavItem = ({ id, label, icon }: (typeof navTabs)[number]) => {
    const isActive = activeTab === id;
    return (
      <TouchableOpacity
        key={id}
        style={[styles.navItem, isActive && styles.navItemActive]}
        activeOpacity={0.8}
        onPress={() => setActiveTab(id)}>
        <HugeiconsIcon
          icon={icon}
          size={isActive ? 18 : 20}
          color={isActive ? '#FFFFFF' : colors.navIcon}
        />
        <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={styles.container}>
        {activeTab === 'history' ? (
          <TransactionHistoryScreen onBack={() => setActiveTab('home')} />
        ) : activeTab === 'wallet' ? (
          <WalletScreen />
        ) : activeTab === 'profile' ? (
          <ProfileScreen />
        ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.brand}
              colors={[colors.brand]}
              progressBackgroundColor={colors.refreshBg}
            />
          }>
          {/* Header Bar */}
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <Image
                source={require('@/assets/images/logo/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.brandTitle}>NearbyPay</Text>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.notificationButton}
                activeOpacity={0.7}
                onPress={() =>
                  show({
                    message: 'You have 1 new payment alert',
                    variant: 'info',
                  })
                }>
                <HugeiconsIcon icon={Notification03Icon} size={18} color={colors.text} />
                <View style={styles.notificationDot} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.avatarButton}
                activeOpacity={0.8}
                onPress={() => setActiveTab('profile')}>
                <Image
                  source={{ uri: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_23.png' }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* User Greeting */}
          <View style={styles.greetingSection}>
            <Text style={styles.greetingSub}>Good morning,</Text>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>Chinedu Okafor</Text>
              <View style={styles.verifiedBadge}>
                <HugeiconsIcon icon={Tick02Icon} size={10} color="#FFFFFF" strokeWidth={2.8} />
              </View>
            </View>
            <Text style={styles.tagline}>Send. Receive. Stay Close.</Text>
          </View>

          {/* Total Balance Card */}
          <View style={styles.balanceCard}>
            <Svg style={StyleSheet.absoluteFill}>
              <Defs>
                <LinearGradient id="balGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#2E55F7" />
                  <Stop offset="100%" stopColor="#112CC9" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" rx={24} fill="url(#balGrad)" />
            </Svg>
            <View style={styles.cardHairline} pointerEvents="none" />

            {starPositions.map((star) => (
              <TwinklingStar key={star.id} star={star} />
            ))}

            <View style={styles.balanceTopRow}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <TouchableOpacity
                onPress={() => setIsBalanceVisible(!isBalanceVisible)}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.eyeToggle}>
                <HugeiconsIcon
                  icon={isBalanceVisible ? ViewIcon : ViewOffSlashIcon}
                  size={13}
                  color="rgba(255, 255, 255, 0.85)"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.balanceAmount}>
              {isBalanceVisible ? '₦245,680.75' : '****'}
            </Text>
          </View>

          {/* Quick Action Grid */}
          <View style={styles.actionStrip}>
            {QUICK_ACTIONS.map((action, index) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionItem, index > 0 && styles.actionItemDivided]}
                activeOpacity={0.6}
                onPress={() => handleActionPress(action.label)}>
                <View style={styles.actionIconWrap}>
                  <HugeiconsIcon icon={action.icon} size={18} color={colors.brandSoft} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Promo Card */}
          <View style={styles.promoCard}>
            <Svg style={StyleSheet.absoluteFill}>
              <Defs>
                <LinearGradient id="promoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#0B133A" />
                  <Stop offset="60%" stopColor="#070C28" />
                  <Stop offset="100%" stopColor="#030514" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" rx={18} fill="url(#promoGrad)" />
            </Svg>

            <View style={styles.promoGlowCircle} pointerEvents="none" />

            <Image
              source={require('@/assets/images/dash/image_2.png')}
              style={styles.promoImage}
              resizeMode="contain"
            />

            <View style={styles.promoTextCol}>
              <Text style={styles.promoTitle}>{'One App.\nAll Your People.'}</Text>
              <Text style={styles.promoSubtitle}>
                {'Send money, split bills,\ncollect payments and more.'}
              </Text>
              <TouchableOpacity
                style={styles.promoButton}
                activeOpacity={0.8}
                onPress={() =>
                  show({
                    message: 'Discover NearbyPay social transfers & split pay',
                    variant: 'info',
                  })
                }>
                <Text style={styles.promoButtonText}>Explore</Text>
                <HugeiconsIcon icon={ArrowRight01Icon} size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsSection}>
            <View style={styles.transactionsHeader}>
              <Text style={styles.transactionsTitle}>Recent</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveTab('history')}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.transactionsList}>
              {TRANSACTIONS.map((tx, index) => (
                <TouchableOpacity
                  key={tx.id}
                  style={[
                    styles.transactionItem,
                    index === TRANSACTIONS.length - 1 && styles.lastTransactionItem,
                  ]}
                  activeOpacity={0.6}
                  onPress={() =>
                    show({
                      message: `Transaction details: ${tx.title}`,
                      variant: 'info',
                    })
                  }>
                  <View style={styles.txIconWrap}>
                    <HugeiconsIcon icon={tx.icon} size={18} color={tx.iconColor} />
                  </View>

                  <View style={styles.txInfo}>
                    <Text style={styles.txTitle}>{tx.title}</Text>
                    <Text style={styles.txDate}>{tx.date}</Text>
                  </View>

                  <Text style={[styles.txAmount, { color: tx.amountColor }]}>{tx.amount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
        )}

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNavWrap}>
          <View
            style={[
              styles.bottomNav,
              { paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 8 : 6) },
            ]}>
            {navTabs.slice(0, 2).map(renderNavItem)}
            <View style={styles.fabSlot} />
            {navTabs.slice(2).map(renderNavItem)}
          </View>

          <TouchableOpacity
            style={styles.fab}
            activeOpacity={0.85}
            onPress={() => handleActionPress('Send')}>
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
      </View>
    </SafeAreaView>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: c.background,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    backgroundColor: c.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logo: {
    width: 28,
    height: 28,
  },
  brandTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    color: c.text,
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#0A2045',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#0A2045',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
    }),
  },
  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: c.surface,
    backgroundColor: c.backgroundSelected,
    ...Platform.select({
      ios: {
        shadowColor: '#0A2045',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: '#0A2045',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
    }),
  },
  avatarImage: {
    width: 36,
    height: 36,
  },
  greetingSection: {
    marginTop: 10,
    marginBottom: 12,
  },
  greetingSub: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 14,
    color: c.textSecondary,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 6,
  },
  userName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 21,
    color: c.text,
    letterSpacing: -0.5,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: c.textSecondary,
    marginTop: 3,
  },
  balanceCard: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#1E44F8',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.22,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: '#1E44F8',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.22,
        shadowRadius: 18,
      },
    }),
  },
  cardHairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  balanceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.72)',
  },
  eyeToggle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceAmount: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 32,
    color: '#FFFFFF',
    letterSpacing: -1,
    marginTop: 10,
  },
  actionStrip: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: c.surface,
    borderRadius: 20,
    marginTop: 14,
    borderWidth: 1,
    borderColor: c.surfaceBorder,
    ...Platform.select({
      ios: {
        shadowColor: '#0A2045',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#0A2045',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
    }),
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  actionItemDivided: {
    borderLeftWidth: 1,
    borderLeftColor: c.surfaceBorder,
  },
  actionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 10,
    color: c.text,
  },
  promoCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 14,
    position: 'relative',
    minHeight: 118,
    paddingHorizontal: 14,
    paddingVertical: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#081030',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
      web: {
        shadowColor: '#081030',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
      },
    }),
  },
  promoGlowCircle: {
    position: 'absolute',
    bottom: -16,
    right: 0,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2563EB',
    opacity: 0.15,
  },
  promoImage: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 100,
    height: 100,
  },
  promoTextCol: {
    flex: 1,
    maxWidth: '60%',
  },
  promoTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 20,
    letterSpacing: -0.3,
  },
  promoSubtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 10,
    color: '#9BA8C4',
    marginTop: 4,
    lineHeight: 13,
  },
  promoButton: {
    backgroundColor: '#1E44E8',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  promoButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  transactionsSection: {
    marginTop: 16,
  },
  transactionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  transactionsTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: c.text,
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11,
    color: c.accent,
  },
  transactionsList: {
    marginTop: 2,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: c.divider,
  },
  lastTransactionItem: {
    borderBottomWidth: 0,
  },
  txIconWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: c.text,
  },
  txDate: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 10,
    color: c.textMuted,
    marginTop: 2,
  },
  txAmount: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
  },
  bottomNavWrap: {
    position: 'relative',
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: c.surface,
    borderTopWidth: 1,
    borderTopColor: c.surfaceBorder,
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
    borderColor: c.background,
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
    color: c.navIcon,
  },
  navLabelActive: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#FFFFFF',
  },
});
