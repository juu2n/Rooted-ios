import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FilterMapModal } from '../components/FilterMapModal';
import { RootedHeader } from '../components/RootedHeader';
import { INITIAL_REGION, MARKETS } from '../data/markets';
import type { MapStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import type { Market } from '../types';
import { haversineMiles } from '../utils/geo';
import {
  DEFAULT_MAP_FILTERS,
  marketPassesMapFilters,
  type MapFilterState,
} from '../utils/marketSchedule';

const REF_LAT = INITIAL_REGION.latitude;
const REF_LNG = INITIAL_REGION.longitude;

function markerIconName(kind: Market['markerKind']): keyof typeof Ionicons.glyphMap {
  switch (kind) {
    case 'star':
      return 'star';
    case 'building':
      return 'business';
    case 'pin':
      return 'location';
    default:
      return 'storefront';
  }
}

const LEGEND: { kind: Market['markerKind'] | 'all'; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { kind: 'all', icon: 'layers-outline', label: 'All marker types' },
  { kind: 'stall', icon: 'storefront', label: 'General market' },
  { kind: 'star', icon: 'star', label: 'Featured / special' },
  { kind: 'building', icon: 'business', label: 'Borough / plaza' },
  { kind: 'pin', icon: 'location', label: 'Neighborhood stop' },
];

export default function MapScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();
  const [filterOpen, setFilterOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const [mapFilters, setMapFilters] = useState<MapFilterState>(DEFAULT_MAP_FILTERS);
  const [legendKind, setLegendKind] = useState<Market['markerKind'] | 'all'>('all');
  const [mapRegion, setMapRegion] = useState(INITIAL_REGION);

  const visibleMarkets = useMemo(() => {
    return MARKETS.filter((m) => {
      if (!marketPassesMapFilters(m, mapFilters, REF_LAT, REF_LNG, haversineMiles)) return false;
      if (legendKind !== 'all' && m.markerKind !== legendKind) return false;
      return true;
    });
  }, [mapFilters, legendKind]);

  const zoom = (inFactor: number) => {
    const next = {
      ...mapRegion,
      latitudeDelta: Math.max(0.01, mapRegion.latitudeDelta * inFactor),
      longitudeDelta: Math.max(0.01, mapRegion.longitudeDelta * inFactor),
    };
    setMapRegion(next);
    mapRef.current?.animateToRegion(next, 200);
  };

  return (
    <View style={styles.root}>
      <RootedHeader bottomPadding={12} />
      <View style={styles.mapWrap}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_DEFAULT}
          initialRegion={INITIAL_REGION}
          onRegionChangeComplete={setMapRegion}
          rotateEnabled={false}
          pitchEnabled={false}
        >
          {visibleMarkets.map((m) => (
            <Marker
              key={m.id}
              coordinate={{ latitude: m.latitude, longitude: m.longitude }}
              onPress={() => navigation.navigate('MarketDetail', { marketId: m.id })}
            >
              <View style={styles.pinOuter}>
                <View style={styles.pinInner}>
                  <Ionicons name={markerIconName(m.markerKind)} size={18} color={colors.white} />
                </View>
                {m.clusterCount != null && m.clusterCount > 1 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{m.clusterCount}</Text>
                  </View>
                ) : null}
              </View>
            </Marker>
          ))}
        </MapView>

        <View style={[styles.zoomCol, { top: 12 }]}>
          <Pressable style={styles.zoomBtn} onPress={() => zoom(0.65)}>
            <Ionicons name="add" size={22} color={colors.text} />
          </Pressable>
          <Pressable style={styles.zoomBtn} onPress={() => zoom(1.45)}>
            <Ionicons name="remove" size={22} color={colors.text} />
          </Pressable>
        </View>

        <Pressable style={[styles.filtersBtn, { top: 12 }]} onPress={() => setFilterOpen(true)}>
          <Ionicons name="options-outline" size={18} color={colors.text} />
          <Text style={styles.filtersText}>Filters</Text>
        </Pressable>

        <Pressable
          style={[styles.legendBtn, { bottom: Math.max(insets.bottom, 12) }]}
          onPress={() => setLegendOpen(!legendOpen)}
        >
          <Text style={styles.legendText}>Map Legend</Text>
          <Ionicons name={legendOpen ? 'chevron-down' : 'chevron-up'} size={16} color={colors.text} />
        </Pressable>

        {legendOpen ? (
          <View style={[styles.legendPanel, { bottom: Math.max(insets.bottom, 12) + 48 }]}>
            {LEGEND.map((row) => (
              <Pressable
                key={row.kind}
                style={[styles.legendRow, legendKind === row.kind && styles.legendRowOn]}
                onPress={() => setLegendKind(row.kind)}
              >
                <View style={styles.legendIcon}>
                  <Ionicons name={row.icon} size={14} color={colors.white} />
                </View>
                <Text style={styles.legendLabel}>{row.label}</Text>
                {legendKind === row.kind ? (
                  <Ionicons name="checkmark-circle" size={18} color={colors.green} />
                ) : null}
              </Pressable>
            ))}
            <Text style={styles.legendNote}>Badge = vendors at pin · tap a type to filter pins</Text>
          </View>
        ) : null}
      </View>

      <FilterMapModal
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        value={mapFilters}
        onApply={setMapFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapWrap: {
    flex: 1,
    marginHorizontal: 0,
    position: 'relative',
  },
  pinOuter: {
    alignItems: 'center',
  },
  pinInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  zoomCol: {
    position: 'absolute',
    left: 12,
    gap: 6,
  },
  zoomBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  filtersBtn: {
    position: 'absolute',
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  filtersText: {
    fontWeight: '600',
    color: colors.text,
    fontSize: 14,
  },
  legendBtn: {
    position: 'absolute',
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  legendText: {
    fontWeight: '600',
    fontSize: 13,
  },
  legendPanel: {
    position: 'absolute',
    right: 12,
    left: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 8,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  legendRowOn: {
    backgroundColor: colors.greenTint,
  },
  legendIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  legendNote: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    paddingHorizontal: 8,
  },
});
