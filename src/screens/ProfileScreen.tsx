import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { rootNavigationRef } from '../navigation/rootNavigationRef';
import { colors } from '../theme/colors';

function MenuSection({
  title,
  items,
}: {
  title: string;
  items: { icon: keyof typeof Ionicons.glyphMap; label: string }[];
}) {
  return (
    <View style={styles.menuCard}>
      <Text style={styles.menuSectionTitle}>{title}</Text>
      {items.map((item) => (
        <Pressable key={item.label} style={styles.menuRow}>
          <Ionicons name={item.icon} size={22} color={colors.textSecondary} />
          <Text style={styles.menuLabel}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </Pressable>
      ))}
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <View style={styles.headerBlock}>
        <View style={{ paddingTop: insets.top + 8, paddingBottom: 8, alignItems: 'center' }}>
          <Text style={styles.brandLogo}>Rooted</Text>
          <Text style={styles.brandTag}>Find fresh, local produce near you.</Text>
        </View>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.green} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.member}>member since Jan 2024</Text>
          </View>
        </View>
        <View style={styles.statsBar}>
          <StatItem label="Producers Visited" value="15" />
          <StatItem label="Producers Rated" value="8" />
          <StatItem label="Events Attended" value="3" />
          <StatItem
            label="Avg Rating Given"
            value="4.9"
            icon={<Ionicons name="star" size={12} color={colors.star} />}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Pressable
          style={styles.producerCard}
          onPress={() => {
            if (rootNavigationRef.isReady()) {
              rootNavigationRef.navigate('Producer');
            }
          }}
        >
          <View style={styles.producerIcon}>
            <Ionicons name="storefront-outline" size={22} color={colors.green} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.producerTitle}>Switch to Producer View</Text>
            <Text style={styles.producerSub}>Manage your products and sales.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </Pressable>

        <MenuSection
          title="ACCOUNT"
          items={[
            { icon: 'person-outline', label: 'Edit Profile' },
            { icon: 'notifications-outline', label: 'Notifications' },
            { icon: 'settings-outline', label: 'Settings' },
          ]}
        />
        <MenuSection
          title="SUPPORT"
          items={[
            { icon: 'help-circle-outline', label: 'Help & Support' },
            { icon: 'shield-outline', label: 'Privacy Policy' },
          ]}
        />

        <Pressable style={styles.signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

function StatItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <View style={styles.stat}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Text style={styles.statValue}>{value}</Text>
        {icon}
      </View>
      <Text style={styles.statLabel} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  brandLogo: {
    color: colors.white,
    fontSize: 28,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    fontWeight: '700',
  },
  brandTag: {
    marginTop: 6,
    color: colors.white,
    fontSize: 13,
    opacity: 0.95,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  headerBlock: {
    backgroundColor: colors.green,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
  },
  member: {
    marginTop: 4,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  statsBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    gap: 4,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 9,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  body: {
    padding: 16,
    gap: 14,
  },
  producerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  producerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.greenTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  producerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  producerSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    letterSpacing: 0.5,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  signOut: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.red,
  },
});
