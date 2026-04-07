import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProducerHeader } from '../../components/ProducerHeader';
import { useProducerInventory } from '../../context/ProducerInventoryContext';
import type { ProducerInventoryStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import type { InventoryStatus } from '../../types/producer';

const CATEGORIES = ['Vegetables', 'Dairy', 'Bakery', 'Honey', 'Fruits', 'Flowers'];
const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
  'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80',
  'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80',
];

type R = RouteProp<ProducerInventoryStackParamList, 'AddProduct'>;

export default function ProducerAddProductScreen() {
  const { goBack } = useNavigation<NativeStackNavigationProp<ProducerInventoryStackParamList>>();
  const { params } = useRoute<R>();
  const insets = useSafeAreaInsets();
  const { addItem } = useProducerInventory();

  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priceRaw, setPriceRaw] = useState('');
  const [status, setStatus] = useState<InventoryStatus>('available');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0]);
  const [catOpen, setCatOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const save = () => {
    const n = name.trim();
    const p = priceRaw.trim().replace(/^\$/, '');
    if (!n || !p) return;
    const price = p.startsWith('$') ? p : `$${p}`;
    addItem({
      name: n,
      categoryLabel: category,
      price,
      status,
      imageUrl,
      sheet: params.sheet,
    });
    goBack();
  };

  return (
    <View style={styles.root}>
      <ProducerHeader />
      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headRow}>
          <Pressable onPress={goBack} style={styles.back}>
            <Ionicons name="chevron-back" size={24} color={colors.green} />
          </Pressable>
          <Text style={styles.screenTitle}>Add product</Text>
        </View>
        <Text style={styles.hint}>
          Adding to: {params.sheet === 'quick' ? 'Quick Stock Update' : 'Manual Inventory Sheets'}
        </Text>

        <Text style={styles.label}>Product name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Heirloom Kale" />

        <Text style={styles.label}>Category</Text>
        <Pressable style={styles.inputLike} onPress={() => setCatOpen(true)}>
          <Text>{category}</Text>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </Pressable>

        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          value={priceRaw}
          onChangeText={setPriceRaw}
          placeholder="4.99"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Status</Text>
        <Pressable style={styles.inputLike} onPress={() => setStatusOpen(true)}>
          <Text style={{ textTransform: 'capitalize' }}>{status.replace('_', ' ')}</Text>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </Pressable>

        <Text style={styles.label}>Cover image</Text>
        <View style={styles.imgRow}>
          {PRESET_IMAGES.map((uri) => (
            <Pressable
              key={uri}
              onPress={() => setImageUrl(uri)}
              style={[styles.imgPick, imageUrl === uri && styles.imgPickOn]}
            >
              <Image source={{ uri }} style={styles.imgThumb} />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.saveBig} onPress={save}>
          <Text style={styles.saveBigTxt}>Save product</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={catOpen} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setCatOpen(false)} />
        <View style={styles.modalSheet}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c}
              style={styles.modalRow}
              onPress={() => {
                setCategory(c);
                setCatOpen(false);
              }}
            >
              <Text>{c}</Text>
              {c === category ? <Ionicons name="checkmark" size={20} color={colors.green} /> : null}
            </Pressable>
          ))}
        </View>
      </Modal>

      <Modal visible={statusOpen} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setStatusOpen(false)} />
        <View style={styles.modalSheet}>
          {(['available', 'limited', 'sold_out'] as InventoryStatus[]).map((s) => (
            <Pressable
              key={s}
              style={styles.modalRow}
              onPress={() => {
                setStatus(s);
                setStatusOpen(false);
              }}
            >
              <Text style={{ textTransform: 'capitalize' }}>{s.replace('_', ' ')}</Text>
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  body: { padding: 20 },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  back: { padding: 4 },
  screenTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  hint: { fontSize: 13, color: colors.textSecondary, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.text,
  },
  inputLike: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
  imgRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  imgPick: { padding: 4, borderRadius: 10, borderWidth: 2, borderColor: 'transparent' },
  imgPickOn: { borderColor: colors.green },
  imgThumb: { width: 48, height: 48, borderRadius: 8, backgroundColor: colors.border },
  saveBig: {
    marginTop: 28,
    backgroundColor: colors.green,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveBigTxt: { color: colors.white, fontWeight: '800', fontSize: 17 },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  modalSheet: {
    position: 'absolute',
    left: 24,
    right: 24,
    top: '30%',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 8,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
});
