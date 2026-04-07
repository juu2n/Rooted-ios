import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

type Props = {
  /** Extra bottom padding inside green header */
  bottomPadding?: number;
};

export function RootedHeader({ bottomPadding = 16 }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8, paddingBottom: bottomPadding }]}>
      <Text style={styles.logo}>Rooted</Text>
      <Text style={styles.tagline}>Find fresh, local produce near you.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.green,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    color: colors.white,
    fontSize: 28,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    fontWeight: '700',
  },
  tagline: {
    marginTop: 6,
    color: colors.white,
    fontSize: 13,
    opacity: 0.95,
    textAlign: 'center',
  },
});
