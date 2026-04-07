import type { Producer } from '../types';

export const PRODUCERS: Producer[] = [
  {
    id: 'p1',
    name: 'Sunny Acres Farm',
    subtitle: '12 products • Weekly',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=120&q=80',
  },
  {
    id: 'p2',
    name: 'Hudson Valley Dairy',
    subtitle: '8 products • Sat only',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=120&q=80',
  },
  {
    id: 'p3',
    name: 'Brooklyn Bee Co.',
    subtitle: '5 products • Bi-weekly',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1473973266401-ed9ebbb2d062?w=120&q=80',
  },
  {
    id: 'p4',
    name: 'Peach Tree Orchard',
    subtitle: '6 products • Seasonal',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1590830296166-849f9e6d86cd?w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=120&q=80',
  },
  {
    id: 'p5',
    name: 'Rose & Thorn Flowers',
    subtitle: '15 bouquets • Weekly',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=120&q=80',
  },
  {
    id: 'p6',
    name: 'Stone Mill Bakery',
    subtitle: '20 items • Daily',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=120&q=80',
  },
  {
    id: 'p7',
    name: 'GreenLeaf Organics',
    subtitle: '18 vegetables • Weekly',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=120&q=80',
  },
  {
    id: 'p8',
    name: 'Catskill Mushrooms',
    subtitle: '7 varieties • Weekly',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1567702253054-4f4e5a093c8d?w=600&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1595199271682-3e45a57af240?w=120&q=80',
  },
];

export function producerById(id: string): Producer | undefined {
  return PRODUCERS.find((p) => p.id === id);
}
