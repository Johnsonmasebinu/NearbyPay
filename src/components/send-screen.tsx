import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Location01Icon,
  ScanIcon,
  Tick02Icon,
  Wallet03Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAppTheme } from '@/hooks/theme-provider';
import type { ThemeColors } from '@/constants/theme';
import { useToast } from '@/components/ui/toast';
import QRCodeView from '@/components/ui/qr-code';

const NEARBY_PEOPLE = [
  { id: '1', name: 'Mama T Foods', distance: '120 m', avatar: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_12.png', online: true },
  { id: '2', name: 'Bookstore NG', distance: '350 m', avatar: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_13.png', online: true },
  { id: '3', name: 'Kola Mart', distance: '500 m', avatar: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_14.png', online: false },
  { id: '4', name: 'Sade Beauty', distance: '780 m', avatar: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_15.png', online: true },
  { id: '5', name: 'Danfo Gas', distance: '1.2 km', avatar: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_16.png', online: false },
  { id: '6', name: 'Chops & Grills', distance: '1.5 km', avatar: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_17.png', online: true },
];

const QUICK_AMOUNTS = [500, 1000, 5000, 10000];

type SendPhase = 'compose' | 'processing' | 'success';

type Person = (typeof NEARBY_PEOPLE)[number];

export default function SendScreen({ onClose }: { onClose: () => void }) {
  const { colors, isDark } = useAppTheme();
  const { show } = useToast();
  const styles = createStyles(colors);

  const [selected, setSelected] = useState<Person | null>(null);
  const [amount, setAmount] = useState('');
  const [phase, setPhase] = useState<SendPhase>('compose');
  const [showScanner, setShowScanner] = useState(false);

  const entrance = useRef(new Animated.Value(0)).current;
  const scanLine = useRef(new Animated.Value(0)).current;
  const processingPulse = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  useEffect(() => {
    if (!showScanner) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scanLine, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    const timer = setTimeout(() => {
      loop.stop();
      setShowScanner(false);
      setSelected(NEARBY_PEOPLE[0]);
      show({ message: 'Merchant QR scanned — Mama T Foods selected.', variant: 'success' });
    }, 3200);
    return () => {
      loop.stop();
      clearTimeout(timer);
    };
  }, [showScanner, scanLine, show]);

  useEffect(() => {
    if (phase === 'processing') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(processingPulse, { toValue: 1, duration: 650, useNativeDriver: true }),
          Animated.timing(processingPulse, { toValue: 0, duration: 650, useNativeDriver: true }),
        ]),
      );
      loop.start();
      const timer = setTimeout(() => {
        setPhase('success');
        show({ message: `Payment sent to ${selected?.name}`, variant: 'success' });
      }, 1800);
      return () => {
        loop.stop();
        clearTimeout(timer);
      };
    }
    if (phase === 'success') {
      Animated.spring(successScale, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }).start();
    }
  }, [phase, processingPulse, successScale, selected, show]);

  const processingOpacity = processingPulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
  const processingScale = processingPulse.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.06] });
  const scanY = scanLine.interpolate({ inputRange: [0, 1], outputRange: [-70, 70] });

  const numericAmount = Number(amount.replace(/[^0-9]/g, ''));
  const canSend = selected !== null && numericAmount > 0;

  const formatAmount = (value: string) => {
    const digits = value.replace(/[^0-9]/g, '');
    if (!digits) return '';
    return `₦${Number(digits).toLocaleString()}`;
  };

  const handleSend = () => {
    if (!canSend) {
      show({
        message: selected ? 'Enter an amount first.' : 'Select a merchant or scan their QR.',
        variant: 'info',
      });
      return;
    }
    setPhase('processing');
  };

  const renderRecipientSection = () => {
    if (selected) {
      return (
        <View style={styles.selectedBar}>
          <Image source={{ uri: selected.avatar }} style={styles.selectedAvatar} resizeMode="cover" />
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedName}>{selected.name}</Text>
            <View style={styles.selectedMetaRow}>
              <View style={[styles.metaDot, { backgroundColor: selected.online ? colors.success : colors.textMuted }]} />
              <Text style={styles.selectedMeta}>
                {selected.distance} away · {selected.online ? 'online' : 'offline — queued'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.changeButton}
            activeOpacity={0.7}
            onPress={() => setSelected(null)}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.peopleBlock}>
        <View style={styles.locationBanner}>
          <HugeiconsIcon icon={Location01Icon} size={14} color={colors.brand} />
          <Text style={styles.locationText}>6 merchants found around you</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.peopleRow}>
          {NEARBY_PEOPLE.map((person) => (
            <TouchableOpacity
              key={person.id}
              style={styles.personCard}
              activeOpacity={0.75}
              onPress={() => setSelected(person)}>
              <View style={styles.avatarWrap}>
                <Image source={{ uri: person.avatar }} style={styles.avatar} resizeMode="cover" />
                <View
                  style={[
                    styles.onlineDot,
                    { backgroundColor: person.online ? colors.success : colors.textMuted },
                  ]}
                />
              </View>
              <Text style={styles.personName} numberOfLines={1}>{person.name}</Text>
              <Text style={styles.personDistance}>{person.distance}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  if (phase === 'processing') {
    return (
      <View style={styles.safeArea}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.centerWrap}>
          <Animated.View
            style={[styles.processingIcon, { opacity: processingOpacity, transform: [{ scale: processingScale }] }]}>
            <HugeiconsIcon icon={Wallet03Icon} size={26} color="#FFFFFF" />
          </Animated.View>
          <Text style={styles.processingTitle}>Sending {formatAmount(amount)}</Text>
          <Text style={styles.processingSubtitle}>
            to {selected?.name} · {selected?.online ? 'merchant is online' : 'will deliver when the merchant is online'}
          </Text>
          <View style={styles.processingDotsRow}>
            {[0, 1, 2].map((i) => (
              <Animated.View
                key={i}
                style={[styles.processingDot, { opacity: processingOpacity, transform: [{ scale: processingScale }] }]}
              />
            ))}
          </View>
        </View>
      </View>
    );
  }

  if (phase === 'success') {
    return (
      <View style={styles.safeArea}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.centerWrap}>
          <Animated.View style={[styles.successIconWrap, { transform: [{ scale: successScale }] }]}>
            <View style={styles.successGlow} />
            <View style={styles.successIcon}>
              <HugeiconsIcon icon={Tick02Icon} size={34} color="#FFFFFF" strokeWidth={3} />
            </View>
          </Animated.View>
          <Text style={styles.successTitle}>Payment Sent!</Text>
          <Text style={styles.successSubtitle}>
            {formatAmount(amount)} sent to {selected?.name}. You earned
            commission points on this transfer.
          </Text>
          <TouchableOpacity style={styles.doneButton} activeOpacity={0.8} onPress={onClose}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={onClose}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Send Money</Text>
          <TouchableOpacity
            style={[styles.iconButton, { borderColor: colors.brand }]}
            activeOpacity={0.7}
            onPress={() => setShowScanner(true)}>
            <HugeiconsIcon icon={ScanIcon} size={15} color={colors.brand} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Recipient */}
          {renderRecipientSection()}

          {/* Amount */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Enter amount</Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.amountPrefix}>₦</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={(text) => setAmount(formatAmount(text))}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.quickAmountRow}>
              {QUICK_AMOUNTS.map((quick) => (
                <TouchableOpacity
                  key={quick}
                  style={[
                    styles.quickAmountChip,
                    numericAmount === quick && styles.quickAmountChipActive,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setAmount(formatAmount(String(quick)))}>
                  <Text
                    style={[
                      styles.quickAmountText,
                      numericAmount === quick && styles.quickAmountTextActive,
                    ]}>
                    ₦{quick.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Scan prompt */}
          {!selected && (
            <TouchableOpacity
              style={styles.scanPrompt}
              activeOpacity={0.75}
              onPress={() => setShowScanner(true)}>
              <View style={styles.scanPromptIcon}>
                <HugeiconsIcon icon={ScanIcon} size={16} color={colors.brand} />
              </View>
              <View style={styles.scanPromptInfo}>
                <Text style={styles.scanPromptTitle}>Scan merchant QR</Text>
                <Text style={styles.scanPromptSubtitle}>Pay any merchant nearby instantly</Text>
              </View>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} color={colors.navIcon} />
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Fixed footer */}
        <View style={styles.footerBar}>
          <TouchableOpacity
            style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
            activeOpacity={0.85}
            onPress={handleSend}>
            <Text style={styles.sendButtonText}>
              {canSend ? `Send ${formatAmount(String(numericAmount))}` : 'Select merchant & amount'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* QR Scanner overlay */}
      {showScanner && (
        <View style={styles.scannerOverlay}>
          <View style={[styles.scannerHeader, { paddingTop: 56 }]}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={() => setShowScanner(false)}>
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.scannerTitle}>Scan Merchant QR</Text>
            <View style={styles.iconButton} />
          </View>

          <View style={styles.scannerBody}>
            <View style={[styles.scannerFrame, { borderColor: 'rgba(255,255,255,0.9)' }]}>
              <Animated.View
                style={[styles.scanLine, { transform: [{ translateY: scanY }] }]}
                pointerEvents="none"
              />
              <View style={styles.qrWrap}>
                <QRCodeView value={selected ? `NBP-PAY-${selected.id}` : 'NBP-SCAN'} size={150} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.scannerHint}>Point your camera at the merchant&apos;s QR code</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: c.background,
    },
    container: {
      flex: 1,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 10,
    },
    screenTitle: {
      fontFamily: 'Montserrat_700Bold',
      fontSize: 17,
      color: c.text,
      letterSpacing: -0.3,
    },
    iconButton: {
      width: 34,
      height: 34,
      borderRadius: 12,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    locationBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 10,
    },
    locationText: {
      fontFamily: 'Montserrat_600SemiBold',
      fontSize: 11,
      color: c.textSecondary,
    },
    peopleBlock: {
      marginTop: 6,
    },
    peopleRow: {
      gap: 10,
      paddingRight: 16,
      alignItems: 'flex-start',
    },
    personCard: {
      width: 88,
      backgroundColor: c.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 6,
    },
    avatarWrap: {
      position: 'relative',
      marginBottom: 8,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: c.backgroundSelected,
    },
    onlineDot: {
      position: 'absolute',
      bottom: 1,
      right: 1,
      width: 11,
      height: 11,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: c.surface,
    },
    personName: {
      fontFamily: 'Montserrat_600SemiBold',
      fontSize: 10,
      color: c.text,
    },
    personDistance: {
      fontFamily: 'Montserrat_400Regular',
      fontSize: 9,
      color: c.textMuted,
      marginTop: 2,
    },
    selectedBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      padding: 12,
      gap: 12,
      marginTop: 6,
    },
    selectedAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.backgroundSelected,
    },
    selectedInfo: {
      flex: 1,
    },
    selectedName: {
      fontFamily: 'Montserrat_700Bold',
      fontSize: 14,
      color: c.text,
    },
    selectedMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: 3,
    },
    metaDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
    },
    selectedMeta: {
      fontFamily: 'Montserrat_400Regular',
      fontSize: 10,
      color: c.textMuted,
    },
    changeButton: {
      backgroundColor: c.background,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 14,
    },
    changeButtonText: {
      fontFamily: 'Montserrat_600SemiBold',
      fontSize: 11,
      color: c.brand,
    },
    amountCard: {
      backgroundColor: c.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      padding: 20,
      marginTop: 16,
      alignItems: 'center',
    },
    amountLabel: {
      fontFamily: 'Montserrat_600SemiBold',
      fontSize: 10,
      color: c.textMuted,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    amountInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    amountPrefix: {
      fontFamily: 'Montserrat_700Bold',
      fontSize: 36,
      color: c.textMuted,
      marginRight: 4,
    },
    amountInput: {
      fontFamily: 'Montserrat_700Bold',
      fontSize: 36,
      color: c.text,
      letterSpacing: -1,
      minWidth: 120,
      textAlign: 'center',
      paddingVertical: 0,
    },
    quickAmountRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 16,
    },
    quickAmountChip: {
      backgroundColor: c.background,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    quickAmountChipActive: {
      backgroundColor: c.brand,
      borderColor: c.brand,
    },
    quickAmountText: {
      fontFamily: 'Montserrat_600SemiBold',
      fontSize: 11,
      color: c.textSecondary,
    },
    quickAmountTextActive: {
      color: '#FFFFFF',
    },
    scanPrompt: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.surfaceBorder,
      padding: 14,
      gap: 12,
      marginTop: 14,
    },
    scanPromptIcon: {
      width: 38,
      height: 38,
      borderRadius: 13,
      backgroundColor: c.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scanPromptInfo: {
      flex: 1,
    },
    scanPromptTitle: {
      fontFamily: 'Montserrat_600SemiBold',
      fontSize: 13,
      color: c.text,
    },
    scanPromptSubtitle: {
      fontFamily: 'Montserrat_400Regular',
      fontSize: 10,
      color: c.textMuted,
      marginTop: 2,
    },
    footerBar: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 24,
      backgroundColor: c.background,
    },
    sendButton: {
      backgroundColor: c.brand,
      borderRadius: 16,
      paddingVertical: 15,
      alignItems: 'center',
    },
    sendButtonDisabled: {
      opacity: 0.45,
    },
    sendButtonText: {
      fontFamily: 'Montserrat_700Bold',
      fontSize: 14,
      color: '#FFFFFF',
    },
    centerWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    processingIcon: {
      width: 72,
      height: 72,
      borderRadius: 24,
      backgroundColor: c.brand,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    processingTitle: {
      fontFamily: 'Montserrat_700Bold',
      fontSize: 18,
      color: c.text,
      letterSpacing: -0.4,
    },
    processingSubtitle: {
      fontFamily: 'Montserrat_400Regular',
      fontSize: 12,
      color: c.textMuted,
      textAlign: 'center',
      marginTop: 6,
      lineHeight: 17,
    },
    processingDotsRow: {
      flexDirection: 'row',
      gap: 6,
      marginTop: 20,
    },
    processingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: c.brand,
    },
    successIconWrap: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 22,
    },
    successGlow: {
      position: 'absolute',
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: c.success,
      opacity: 0.15,
    },
    successIcon: {
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: c.success,
      alignItems: 'center',
      justifyContent: 'center',
    },
    successTitle: {
      fontFamily: 'Montserrat_700Bold',
      fontSize: 22,
      color: c.text,
      letterSpacing: -0.5,
    },
    successSubtitle: {
      fontFamily: 'Montserrat_400Regular',
      fontSize: 12,
      color: c.textMuted,
      textAlign: 'center',
      marginTop: 8,
      lineHeight: 18,
    },
    doneButton: {
      backgroundColor: c.brand,
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 44,
      marginTop: 26,
    },
    doneButtonText: {
      fontFamily: 'Montserrat_700Bold',
      fontSize: 14,
      color: '#FFFFFF',
    },
    scannerOverlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'rgba(2, 6, 23, 0.94)',
      zIndex: 10,
    },
    scannerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingBottom: 10,
    },
    scannerTitle: {
      fontFamily: 'Montserrat_700Bold',
      fontSize: 15,
      color: '#FFFFFF',
    },
    scannerBody: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    scannerFrame: {
      width: Math.min(SCREEN_WIDTH - 96, 260),
      aspectRatio: 1,
      borderWidth: 2,
      borderRadius: 24,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.04)',
    },
    scanLine: {
      position: 'absolute',
      left: 14,
      right: 14,
      height: 2,
      borderRadius: 1,
      backgroundColor: '#4B63F5',
    },
    qrWrap: {
      opacity: 0.9,
    },
    scannerHint: {
      fontFamily: 'Montserrat_500Medium',
      fontSize: 12,
      color: 'rgba(255,255,255,0.7)',
      textAlign: 'center',
      marginTop: 24,
      lineHeight: 18,
    },
  });
