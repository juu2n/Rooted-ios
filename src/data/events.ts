import type { MarketEvent } from '../types';

export const EVENTS: MarketEvent[] = [
  {
    id: 'e1',
    title: 'Holiday Market Special',
    section: 'featured',
    badge: 'Seasonal Festivals',
    dateLabel: 'Fri, Jan 3',
    timeLabel: '8:00 AM - 2:00 PM',
    location: 'Downtown Farmers Market',
    imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
    tags: ['all', 'chef'],
  },
  {
    id: 'e2',
    title: 'Kids Seed Planting',
    section: 'featured',
    badge: 'Family',
    dateLabel: 'Sat, Jan 11',
    timeLabel: '10:00 AM - 11:30 AM',
    location: 'Union Square Greenmarket',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    tags: ['all', 'kids'],
  },
  {
    id: 'e3',
    title: 'Winter Harvest Festival',
    section: 'seasonal',
    badge: 'Seasonal Festivals',
    dateLabel: 'Sun, Jan 19',
    timeLabel: '9:00 AM - 3:00 PM',
    location: 'Brooklyn Borough Hall',
    imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
    tags: ['all', 'music'],
  },
  {
    id: 'e4',
    title: 'Maple Weekend Pop-up',
    section: 'seasonal',
    badge: 'Seasonal Festivals',
    dateLabel: 'Sat, Feb 1',
    timeLabel: '8:00 AM - 1:00 PM',
    location: 'Prospect Park Market',
    imageUrl: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=800&q=80',
    tags: ['all', 'chef'],
  },
  {
    id: 'e5',
    title: 'Knife Skills for Veg Prep',
    section: 'workshop',
    badge: 'Workshop',
    dateLabel: 'Thu, Jan 16',
    timeLabel: '6:00 PM - 7:30 PM',
    location: 'Chelsea Market Annex',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
    tags: ['all', 'chef'],
  },
  {
    id: 'e6',
    title: 'Cheese Pairing 101',
    section: 'workshop',
    badge: 'Workshop',
    dateLabel: 'Wed, Jan 22',
    timeLabel: '5:30 PM - 7:00 PM',
    location: 'Tribeca Greenmarket',
    imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80',
    tags: ['all', 'chef'],
  },
  {
    id: 'e7',
    title: 'Honey & Tea Tasting',
    section: 'tasting',
    badge: 'Tasting',
    dateLabel: 'Sun, Jan 12',
    timeLabel: '11:00 AM - 2:00 PM',
    location: 'Brooklyn Bee Co. Stall',
    imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80',
    tags: ['all', 'music'],
  },
  {
    id: 'e8',
    title: 'Cider & Apple Flight',
    section: 'tasting',
    badge: 'Tasting',
    dateLabel: 'Sat, Jan 25',
    timeLabel: '1:00 PM - 4:00 PM',
    location: 'Peach Tree Orchard Booth',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&q=80',
    tags: ['all', 'kids'],
  },
];

export type EventFilterId = 'all' | 'chef' | 'kids' | 'music';

export const EVENT_FILTER_PILLS: { id: EventFilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'chef', label: 'Chef Demos' },
  { id: 'kids', label: 'Kids' },
  { id: 'music', label: 'Live Music' },
];

export function eventsForSection(section: MarketEvent['section'], filter: EventFilterId): MarketEvent[] {
  return EVENTS.filter((e) => {
    if (e.section !== section) return false;
    if (filter === 'all') return true;
    return e.tags.includes(filter);
  });
}

export function eventById(id: string): MarketEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}
