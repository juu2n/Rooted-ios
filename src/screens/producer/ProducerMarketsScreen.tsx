import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ProducerHeader } from '../../components/ProducerHeader';
import { MARKETS } from '../../data/markets';
import type { Market } from '../../types';
import { colors } from '../../theme/colors';

const PRODUCER_ID = 'p1';

function formatTime(h: number): string {
  const period = h >= 12 ? 'PM' : 'AM';
  const x = Math.floor(h) % 12 || 12;
  const m = Math.round((h % 1) * 60);
  const tail = m > 0 ? `:${m.toString().padStart(2, '0')}` : '';
  return `${x}${tail} ${period}`;
}

function cardMeta(index: number) {
  if (index === 0) return { next: 'In 2 days', stall: '#A3', producers: 4 };
  if (index === 1) return { next: 'Tomorrow', stall: '#B1', producers: 4 };
  return { next: 'In 5 days', stall: '#C7', producers: 6 };
}

export default function ProducerMarketsScreen() {
  const list = useMemo(() => MARKETS.filter((m) => m.producerIds.includes(PRODUCER_ID)), []);

  return (
    <View style={styles.root}>
      <ProducerHeader />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>My Markets</Text>
        {list.map((m, index) => (
          <MarketCard key={m.id} m={m} index={index} />
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

function MarketCard({ m, index }: { m: Market; index: number }) {
  const meta = cardMeta(index);
  const hours = `${formatTime(m.openHour)}–${formatTime(m.closeHour)}`;

  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <Text style={styles.marketName}>{m.name}</Text>
        <View style={styles.activePill}>
          <Text style={styles.activeTxt}>Active</Text>
        </View>
      </View>
      <View style={styles.row}>
        <Ionicons name="location-outline" size={18} color={colors.green} />
        <Text style={styles.rowTxt}>{m.address}</Text>
      </View>
      <View style={styles.row}>
        <Ionicons name="time-outline" size={18} color={colors.green} />
        <Text style={styles.rowTxt}>
          {m.days} · {hours}
        </Text>
      </View>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.statLabel}>Next Market</Text>
          <Text style={styles.statVal}>{meta.next}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="storefront-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.statLabel}>Your Stall</Text>
          <Text style={styles.statVal}>{meta.stall}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="people-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.statLabel}>Producers</Text>
          <Text style={styles.statVal}>{meta.producers}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryTxt}>View Details</Text>
        </Pressable>
        <Pressable style={styles.btnGhost}>
          <Text style={styles.btnGhostTxt}>Update Stall Info</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 16, paddingTop: 8 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 14 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  marketName: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.text },
  activePill: { backgroundColor: colors.greenLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  activeTxt: { fontSize: 12, fontWeight: '700', color: colors.greenDark },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 6 },
  rowTxt: { flex: 1, fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  stats: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statLabel: { fontSize: 11, color: colors.textSecondary, textAlign: 'center' },
  statVal: { fontSize: 14, fontWeight: '700', color: colors.text },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  btnPrimary: {
    flex: 1,
    backgroundColor: colors.greenLight,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPrimaryTxt: { fontWeight: '700', color: colors.greenDark, fontSize: 14 },
  btnGhost: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnGhostTxt: { fontWeight: '700', color: colors.textSecondary, fontSize: 14 },
});
