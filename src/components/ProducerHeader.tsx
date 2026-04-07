import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

type Props = {
  subtitle?: string;
  /** Extra children under subtitle (e.g. avatar row on profile) */
  children?: React.ReactNode;
};

export function ProducerHeader({
  subtitle = 'Manage your products and markets.',
  children,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
      <View style={styles.titleRow}>
        <Text style={styles.logo}>Rooted</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PRODUCER VIEW</Text>
        </View>
      </View>
      <Text style={styles.sub}>{subtitle}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.green,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  logo: {
    color: colors.white,
    fontSize: 26,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    fontWeight: '700',
  },
  badge: {
    backgroundColor: colors.greenDark,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sub: {
    marginTop: 8,
    color: colors.white,
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.95,
  },
});
