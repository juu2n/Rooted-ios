import type { NavigatorScreenParams } from '@react-navigation/native';

export type MapStackParamList = {
  MapHome: undefined;
  MarketDetail: { marketId: string };
};

export type SearchStackParamList = {
  SearchMain: undefined;
  ProductDetail: { productId: string };
  ProducerDetail: { producerId: string };
};

export type RootTabParamList = {
  MapTab: undefined;
  Search: NavigatorScreenParams<SearchStackParamList>;
  Events: undefined;
  Saved: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Consumer: undefined;
  Producer: undefined;
};

export type ProducerInventoryStackParamList = {
  InventoryList: undefined;
  AddProduct: { sheet: 'quick' | 'manual' };
};

export type ProducerTabParamList = {
  ProducerAnalytics: undefined;
  ProducerInventory: NavigatorScreenParams<ProducerInventoryStackParamList>;
  ProducerMarkets: undefined;
  ProducerProfileHub: undefined;
};
