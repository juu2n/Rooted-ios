export type ProductCategory =
  | 'featured'
  | 'bakery'
  | 'dairy'
  | 'flowers'
  | 'fruits'
  | 'honey'
  | 'vegetables';

export type Market = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  description: string;
  phone: string;
  /** 24h decimal hour, e.g. 8 = 8:00, 13.5 = 1:30 PM */
  openHour: number;
  closeHour: number;
  days: string;
  imageUrl: string;
  producerIds: string[];
  /** Product types available at this market (for map filters). */
  categories: Exclude<ProductCategory, 'featured'>[];
  markerKind: 'stall' | 'star' | 'pin' | 'building';
  clusterCount?: number;
};

export type Producer = {
  id: string;
  name: string;
  subtitle: string;
  rating: number;
  imageUrl: string;
  avatarUrl: string;
};

export type Product = {
  id: string;
  name: string;
  price: string;
  category: ProductCategory;
  producerId: string;
  imageUrl: string;
  categoryLabel: string;
};

export type EventSection = 'featured' | 'seasonal' | 'workshop' | 'tasting';

export type MarketEvent = {
  id: string;
  title: string;
  section: EventSection;
  badge: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  imageUrl: string;
  tags: ('all' | 'chef' | 'kids' | 'music')[];
};

export type Review = {
  id: string;
  targetType: 'product' | 'producer';
  targetId: string;
  author: string;
  stars: number;
  text: string;
  date: string;
};
