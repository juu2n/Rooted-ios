import type { Product } from '../types';
import { producerById } from './producers';

export const PRODUCTS: Product[] = [
  {
    id: 'pr1',
    name: 'Organic Tomatoes',
    price: '$4.99',
    category: 'featured',
    producerId: 'p1',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80',
    categoryLabel: 'Vegetables',
  },
  {
    id: 'pr2',
    name: 'Heirloom Carrots',
    price: '$3.50',
    category: 'vegetables',
    producerId: 'p7',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80',
    categoryLabel: 'Vegetables',
  },
  {
    id: 'pr3',
    name: 'Sourdough Loaf',
    price: '$7.00',
    category: 'bakery',
    producerId: 'p6',
    imageUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=80',
    categoryLabel: 'Bakery',
  },
  {
    id: 'pr4',
    name: 'Croissants (4pk)',
    price: '$9.50',
    category: 'bakery',
    producerId: 'p6',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80',
    categoryLabel: 'Bakery',
  },
  {
    id: 'pr5',
    name: 'Farmstead Cheddar',
    price: '$12.00',
    category: 'dairy',
    producerId: 'p2',
    imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80',
    categoryLabel: 'Dairy',
  },
  {
    id: 'pr6',
    name: 'Whole Milk Quart',
    price: '$3.25',
    category: 'dairy',
    producerId: 'p2',
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80',
    categoryLabel: 'Dairy',
  },
  {
    id: 'pr7',
    name: 'Wildflower Bouquet',
    price: '$24.00',
    category: 'flowers',
    producerId: 'p5',
    imageUrl: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400&q=80',
    categoryLabel: 'Flowers',
  },
  {
    id: 'pr8',
    name: 'Sunflower Bunch',
    price: '$14.00',
    category: 'flowers',
    producerId: 'p5',
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&q=80',
    categoryLabel: 'Flowers',
  },
  {
    id: 'pr9',
    name: 'Honeycrisp Apples',
    price: '$5.99',
    category: 'fruits',
    producerId: 'p4',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80',
    categoryLabel: 'Fruits',
  },
  {
    id: 'pr10',
    name: 'Peach Basket',
    price: '$11.00',
    category: 'fruits',
    producerId: 'p4',
    imageUrl: 'https://images.unsplash.com/photo-1629828874514-d05b5cdb0ca9?w=400&q=80',
    categoryLabel: 'Fruits',
  },
  {
    id: 'pr11',
    name: 'Raw Wildflower Honey',
    price: '$16.00',
    category: 'honey',
    producerId: 'p3',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80',
    categoryLabel: 'Honey',
  },
  {
    id: 'pr12',
    name: 'Creamed Honey Jar',
    price: '$9.00',
    category: 'honey',
    producerId: 'p3',
    imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&q=80',
    categoryLabel: 'Honey',
  },
  {
    id: 'pr13',
    name: 'Shiitake Mushrooms',
    price: '$8.50',
    category: 'vegetables',
    producerId: 'p8',
    imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&q=80',
    categoryLabel: 'Vegetables',
  },
  {
    id: 'pr14',
    name: 'Kale Bunch',
    price: '$2.99',
    category: 'featured',
    producerId: 'p7',
    imageUrl: 'https://images.unsplash.com/photo-1524179091875-bf99a9a58af5?w=400&q=80',
    categoryLabel: 'Vegetables',
  },
  {
    id: 'pr15',
    name: 'Farm Eggs Dozen',
    price: '$6.50',
    category: 'dairy',
    producerId: 'p1',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80',
    categoryLabel: 'Dairy',
  },
];

export function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function productsByCategory(category: Product['category']): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function featuredProducersList() {
  return ['p1', 'p2', 'p3', 'p4'];
}

export function productWithProducer(p: Product) {
  const producer = producerById(p.producerId);
  return { product: p, producerName: producer?.name ?? 'Unknown' };
}
