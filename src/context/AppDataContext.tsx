import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SEED_REVIEWS } from '../data/seedReviews';
import type { Review } from '../types';

const K_SAVED = '@rooted/saved_v1';
const K_EXTRA_REVIEWS = '@rooted/reviews_extra_v1';

type SavedState = {
  productIds: string[];
  producerIds: string[];
  eventIds: string[];
};

const emptySaved: SavedState = {
  productIds: [],
  producerIds: [],
  eventIds: [],
};

type Ctx = {
  saved: SavedState;
  toggleSaveProduct: (id: string) => void;
  toggleSaveProducer: (id: string) => void;
  toggleSaveEvent: (id: string) => void;
  isProductSaved: (id: string) => boolean;
  isProducerSaved: (id: string) => boolean;
  isEventSaved: (id: string) => boolean;
  reviews: Review[];
  addReview: (r: Omit<Review, 'id'>) => void;
  reviewsFor: (targetType: Review['targetType'], targetId: string) => Review[];
};

const AppDataContext = createContext<Ctx | null>(null);

function uniqToggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<SavedState>(emptySaved);
  const [extraReviews, setExtraReviews] = useState<Review[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [s, r] = await Promise.all([AsyncStorage.getItem(K_SAVED), AsyncStorage.getItem(K_EXTRA_REVIEWS)]);
        if (s) setSaved(JSON.parse(s) as SavedState);
        if (r) setExtraReviews(JSON.parse(r) as Review[]);
      } catch {
        /* ignore */
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(K_SAVED, JSON.stringify(saved)).catch(() => {});
  }, [saved, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(K_EXTRA_REVIEWS, JSON.stringify(extraReviews)).catch(() => {});
  }, [extraReviews, hydrated]);

  const reviews = useMemo(() => [...SEED_REVIEWS, ...extraReviews], [extraReviews]);

  const toggleSaveProduct = useCallback((id: string) => {
    setSaved((prev) => ({ ...prev, productIds: uniqToggle(prev.productIds, id) }));
  }, []);
  const toggleSaveProducer = useCallback((id: string) => {
    setSaved((prev) => ({ ...prev, producerIds: uniqToggle(prev.producerIds, id) }));
  }, []);
  const toggleSaveEvent = useCallback((id: string) => {
    setSaved((prev) => ({ ...prev, eventIds: uniqToggle(prev.eventIds, id) }));
  }, []);

  const isProductSaved = useCallback((id: string) => saved.productIds.includes(id), [saved.productIds]);
  const isProducerSaved = useCallback((id: string) => saved.producerIds.includes(id), [saved.producerIds]);
  const isEventSaved = useCallback((id: string) => saved.eventIds.includes(id), [saved.eventIds]);

  const addReview = useCallback((r: Omit<Review, 'id'>) => {
    const id = `u-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setExtraReviews((prev) => [...prev, { ...r, id }]);
  }, []);

  const reviewsFor = useCallback(
    (targetType: Review['targetType'], targetId: string) =>
      reviews.filter((x) => x.targetType === targetType && x.targetId === targetId),
    [reviews],
  );

  const value = useMemo(
    () => ({
      saved,
      toggleSaveProduct,
      toggleSaveProducer,
      toggleSaveEvent,
      isProductSaved,
      isProducerSaved,
      isEventSaved,
      reviews,
      addReview,
      reviewsFor,
    }),
    [
      saved,
      toggleSaveProduct,
      toggleSaveProducer,
      toggleSaveEvent,
      isProductSaved,
      isProducerSaved,
      isEventSaved,
      reviews,
      addReview,
      reviewsFor,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const c = useContext(AppDataContext);
  if (!c) throw new Error('useAppData outside AppDataProvider');
  return c;
}
