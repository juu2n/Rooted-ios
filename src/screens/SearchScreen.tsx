import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { RootedHeader } from '../components/RootedHeader';
import { useAppData } from '../context/AppDataContext';
import { producerById } from '../data/producers';
import { featuredProducersList, productWithProducer, productsByCategory } from '../data/products';
import type { SearchStackParamList } from '../navigation/types';
import type { Product, ProductCategory, Producer } from '../types';
import { colors } from '../theme/colors';

const CATEGORY_SECTIONS: { title: string; subtitle?: string; category: ProductCategory }[] = [
  { title: 'Bakery', category: 'bakery' },
  { title: 'Dairy', category: 'dairy' },
  { title: 'Flowers', category: 'flowers' },
  { title: 'Fruits', category: 'fruits' },
  { title: 'Honey', category: 'honey' },
  { title: 'Vegetables', category: 'vegetables' },
];

function ProducerCard({
  p,
  saved,
  onOpen,
  onToggleSave,
}: {
  p: Producer;
  saved: boolean;
  onOpen: () => void;
  onToggleSave: () => void;
}) {
  return (
    <View style={styles.producerCard}>
      <Pressable onPress={onOpen}>
        <Image source={{ uri: p.imageUrl }} style={styles.producerImg} />
        <View style={styles.producerAvatar}>
          <Image source={{ uri: p.avatarUrl }} style={styles.producerAvatarImg} />
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingBadgeText}>{p.rating.toFixed(1)}</Text>
          <Ionicons name="star" size={10} color={colors.star} />
        </View>
        <View style={styles.producerFooter}>
          <Text style={styles.producerName}>{p.name}</Text>
          <Text style={styles.producerSub}>{p.subtitle}</Text>
        </View>
      </Pressable>
      <Pressable style={[styles.producerSaveTop, saved && styles.savePillOn]} onPress={onToggleSave}>
        <Text style={[styles.savePillText, saved && styles.savePillTextOn]}>{saved ? 'Saved' : 'Save'}</Text>
      </Pressable>
    </View>
  );
}

function ProductCard({
  product,
  producerName,
  saved,
  onOpen,
  onToggleSave,
}: {
  product: Product;
  producerName: string;
  saved: boolean;
  onOpen: () => void;
  onToggleSave: () => void;
}) {
  return (
    <View style={styles.productCard}>
      <View style={styles.productImgWrap}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onOpen}>
          <Image source={{ uri: product.imageUrl }} style={styles.productImg} />
          <View style={styles.productProducerTag}>
            <Text style={styles.productProducerText} numberOfLines={1}>
              {producerName}
            </Text>
          </View>
        </Pressable>
        <Pressable style={styles.productBookmark} onPress={onToggleSave}>
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={colors.white} />
        </Pressable>
      </View>
      <Pressable onPress={onOpen}>
        <View style={styles.productRow}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.productPrice}>{product.price}</Text>
        </View>
        <Text style={styles.productCat}>{product.categoryLabel}</Text>
      </Pressable>
    </View>
  );
}

export default function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SearchStackParamList, 'SearchMain'>>();
  const { isProductSaved, isProducerSaved, toggleSaveProduct, toggleSaveProducer } = useAppData();

  const featuredProducerIds = featuredProducersList();
  const featuredProducers = featuredProducerIds.map((id) => producerById(id)).filter(Boolean) as Producer[];
  const featuredProducts = productsByCategory('featured').map(productWithProducer);

  return (
    <View style={styles.root}>
      <RootedHeader />
      <View style={styles.searchRow}>
        <Pressable
          style={styles.iconBtn}
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
            else Keyboard.dismiss();
          }}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.searchField}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            placeholder="Search markets, producers, items"
            placeholderTextColor={colors.textSecondary}
            style={styles.searchInput}
          />
        </View>
        <Pressable style={styles.iconBtn} onPress={() => {}}>
          <Ionicons name="options-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Featured Producers</Text>
          <Pressable>
            <Text style={styles.seeAll}>See all &gt;</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {featuredProducers.map((p) => (
            <ProducerCard
              key={p.id}
              p={p}
              saved={isProducerSaved(p.id)}
              onOpen={() => navigation.navigate('ProducerDetail', { producerId: p.id })}
              onToggleSave={() => toggleSaveProducer(p.id)}
            />
          ))}
        </ScrollView>

        <View style={[styles.sectionHead, { marginTop: 8 }]}>
          <View>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <Text style={styles.sectionSub}>Fresh picks for you today</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {featuredProducts.map(({ product, producerName }) => (
            <ProductCard
              key={product.id}
              product={product}
              producerName={producerName}
              saved={isProductSaved(product.id)}
              onOpen={() => navigation.navigate('ProductDetail', { productId: product.id })}
              onToggleSave={() => toggleSaveProduct(product.id)}
            />
          ))}
        </ScrollView>

        {CATEGORY_SECTIONS.map((sec) => {
          const items = productsByCategory(sec.category).map(productWithProducer);
          if (items.length === 0) return null;
          return (
            <View key={sec.category}>
              <View style={[styles.sectionHead, { marginTop: 20 }]}>
                <Text style={styles.sectionTitle}>{sec.title}</Text>
                <Pressable>
                  <Text style={styles.seeAll}>See all &gt;</Text>
                </Pressable>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hScroll}
              >
                {items.map(({ product, producerName }) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    producerName={producerName}
                    saved={isProductSaved(product.id)}
                    onOpen={() => navigation.navigate('ProductDetail', { productId: product.id })}
                    onToggleSave={() => toggleSaveProduct(product.id)}
                  />
                ))}
              </ScrollView>
            </View>
          );
        })}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const CARD_W = 220;
const PROD_H = 200;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  iconBtn: {
    padding: 6,
  },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    padding: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  sectionSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.green,
  },
  hScroll: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 4,
  },
  producerCard: {
    width: CARD_W,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  producerImg: {
    width: '100%',
    height: PROD_H,
    backgroundColor: colors.border,
  },
  producerAvatar: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.white,
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  producerAvatarImg: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 72,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingBadgeText: {
    fontWeight: '700',
    fontSize: 12,
  },
  producerSaveTop: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.green,
    backgroundColor: colors.white,
    zIndex: 2,
  },
  producerFooter: {
    padding: 12,
    gap: 4,
  },
  producerName: {
    fontSize: 15,
    fontWeight: '700',
  },
  producerSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  savePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.green,
  },
  savePillOn: {
    backgroundColor: colors.green,
  },
  savePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.green,
  },
  savePillTextOn: {
    color: colors.white,
  },
  productCard: {
    width: 160,
  },
  productImgWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    height: 140,
    backgroundColor: colors.border,
  },
  productImg: {
    width: '100%',
    height: '100%',
  },
  productProducerTag: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  productProducerText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  productBookmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
  },
  productName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.green,
  },
  productCat: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
