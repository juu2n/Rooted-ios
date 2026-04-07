import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppData } from '../context/AppDataContext';
import { producerById } from '../data/producers';
import { productById } from '../data/products';
import type { SearchStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import type { Review } from '../types';

type R = RouteProp<SearchStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SearchStackParamList>>();
  const { goBack } = navigation;
  const { params } = useRoute<R>();
  const insets = useSafeAreaInsets();
  const { isProductSaved, toggleSaveProduct, reviewsFor, addReview } = useAppData();
  const product = productById(params.productId);
  const producer = product ? producerById(product.producerId) : undefined;
  const saved = product ? isProductSaved(product.id) : false;

  const list = useMemo(
    () => (product ? reviewsFor('product', product.id) : []),
    [product, reviewsFor],
  );

  const [stars, setStars] = useState(5);
  const [text, setText] = useState('');

  if (!product || !producer) {
    return (
      <View style={[styles.miss, { paddingTop: insets.top }]}>
        <Pressable onPress={goBack} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={colors.green} />
          <Text style={styles.backT}>Back</Text>
        </Pressable>
        <Text>Product not found.</Text>
      </View>
    );
  }

  const submit = () => {
    const t = text.trim();
    if (!t || stars < 1) return;
    addReview({
      targetType: 'product',
      targetId: product.id,
      author: 'You',
      stars,
      text: t,
      date: new Date().toISOString().slice(0, 10),
    });
    setText('');
    setStars(5);
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <Image source={{ uri: product.imageUrl }} style={styles.hero} />
          <Pressable style={[styles.backFab, { top: insets.top + 8 }]} onPress={goBack}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Pressable
            style={[styles.saveFab, { top: insets.top + 8 }]}
            onPress={() => toggleSaveProduct(product.id)}
          >
            <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={colors.green} />
          </Pressable>
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>{product.price}</Text>
          <Pressable
            onPress={() => navigation.navigate('ProducerDetail', { producerId: producer.id })}
            style={styles.producerLink}
          >
            <Text style={styles.producerLabel}>Sold by </Text>
            <Text style={styles.producerName}>{producer.name}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.green} />
          </Pressable>
          <Text style={styles.cat}>{product.categoryLabel}</Text>

          <Text style={styles.section}>Reviews</Text>
          {list.map((r) => (
            <ReviewLine key={r.id} r={r} />
          ))}

          <Text style={styles.section}>Add a review</Text>
          <StarInput value={stars} onChange={setStars} />
          <TextInput
            style={styles.input}
            placeholder="Share your experience…"
            placeholderTextColor={colors.textSecondary}
            multiline
            value={text}
            onChangeText={setText}
          />
          <Pressable style={styles.submit} onPress={submit}>
            <Text style={styles.submitText}>Post review</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function ReviewLine({ r }: { r: Review }) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewTop}>
        <Text style={styles.reviewAuthor}>{r.author}</Text>
        <View style={styles.starRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
              key={i}
              name={i < r.stars ? 'star' : 'star-outline'}
              size={14}
              color={colors.star}
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewText}>{r.text}</Text>
      <Text style={styles.reviewDate}>{r.date}</Text>
    </View>
  );
}

function StarInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <View style={styles.starPick}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Pressable key={i} onPress={() => onChange(i + 1)}>
          <Ionicons name={i < value ? 'star' : 'star-outline'} size={28} color={colors.star} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  miss: { flex: 1, padding: 16 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  backT: { fontSize: 17, color: colors.green, fontWeight: '500' },
  heroWrap: { position: 'relative' },
  hero: { width: '100%', height: 240, backgroundColor: colors.border },
  backFab: {
    position: 'absolute',
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  saveFab: {
    position: 'absolute',
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  body: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  price: { fontSize: 20, fontWeight: '700', color: colors.green, marginTop: 6 },
  producerLink: { flexDirection: 'row', alignItems: 'center', marginTop: 12, flexWrap: 'wrap' },
  producerLabel: { fontSize: 15, color: colors.textSecondary },
  producerName: { fontSize: 15, fontWeight: '700', color: colors.green },
  cat: { fontSize: 13, color: colors.textSecondary, marginTop: 6 },
  section: { fontSize: 18, fontWeight: '700', marginTop: 22, marginBottom: 10, color: colors.text },
  reviewCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewAuthor: { fontWeight: '700', fontSize: 15 },
  starRow: { flexDirection: 'row', gap: 2 },
  reviewText: { marginTop: 8, fontSize: 15, lineHeight: 21, color: colors.text },
  reviewDate: { marginTop: 6, fontSize: 12, color: colors.textSecondary },
  starPick: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  input: {
    minHeight: 88,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: colors.white,
  },
  submit: {
    marginTop: 12,
    backgroundColor: colors.green,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: { color: colors.white, fontWeight: '700', fontSize: 16 },
});
