import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RootedHeader } from '../components/RootedHeader';
import { useAppData } from '../context/AppDataContext';
import { eventById } from '../data/events';
import { producerById } from '../data/producers';
import { productById } from '../data/products';
import type { RootTabParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Chip = 'all' | 'products' | 'producers' | 'events';

export default function SavedScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { saved, toggleSaveProduct, toggleSaveProducer, toggleSaveEvent } = useAppData();
  const [chip, setChip] = useState<Chip>('all');

  const counts = useMemo(
    () => ({
      all: saved.productIds.length + saved.producerIds.length + saved.eventIds.length,
      products: saved.productIds.length,
      producers: saved.producerIds.length,
      events: saved.eventIds.length,
    }),
    [saved],
  );

  const showProducts = chip === 'all' || chip === 'products';
  const showProducers = chip === 'all' || chip === 'producers';
  const showEvents = chip === 'all' || chip === 'events';

  const empty = counts.all === 0;

  return (
    <View style={styles.root}>
      <RootedHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Saved Items</Text>
        <Text style={styles.sub}>
          Your bookmarked markets, producers, products, and events.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {(
            [
              { id: 'all' as const, label: 'All' },
              { id: 'products' as const, label: 'Products' },
              { id: 'producers' as const, label: 'Producers' },
              { id: 'events' as const, label: 'Events' },
            ] as const
          ).map((c) => (
            <Pressable
              key={c.id}
              onPress={() => setChip(c.id)}
              style={[styles.chip, chip === c.id && styles.chipOn]}
            >
              <Text style={[styles.chipText, chip === c.id && styles.chipTextOn]}>
                {c.label} ({counts[c.id]})
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {empty ? (
          <View style={styles.empty}>
            <Ionicons name="bookmark-outline" size={72} color={colors.border} />
            <Text style={styles.emptyTitle}>No saved items yet</Text>
            <Text style={styles.emptySub}>
              Save products, producers, or events from Search and Events tabs.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {showProducts &&
              saved.productIds.map((id) => {
                const p = productById(id);
                if (!p) return null;
                const pr = producerById(p.producerId);
                return (
                  <Pressable
                    key={id}
                    style={styles.row}
                    onPress={() =>
                      navigation.navigate('Search', {
                        screen: 'ProductDetail',
                        params: { productId: id },
                      })
                    }
                  >
                    <Image source={{ uri: p.imageUrl }} style={styles.thumb} />
                    <View style={styles.rowBody}>
                      <Text style={styles.rowTitle}>{p.name}</Text>
                      <Text style={styles.rowSub}>{pr?.name ?? 'Product'}</Text>
                    </View>
                    <Pressable
                      onPress={() => toggleSaveProduct(id)}
                      hitSlop={10}
                      style={styles.trash}
                    >
                      <Ionicons name="trash-outline" size={22} color={colors.red} />
                    </Pressable>
                  </Pressable>
                );
              })}

            {showProducers &&
              saved.producerIds.map((id) => {
                const p = producerById(id);
                if (!p) return null;
                return (
                  <Pressable
                    key={id}
                    style={styles.row}
                    onPress={() =>
                      navigation.navigate('Search', {
                        screen: 'ProducerDetail',
                        params: { producerId: id },
                      })
                    }
                  >
                    <Image source={{ uri: p.avatarUrl }} style={styles.thumbRound} />
                    <View style={styles.rowBody}>
                      <Text style={styles.rowTitle}>{p.name}</Text>
                      <Text style={styles.rowSub}>{p.subtitle}</Text>
                    </View>
                    <Pressable
                      onPress={() => toggleSaveProducer(id)}
                      hitSlop={10}
                      style={styles.trash}
                    >
                      <Ionicons name="trash-outline" size={22} color={colors.red} />
                    </Pressable>
                  </Pressable>
                );
              })}

            {showEvents &&
              saved.eventIds.map((id) => {
                const e = eventById(id);
                if (!e) return null;
                return (
                  <View key={id} style={styles.row}>
                    <Image source={{ uri: e.imageUrl }} style={styles.thumb} />
                    <View style={styles.rowBody}>
                      <Text style={styles.rowTitle}>{e.title}</Text>
                      <Text style={styles.rowSub}>
                        {e.dateLabel} · {e.location}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => toggleSaveEvent(id)}
                      hitSlop={10}
                      style={styles.trash}
                    >
                      <Ionicons name="trash-outline" size={22} color={colors.red} />
                    </Pressable>
                  </View>
                );
              })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  sub: {
    marginTop: 8,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  chips: {
    marginTop: 20,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipOn: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  chipText: {
    fontWeight: '600',
    color: colors.text,
  },
  chipTextOn: {
    color: colors.white,
  },
  empty: {
    marginTop: 48,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptySub: {
    marginTop: 8,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  list: {
    marginTop: 16,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: colors.border,
  },
  thumbRound: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.border,
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  rowSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  trash: {
    padding: 6,
  },
});
