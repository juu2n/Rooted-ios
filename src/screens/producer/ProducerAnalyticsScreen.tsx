import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { ProducerHeader } from '../../components/ProducerHeader';
import { useProducerInventory } from '../../context/ProducerInventoryContext';
import { colors } from '../../theme/colors';

const W = Dimensions.get('window').width - 40;

const PROFILE_VIEWS = [
  { value: 150 },
  { value: 220 },
  { value: 280 },
  { value: 310 },
  { value: 290 },
  { value: 340 },
  { value: 890 },
];

/** Scaled for shared Y-axis with profile views (dummy analytics). */
const ITEM_SAVES = [
  { value: 120 },
  { value: 140 },
  { value: 130 },
  { value: 160 },
  { value: 180 },
  { value: 170 },
  { value: 220 },
];

const TOP_META: Record<
  string,
  { views: number; saves: number; status: 'sold_out' | 'available' | 'limited'; badge: string }
> = {
  'inv-heirloom': { views: 420, saves: 45, status: 'sold_out', badge: 'Sold Out (2h)' },
  'inv-honey': { views: 350, saves: 82, status: 'available', badge: 'Available' },
  'inv-sourdough': { views: 280, saves: 38, status: 'limited', badge: 'Limited' },
};

const TOP_ORDER = ['inv-heirloom', 'inv-honey', 'inv-sourdough'] as const;

