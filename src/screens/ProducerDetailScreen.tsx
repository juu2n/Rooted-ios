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
import { PRODUCTS } from '../data/products';
import type { SearchStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import type { Review } from '../types';

type R = RouteProp<SearchStackParamList, 'ProducerDetail'>;

export default function ProducerDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SearchStackParamList>>();
  const { goBack } = navigation;
  const { params } = useRoute<R>();
  const insets = useSafeAreaInsets();
  const { isProducerSaved, toggleSaveProducer, reviewsFor, addReview } = useAppData();
  const producer = producerById(params.producerId);
  const saved = producer ? isProducerSaved(producer.id) : false;

  const products = useMemo(
    () => (producer ? PRODUCTS.filter((p) => p.producerId === producer.id) : []),
    [producer],
  );

  const list = useMemo(
    () => (producer ? reviewsFor('producer', producer.id) : []),
    [producer, reviewsFor],
  );

  const [stars, setStars] = useState(5);
  const [text, setText] = useState('');

  if (!producer) {
    return (
      <View style={[styles.miss, { paddingTop: insets.top }]}>
        <Pressable onPress={goBack} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={colors.green} />
          <Text style={styles.backT}>Back</Text>
        </Pressable>
        <Text>Producer not found.</Text>
      </View>
    );
  }

  const submit = () => {
    const t = text.trim();
    if (!t || stars < 1) return;
    addReview({
      targetType: 'producer',
      targetId: producer.id,
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
          <Image source={{ uri: producer.imageUrl }} style={styles.hero} />
          <Pressable style={[styles.backFab, { top: insets.top + 8 }]} onPress={goBack}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Pressable
            style={[styles.saveFab, { top: insets.top + 8 }]}
            onPress={() => toggleSaveProducer(producer.id)}
          >
            <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={colors.green} />
          </Pressable>
          <View style={styles.avatar}>
            <Image source={{ uri: producer.avatarUrl }} style={styles.avatarImg} />
          </View>
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>{producer.name}</Text>
          <Text style={styles.sub}>{producer.subtitle}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingNum}>{producer.rating.toFixed(1)}</Text>
            <Ionicons name="star" size={18} color={colors.star} />
            <Text style={styles.ratingHint}> average from Rooted shoppers</Text>
          </View>

          {products.length > 0 ? (
            <>
              <Text style={styles.section}>Their products</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pRow}>
                {products.map((p) => (
                  <Pressable
                    key={p.id}
                    style={styles.miniCard}
                    onPress={() => navigation.navigate('ProductDetail', { productId: p.id })}
                  >
                    <Image source={{ uri: p.imageUrl }} style={styles.miniImg} />
                    <Text style={styles.miniName} numberOfLines={2}>
                      {p.name}
                    </Text>
                    <Text style={styles.miniPrice}>{p.price}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          ) : null}

          <Text style={styles.section}>Reviews</Text>
          {list.map((r) => (
            <ReviewLine key={r.id} r={r} />
          ))}

          <Text style={styles.section}>Add a review</Text>
          <StarInput value={stars} onChange={setStars} />
          <TextInput
            style={styles.input}
            placeholder="Tell others about this producer…"
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
  hero: { width: '100%', height: 200, backgroundColor: colors.border },
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
  avatar: {
    position: 'absolute',
    bottom: -32,
    left: 20,
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: colors.white,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  avatarImg: { width: '100%', height: '100%' },
  body: { padding: 20, paddingTop: 44, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  sub: { fontSize: 14, color: colors.textSecondary, marginTop: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 4 },
  ratingNum: { fontSize: 18, fontWeight: '700' },
  ratingHint: { fontSize: 13, color: colors.textSecondary },
  section: { fontSize: 18, fontWeight: '700', marginTop: 22, marginBottom: 10, color: colors.text },
  pRow: { gap: 12 },
  miniCard: { width: 120 },
  miniImg: { width: 120, height: 100, borderRadius: 12, backgroundColor: colors.border },
  miniName: { marginTop: 6, fontSize: 13, fontWeight: '600' },
  miniPrice: { fontSize: 13, fontWeight: '700', color: colors.green, marginTop: 2 },
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
