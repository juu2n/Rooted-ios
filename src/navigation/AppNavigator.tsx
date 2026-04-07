import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapScreen from '../screens/MapScreen';
import MarketDetailScreen from '../screens/MarketDetailScreen';
import SearchScreen from '../screens/SearchScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProducerDetailScreen from '../screens/ProducerDetailScreen';
import EventsScreen from '../screens/EventsScreen';
import SavedScreen from '../screens/SavedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProducerAddProductScreen from '../screens/producer/ProducerAddProductScreen';
import ProducerAnalyticsScreen from '../screens/producer/ProducerAnalyticsScreen';
import ProducerInventoryScreen from '../screens/producer/ProducerInventoryScreen';
import ProducerMarketsScreen from '../screens/producer/ProducerMarketsScreen';
import ProducerProfileHubScreen from '../screens/producer/ProducerProfileHubScreen';
import { colors } from '../theme/colors';
import { rootNavigationRef } from './rootNavigationRef';
import type {
  MapStackParamList,
  ProducerInventoryStackParamList,
  ProducerTabParamList,
  RootStackParamList,
  RootTabParamList,
  SearchStackParamList,
} from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const MapStack = createNativeStackNavigator<MapStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();
const ProducerTab = createBottomTabNavigator<ProducerTabParamList>();
const InvStack = createNativeStackNavigator<ProducerInventoryStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
  },
};

function MapStackNavigator() {
  return (
    <MapStack.Navigator screenOptions={{ headerShown: false }}>
      <MapStack.Screen name="MapHome" component={MapScreen} />
      <MapStack.Screen name="MarketDetail" component={MarketDetailScreen} />
    </MapStack.Navigator>
  );
}

function SearchStackNavigator() {
  return (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name="SearchMain" component={SearchScreen} />
      <SearchStack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <SearchStack.Screen name="ProducerDetail" component={ProducerDetailScreen} />
    </SearchStack.Navigator>
  );
}

function ConsumerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size, focused }) => {
          const n = route.name;
          const map: Record<
            keyof RootTabParamList,
            { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap }
          > = {
            MapTab: { on: 'location', off: 'location-outline' },
            Search: { on: 'search', off: 'search-outline' },
            Events: { on: 'calendar', off: 'calendar-outline' },
            Saved: { on: 'bookmark', off: 'bookmark-outline' },
            Profile: { on: 'person', off: 'person-outline' },
          };
          const icons = map[n];
          return <Ionicons name={focused ? icons.on : icons.off} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="MapTab" component={MapStackNavigator} options={{ tabBarLabel: 'Map' }} />
      <Tab.Screen name="Search" component={SearchStackNavigator} options={{ tabBarLabel: 'Search' }} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function ProducerInventoryStackNav() {
  return (
    <InvStack.Navigator screenOptions={{ headerShown: false }}>
      <InvStack.Screen name="InventoryList" component={ProducerInventoryScreen} />
      <InvStack.Screen name="AddProduct" component={ProducerAddProductScreen} />
    </InvStack.Navigator>
  );
}

function ProducerTabNavigator() {
  return (
    <ProducerTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size, focused }) => {
          const map: Record<
            keyof ProducerTabParamList,
            { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap }
          > = {
            ProducerAnalytics: { on: 'bar-chart', off: 'bar-chart-outline' },
            ProducerInventory: { on: 'cube', off: 'cube-outline' },
            ProducerMarkets: { on: 'storefront', off: 'storefront-outline' },
            ProducerProfileHub: { on: 'person', off: 'person-outline' },
          };
          const icons = map[route.name];
          return <Ionicons name={focused ? icons.on : icons.off} size={size} color={color} />;
        },
      })}
    >
      <ProducerTab.Screen name="ProducerAnalytics" component={ProducerAnalyticsScreen} options={{ title: 'Analytics' }} />
      <ProducerTab.Screen
        name="ProducerInventory"
        component={ProducerInventoryStackNav}
        options={{ title: 'Inventory' }}
      />
      <ProducerTab.Screen name="ProducerMarkets" component={ProducerMarketsScreen} options={{ title: 'Markets' }} />
      <ProducerTab.Screen
        name="ProducerProfileHub"
        component={ProducerProfileHubScreen}
        options={{ title: 'Profile' }}
      />
    </ProducerTab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer ref={rootNavigationRef} theme={navTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Consumer">
        <RootStack.Screen name="Consumer" component={ConsumerTabNavigator} />
        <RootStack.Screen name="Producer" component={ProducerTabNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    paddingTop: 6,
    height: Platform.OS === 'ios' ? 88 : 64,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
