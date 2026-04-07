import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProducerHeader } from '../../components/ProducerHeader';
import { producerById } from '../../data/producers';
import { rootNavigationRef } from '../../navigation/rootNavigationRef';
import { colors } from '../../theme/colors';

const p = producerById('p1')!;

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

export default function ProducerProfileHubScreen() {
  const insets = useSafeAreaInsets();
  const [bizName, setBizName] = useState(p.name);
  const [desc, setDesc] = useState(
    'Family-owned organic farm specializing in seasonal vegetables and herbs. Growing fresh produce for over 30 years.',
  );

  return (
    <View style={styles.root}>
      <View style={styles.headerBlock}>
        <ProducerHeader />
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Image source={{ uri: p.avatarUrl }} style={styles.avatarImg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.farmName}>{p.name}</Text>
            <Text style={styles.member}>member since Jan 2024</Text>
          </View>
        </View>
        <View style={styles.statsBar}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>2</Text>
            <Text style={styles.statLab}>Products</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>4</Text>
            <Text style={styles.statLab}>Markets</Text>
          </View>
          <View style={styles.stat}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.statNum}>{p.rating.toFixed(1)}</Text>
              <Ionicons name="star" size={14} color={colors.star} />
            </View>
            <Text style={styles.statLab}>Rating (142)</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.switchRow}
          onPress={() => rootNavigationRef.navigate('Consumer')}
        >
          <View style={styles.switchIcon}>
            <Ionicons name="bag-outline" size={22} color={colors.green} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchTitle}>Switch to Consumer View</Text>
            <Text style={styles.switchSub}>Browse markets and producers.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </Pressable>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Ionicons name="document-text-outline" size={20} color={colors.green} />
            <Text style={styles.cardTitle}>Public Information</Text>
          </View>
          <Text style={styles.fieldLabel}>Business Name</Text>
          <TextInput style={styles.input} value={bizName} onChangeText={setBizName} />
          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={desc}
            onChangeText={setDesc}
            multiline
            textAlignVertical="top"
          />
          <View style={styles.uploadRow}>
            <View style={styles.uploadBox}>
              <Ionicons name="cloud-upload-outline" size={28} color={colors.textSecondary} />
              <Text style={styles.uploadTxt}>Profile Picture</Text>
            </View>
            <View style={styles.uploadBox}>
              <Ionicons name="cloud-upload-outline" size={28} color={colors.textSecondary} />
              <Text style={styles.uploadTxt}>Cover Photo</Text>
            </View>
          </View>
          <Pressable style={styles.saveBtn}>
            <Text style={styles.saveBtnTxt}>Save public profile</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Ionicons name="ribbon-outline" size={20} color={colors.green} />
            <Text style={styles.cardTitle}>Certifications & Credentials</Text>
          </View>
          <Text style={styles.cardHint}>
            Upload certifications to build trust with customers (e.g., Organic, Non-GMO, Food Safety).
          </Text>
          <View style={styles.certRow}>
            <Ionicons name="checkmark-circle" size={22} color={colors.green} />
            <View style={{ flex: 1 }}>
              <Text style={styles.certTitle}>USDA Organic Certified</Text>
              <Text style={styles.certSub}>Expires: Dec 31, 2026</Text>
            </View>
            <Ionicons name="close" size={22} color={colors.textSecondary} />
          </View>
          <Pressable style={styles.uploadDashed}>
            <Ionicons name="cloud-upload-outline" size={22} color={colors.green} />
            <Text style={styles.uploadDashedTxt}>Upload Certification</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Ionicons name="link-outline" size={20} color={colors.green} />
            <Text style={styles.cardTitle}>Social Media</Text>
          </View>
          <Text style={styles.cardHint}>Connect your social profiles to display them on your producer page.</Text>
          <SocialRow icon="logo-instagram" label="Instagram" status="Connected" on />
          <SocialRow icon="logo-facebook" label="Facebook" status="Connect +" />
          <SocialRow icon="logo-tiktok" label="TikTok" status="Connect +" />
          <SocialRow icon="logo-twitter" label="Twitter/X" status="Connect +" />
        </View>

        <MenuSection
          title="ACCOUNT"
          items={[
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
      </ScrollView>
    </View>
  );
}

function SocialRow({
  icon,
  label,
  status,
  on,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  status: string;
  on?: boolean;
}) {
  return (
    <View style={styles.socialRow}>
      <Ionicons name={icon} size={22} color={colors.text} />
      <Text style={styles.socialLabel}>{label}</Text>
      <Text style={[styles.socialStatus, on && styles.socialOn]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  headerBlock: {
    backgroundColor: colors.green,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  identity: { flexDirection: 'row', gap: 14, paddingHorizontal: 16, paddingBottom: 12 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: colors.white,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  avatarImg: { width: '100%', height: '100%' },
  farmName: { fontSize: 20, fontWeight: '800', color: colors.white },
  member: { marginTop: 4, fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  statsBar: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '800', color: colors.white },
  statLab: { marginTop: 4, fontSize: 10, color: 'rgba(255,255,255,0.95)', textAlign: 'center' },
  body: { padding: 16, gap: 14 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  switchIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.greenTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  switchSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  cardHint: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 12 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: { minHeight: 100, paddingTop: 12 },
  uploadRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  uploadBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 6,
  },
  uploadTxt: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  saveBtn: {
    marginTop: 16,
    backgroundColor: colors.green,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnTxt: { color: colors.white, fontWeight: '800', fontSize: 16 },
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.greenLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  certTitle: { fontWeight: '700', fontSize: 15, color: colors.text },
  certSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  uploadDashed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.green,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 14,
  },
  uploadDashedTxt: { fontWeight: '700', color: colors.green, fontSize: 15 },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    gap: 12,
  },
  socialLabel: { flex: 1, fontSize: 16, color: colors.text },
  socialStatus: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  socialOn: { color: colors.green },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    paddingHorizontal: 16,
    paddingTop: 8,
    letterSpacing: 0.5,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  menuLabel: { flex: 1, fontSize: 16, color: colors.text },
  signOut: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  signOutText: { fontSize: 16, fontWeight: '700', color: colors.red },
});
