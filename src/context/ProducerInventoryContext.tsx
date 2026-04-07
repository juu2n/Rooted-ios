import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from '../data/products';
import type { InventorySheet, InventoryStatus, ProducerInventoryItem } from '../types/producer';

const STORAGE = '@rooted/producer_inventory_p1_v1';
const PRODUCER_ID = 'p1';

function seedFromProducts(): ProducerInventoryItem[] {
  const rows = PRODUCTS.filter((p) => p.producerId === PRODUCER_ID).map((p) => ({
    id: p.id,
    name: p.name,
    categoryLabel: p.categoryLabel,
    price: p.price,
    status: 'available' as InventoryStatus,
    imageUrl: p.imageUrl,
    sheet: 'quick' as InventorySheet,
  }));

  const demo: ProducerInventoryItem[] = [
    {
      id: 'inv-heirloom',
      name: 'Heirloom Tomatoes',
      categoryLabel: 'Vegetables',
      price: '$6.99',
      status: 'sold_out',
      statusNote: 'Sold Out (2h)',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&q=80',
      sheet: 'quick',
    },
    {
      id: 'inv-honey',
      name: 'Wildflower Honey',
      categoryLabel: 'Honey',
      price: '$14.00',
      status: 'available',
      imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&q=80',
      sheet: 'manual',
    },
    {
      id: 'inv-sourdough',
      name: 'Sourdough Bread',
      categoryLabel: 'Bakery',
      price: '$8.50',
      status: 'limited',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80',
      sheet: 'manual',
    },
  ];

  const merged = [...demo];
  for (const r of rows) {
    if (!merged.some((m) => m.id === r.id)) merged.push(r);
  }
  return merged;
}

type Ctx = {
  items: ProducerInventoryItem[];
  addItem: (item: Omit<ProducerInventoryItem, 'id'> & { id?: string }) => void;
  updateStatus: (id: string, status: InventoryStatus, statusNote?: string) => void;
  hydrated: boolean;
};

const ProducerInventoryContext = createContext<Ctx | null>(null);

export function ProducerInventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ProducerInventoryItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE);
        if (raw) {
          setItems(JSON.parse(raw) as ProducerInventoryItem[]);
        } else {
          const s = seedFromProducts();
          setItems(s);
          await AsyncStorage.setItem(STORAGE, JSON.stringify(s));
        }
      } catch {
        setItems(seedFromProducts());
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE, JSON.stringify(items)).catch(() => {});
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<ProducerInventoryItem, 'id'> & { id?: string }) => {
    const id = item.id ?? `inv-${Date.now()}`;
    setItems((prev) => [...prev, { ...item, id } as ProducerInventoryItem]);
  }, []);

  const updateStatus = useCallback((id: string, status: InventoryStatus, statusNote?: string) => {
    setItems((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              status,
              statusNote:
                status === 'sold_out'
                  ? statusNote ?? 'Sold Out'
                  : status === 'limited'
                    ? statusNote
                    : undefined,
            }
          : x,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({ items, addItem, updateStatus, hydrated }),
    [items, addItem, updateStatus, hydrated],
  );

  return <ProducerInventoryContext.Provider value={value}>{children}</ProducerInventoryContext.Provider>;
}

export function useProducerInventory() {
  const c = useContext(ProducerInventoryContext);
  if (!c) throw new Error('useProducerInventory outside Provider');
  return c;
}
