import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ProducerHeader } from '../../components/ProducerHeader';
import { useProducerInventory } from '../../context/ProducerInventoryContext';
import { MARKETS } from '../../data/markets';
import type { ProducerInventoryStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import type { InventoryStatus } from '../../types/producer';

const STATUS_OPTIONS: { id: InventoryStatus; label: string }[] = [
  { id: 'available', label: 'Available' },
  { id: 'limited', label: 'Limited' },
  { id: 'sold_out', label: 'Sold Out' },
];

export default function ProducerInventoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProducerInventoryStackParamList>>();
  const { items, updateStatus } = useProducerInventory();
  const [segment, setSegment] = useState<'quick' | 'manual'>('quick');
  const [marketIdx, setMarketIdx] = useState(0);
  const [marketOpen, setMarketOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFor, setStatusFor] = useState<string | null>(null);

  const marketOptions = useMemo(() => MARKETS.filter((m) => m.producerIds.includes('p1')), []);
  const marketLabel = marketOptions[marketIdx]?.name ?? 'Market';

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => !q || i.name.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <View style={styles.root}>
      <ProducerHeader />
      <View style={styles.toolbar}>
        <Text style={styles.title}>Inventory Management</Text>
        <Pressable
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddProduct', { sheet: segment })}
        >
          <Ionicons name="add" size={20} color={colors.white} />
          <Text style={styles.addBtnText}>Add Product</Text>
        </Pressable>
      </View>

      <View style={styles.segment}>
        <Pressable
          style={[styles.segBtn, segment === 'quick' && styles.segOn]}
          onPress={() => setSegment('quick')}
        >
          <Text style={[styles.segTxt, segment === 'quick' && styles.segTxtOn]}>Quick Stock Update</Text>
        </Pressable>
        <Pressable
          style={[styles.segBtn, segment === 'manual' && styles.segOn]}
          onPress={() => setSegment('manual')}
        >
          <Text style={[styles.segTxt, segment === 'manual' && styles.segTxtOn]}>Manual Inventory Sheets</Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        <Pressable style={styles.marketDd} onPress={() => setMarketOpen(true)}>
          <Text style={styles.marketDdTxt} numberOfLines={1}>
            {marketLabel}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.text} />
        </Pressable>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            placeholder="Search product"
            placeholderTextColor={colors.textSecondary}
            style={styles.searchIn}
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardPrice}>{item.price}</Text>
              </View>
              <Text style={styles.cardCat}>{item.categoryLabel}</Text>
              <Pressable style={[styles.statusDd, pillStyle(item.status)]} onPress={() => setStatusFor(item.id)}>
                <Text style={styles.statusDdTxt}>{labelForStatus(item)}</Text>
                <Ionicons name="chevron-down" size={14} color={colors.text} />
              </Pressable>
              <Pressable style={styles.editRow}>
                <Ionicons name="pencil" size={14} color="#1976D2" />
                <Text style={styles.editTxt}>Edit</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <Modal visible={marketOpen} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setMarketOpen(false)} />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>Select market</Text>
          <ScrollView>
            {marketOptions.map((m, i) => (
              <Pressable
                key={m.id}
                style={styles.modalRow}
                onPress={() => {
                  setMarketIdx(i);
                  setMarketOpen(false);
                }}
              >
                <Text style={styles.modalRowTxt}>{m.name}</Text>
                {i === marketIdx ? <Ionicons name="checkmark" size={20} color={colors.green} /> : null}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <Modal visible={!!statusFor} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setStatusFor(null)} />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>Product status</Text>
          {STATUS_OPTIONS.map((o) => (
            <Pressable
              key={o.id}
              style={styles.modalRow}
              onPress={() => {
                if (statusFor) updateStatus(statusFor, o.id);
                setStatusFor(null);
              }}
            >
              <Text style={styles.modalRowTxt}>{o.label}</Text>
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  );
}

function labelForStatus(item: { status: InventoryStatus; statusNote?: string }) {
  if (item.status === 'sold_out' && item.statusNote) return item.statusNote;
  return STATUS_OPTIONS.find((s) => s.id === item.status)?.label ?? item.status;
}

function pillStyle(s: InventoryStatus) {
  switch (s) {
    case 'available':
      return { backgroundColor: colors.greenLight };
    case 'limited':
      return { backgroundColor: '#FFF9C4' };
    default:
      return { backgroundColor: '#FFEBEE' };
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  title: { flex: 1, fontSize: 22, fontWeight: '800', color: colors.text },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.green,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  segment: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    padding: 4,
  },
  segBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  segOn: { backgroundColor: colors.white, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  segTxt: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, textAlign: 'center' },
  segTxtOn: { color: colors.text },
  filterRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 14 },
  marketDd: {
    flex: 0.42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  marketDdTxt: { flex: 1, fontSize: 14, fontWeight: '600' },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIn: { flex: 1, paddingVertical: 10, fontSize: 15, color: colors.text },
  list: { padding: 16, paddingBottom: 100, gap: 12 },
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  thumb: { width: 72, height: 72, borderRadius: 12, backgroundColor: colors.border },
  cardBody: { flex: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardName: { flex: 1, fontSize: 16, fontWeight: '700' },
  cardPrice: { fontSize: 16, fontWeight: '700', color: colors.green },
  cardCat: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  statusDd: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  statusDdTxt: { fontSize: 13, fontWeight: '700' },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10, alignSelf: 'flex-end' },
  editTxt: { fontSize: 14, fontWeight: '600', color: '#1976D2' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  modalSheet: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: '22%',
    maxHeight: '55%',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 12,
  },
  modalTitle: { fontWeight: '700', fontSize: 16, paddingHorizontal: 16, marginBottom: 8 },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  modalRowTxt: { fontSize: 16, color: colors.text },
});