export default function ProducerAnalyticsScreen() {
  const { items } = useProducerInventory();
  const top = TOP_ORDER.map((id) => items.find((i) => i.id === id)).filter(
    (x): x is NonNullable<typeof x> => x != null,
  );

  return (
    <View style={styles.root}>
      <ProducerHeader />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Professional Dashboard</Text>
        <Text style={styles.pageSub}>Track your visibility and engagement across Rooted.</Text>

        <View style={styles.grid}>
          <MetricCard
            icon="person-outline"
            iconColor="#2196F3"
            label="Accounts Reached"
            value="2,845"
            trend="+12%"
            up
          />
          <MetricCard
            icon="eye-outline"
            iconColor="#9C27B0"
            label="Profile Visits"
            value="1,284"
            trend="+8%"
            up
          />
          <MetricCard
            icon="bookmark-outline"
            iconColor="#FF9800"
            label="Content Saves"
            value="467"
            trend="+24%"
            up
          />
          <MetricCard
            icon="open-outline"
            iconColor="#E91E63"
            label="Website Taps"
            value="182"
            trend="-2%"
            up={false}
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Engagement Overview</Text>
          <Text style={styles.cardSub}>Profile views vs. Item saves this week</Text>
          <View style={styles.chartBox}>
            <LineChart
              data={PROFILE_VIEWS}
              data2={ITEM_SAVES}
              height={200}
              width={W}
              spacing={44}
              initialSpacing={6}
              endSpacing={6}
              thickness1={2}
              thickness2={2}
              color1="#8E44AD"
              color2="#E67E22"
              areaChart
              startFillColor1="#D7BDE2"
              endFillColor1="rgba(215,189,226,0.05)"
              startFillColor2="#FAD7A0"
              endFillColor2="rgba(250,215,160,0.05)"
              hideDataPoints
              hideRules={false}
              yAxisThickness={0}
              xAxisThickness={0}
              rulesType="solid"
              rulesColor="#E8E8E8"
              yAxisTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
              maxValue={1000}
              noOfSections={4}
              yAxisLabelWidth={34}
            />
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#8E44AD' }]} />
              <Text style={styles.legendText}>Profile views</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#E67E22' }]} />
              <Text style={styles.legendText}>Item saves</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Top Performing Content</Text>
        {top.map((p) => {
          const m = TOP_META[p.id];
          if (!m) return null;
          return (
            <View key={p.id} style={styles.contentCard}>
              <Image source={{ uri: p.imageUrl }} style={styles.thumb} />
              <View style={styles.contentBody}>
                <View style={styles.contentTop}>
                  <Text style={styles.contentName}>{p.name}</Text>
                  <View style={[styles.statusPill, styles[`st_${m.status}`]]}>
                    <Text
                      style={[
                        styles.statusTxt,
                        m.status === 'available' && styles.statusTxtOk,
                        m.status === 'limited' && styles.statusTxtLim,
                      ]}
                    >
                      {m.badge}
                    </Text>
                  </View>
                </View>
                <View style={styles.metrics}>
                  <Ionicons name="eye-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.metricTxt}>{m.views} views</Text>
                  <Ionicons name="bookmark-outline" size={16} color={colors.textSecondary} style={{ marginLeft: 12 }} />
                  <Text style={styles.metricTxt}>{m.saves} saves</Text>
                </View>
              </View>
            </View>
          );
        })}

        <View style={styles.trafficCard}>
          <Text style={styles.cardTitle}>Traffic Source</Text>
          <View style={styles.gaugeWrap}>
            <View style={styles.gaugeBar}>
              <View style={[styles.gaugeSeg, { flex: 0.65, backgroundColor: colors.green }]} />
              <View style={[styles.gaugeSeg, { flex: 0.25, backgroundColor: '#FF9800' }]} />
              <View style={[styles.gaugeSeg, { flex: 0.1, backgroundColor: '#2196F3' }]} />
            </View>
            <View style={styles.gaugeIcon}>
              <Ionicons name="location" size={28} color={colors.green} />
            </View>
          </View>
          <Text style={styles.directTxt}>Direct/External : 10</Text>
          <View style={styles.trafficLegend}>
            <LegendDot color={colors.green} label="Map" />
            <LegendDot color="#2196F3" label="Search" />
            <LegendDot color="#FF9800" label="Direct" />
          </View>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function MetricCard({
  icon,
  iconColor,
  label,
  value,
  trend,
  up,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  value: string;
  trend: string;
  up: boolean;
}) {
  return (
    <View style={styles.metricCard}>
      <Ionicons name={icon} size={22} color={iconColor} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <View style={[styles.trendPill, !up && styles.trendPillDown]}>
        <Text style={[styles.trendTxt, !up && styles.trendTxtDown]}>{trend}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingTop: 12 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#1a237e' },
  pageSub: { fontSize: 14, color: colors.textSecondary, marginTop: 6, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  metricCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    gap: 6,
  },
  metricLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  metricValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  trendPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 4,
  },
  trendPillDown: { backgroundColor: colors.border },
  trendTxt: { fontSize: 12, fontWeight: '700', color: colors.greenDark },
  trendTxtDown: { color: colors.textSecondary },
  chartCard: {
    marginTop: 20,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  cardSub: { fontSize: 13, color: colors.textSecondary, marginTop: 4, marginBottom: 8 },
  chartBox: { alignItems: 'center', marginVertical: 8 },
  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: colors.textSecondary },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 12, color: colors.text },
  contentCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  thumb: { width: 64, height: 64, borderRadius: 10, backgroundColor: colors.border },
  contentBody: { flex: 1 },
  contentTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  contentName: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  st_sold_out: { backgroundColor: '#FFEBEE' },
  st_available: { backgroundColor: colors.greenLight },
  st_limited: { backgroundColor: '#FFF3E0' },
  statusTxt: { fontSize: 11, fontWeight: '700', color: colors.red },
  statusTxtOk: { color: colors.greenDark },
  statusTxtLim: { color: '#E65100' },
  metrics: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  metricTxt: { marginLeft: 4, fontSize: 13, color: colors.textSecondary },
  trafficCard: {
    marginTop: 20,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  gaugeWrap: { alignItems: 'center', marginVertical: 16 },
  gaugeBar: {
    flexDirection: 'row',
    width: '100%',
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gaugeSeg: { height: '100%' },
  gaugeIcon: { marginTop: -36, backgroundColor: colors.white, padding: 8, borderRadius: 24 },
  directTxt: { textAlign: 'center', fontSize: 14, color: colors.textSecondary, marginBottom: 12 },
  trafficLegend: { flexDirection: 'row', justifyContent: 'center', gap: 20, flexWrap: 'wrap' },
});
