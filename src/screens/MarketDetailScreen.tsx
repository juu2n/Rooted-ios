import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { producerById } from '../data/producers';
import { marketById } from '../data/markets';
import type { MapStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type R = RouteProp<MapStackParamList, 'MarketDetail'>;

function formatHour(h: number): string {
  const period = h >= 12 ? 'PM' : 'AM';
  const x = Math.floor(h) % 12 || 12;
  const mins = Math.round((h % 1) * 60);
  const m = mins > 0 ? `:${mins.toString().padStart(2, '0')}` : ':00';
  return `${x}${m} ${period}`;
}

export default function MarketDetailScreen() {
  const { goBack } = useNavigation<NativeStackNavigationProp<MapStackParamList>>();
  const { params } = useRoute<R>();
  const insets = useSafeAreaInsets();
  const market = marketById(params.marketId);

  const producers = useMemo(() => {
    if (!market) return [];
    return market.producerIds.map((id) => producerById(id)).filter(Boolean);
  }, [market]);

  if (!market) {
    return (
      <View style={[styles.fallback, { paddingTop: insets.top }]}>
        <Pressable onPress={goBack} style={styles.backRow}>
          <Ionicons name="chevron-back" size={24} color={colors.green} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.missing}>Market not found.</Text>
      </View>
    );
  }

  const hoursLabel = `${formatHour(market.openHour)} – ${formatHour(market.closeHour)}`;

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} bounces>
        <View style={styles.heroWrap}>
          <Image source={{ uri: market.imageUrl }} style={styles.hero} />
          <Pressable style={[styles.backFab, { top: insets.top + 8 }]} onPress={goBack}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{market.name}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={18} color={colors.green} />
            <Text style={styles.metaText}>
              {hoursLabel} · {market.days}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={18} color={colors.green} />
            <Text style={styles.metaText}>{market.address}</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="call-outline" size={18} color={colors.green} />
            <Text style={styles.metaText}>{market.phone}</Text>
          </View>

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.desc}>{market.description}</Text>

          <Text style={styles.sectionTitle}>Producers at this market</Text>
          {producers.map((p) =>
            p ? (
              <View key={p.id} style={styles.producerRow}>
                <Image source={{ uri: p.avatarUrl }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.producerName}>{p.name}</Text>
                  <Text style={styles.producerSub}>{p.subtitle}</Text>
                </View>
                <View style={styles.ratingPill}>
                  <Text style={styles.ratingText}>{p.rating.toFixed(1)}</Text>
                  <Ionicons name="star" size={12} color={colors.star} />
                </View>
              </View>
            ) : null,
          )}

          <Pressable
            style={styles.cta}
            onPress={() => {
              const label = encodeURIComponent(market.name);
              const url =
                Platform.OS === 'ios'
                  ? `http://maps.apple.com/?ll=${market.latitude},${market.longitude}&q=${label}`
                  : `geo:${market.latitude},${market.longitude}?q=${label}`;
              Linking.openURL(url);
            }}
          >
            <Ionicons name="navigate" size={20} color={colors.white} />
            <Text style={styles.ctaText}>Open in Maps</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fallback: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  missing: {
    marginTop: 24,
    fontSize: 16,
  },
  heroWrap: {
    position: 'relative',
  },
  hero: {
    width: '100%',
    height: 220,
    backgroundColor: colors.border,
  },
  backFab: {
    position: 'absolute',
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  body: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 10,
  },
  metaText: {
    flex: 1,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    marginTop: 22,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  desc: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  producerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.border,
  },
  producerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  producerSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  ratingText: {
    fontWeight: '600',
    fontSize: 13,
  },
  cta: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.green,
    paddingVertical: 16,
    borderRadius: 14,
  },
  ctaText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: 17,
    color: colors.green,
    fontWeight: '500',
  },
});
