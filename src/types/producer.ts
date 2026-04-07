export type InventorySheet = 'quick' | 'manual';

export type InventoryStatus = 'available' | 'limited' | 'sold_out';

export type ProducerInventoryItem = {
  id: string;
  name: string;
  categoryLabel: string;
  price: string;
  status: InventoryStatus;
  imageUrl: string;
  sheet: InventorySheet;
  /** e.g. Sold Out (2h) */
  statusNote?: string;
};
