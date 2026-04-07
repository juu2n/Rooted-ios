import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { RootedHeader } from '../components/RootedHeader';
import { useAppData } from '../context/AppDataContext';
import {
  EVENT_FILTER_PILLS,
  type EventFilterId,
  eventsForSection,
} from '../data/events';
import type { MarketEvent } from '../types';
import { colors } from '../theme/colors';

function EventCard({
  e,
  saved,
  onToggleSave,
}: {
  e: MarketEvent;
  saved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <View style={styles.eventCard}>
      <View style={styles.eventImgWrap}>
        <Image source={{ uri: e.imageUrl }} style={styles.eventImg} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{e.badge}</Text>
        </View>
        <Pressable style={styles.bookmark} onPress={onToggleSave}>
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color={colors.white} />
        </Pressable>
        <Text style={styles.eventTitleOnImg} numberOfLines={2}>
          {e.title}
        </Text>
      </View>
      <View style={styles.eventBody}>
        <View style={styles.eventMeta}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.eventMetaText}>
            {e.dateLabel} · {e.timeLabel}
          </Text>
        </View>
        <View style={styles.eventMeta}>
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.eventMetaText}>{e.location}</Text>
        </View>
        <View style={styles.eventActions}>
          <Pressable style={styles.rsvp}>
            <Text style={styles.rsvpText}>RSVP</Text>
          </Pressable>
          <Pressable style={styles.calPlus}>
            <Ionicons name="calendar-outline" size={20} color={colors.green} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const SECTION_LABELS: { id: MarketEvent['section']; title: string }[] = [
  { id: 'featured', title: 'Featured Events' },
  { id: 'seasonal', title: 'Seasonal Festivals' },
  { id: 'workshop', title: 'Workshops' },
  { id: 'tasting', title: 'Tastings' },
];

export default function EventsScreen() {
  const { isEventSaved, toggleSaveEvent } = useAppData();
  const [filter, setFilter] = useState<EventFilterId>('all');

  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    SECTION_LABELS.forEach((s) => {
      out[s.id] = eventsForSection(s.id, filter).length;
    });
    return out;
  }, [filter]);

  return (
    <View style={styles.root}>
      <RootedHeader />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Discover Events</Text>
        <View style={styles.searchField}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            placeholder="Search events..."
            placeholderTextColor={colors.textSecondary}
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pills}
        >
          {EVENT_FILTER_PILLS.map((pill) => (
            <Pressable
              key={pill.id}
              onPress={() => setFilter(pill.id)}
              style={[styles.pill, filter === pill.id && styles.pillOn]}
            >
              <Text style={[styles.pillText, filter === pill.id && styles.pillTextOn]}>{pill.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {SECTION_LABELS.map((sec) => {
          const list = eventsForSection(sec.id, filter);
          if (list.length === 0) return null;
          return (
            <View key={sec.id} style={styles.section}>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>{sec.title}</Text>
                <Text style={styles.sectionCount}>
                  {counts[sec.id]} event{counts[sec.id] === 1 ? '' : 's'}
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hScroll}
              >
                {list.map((e) => (
                  <EventCard
                    key={e.id}
                    e={e}
                    saved={isEventSaved(e.id)}
                    onToggleSave={() => toggleSaveEvent(e.id)}
                  />
                ))}
              </ScrollView>
            </View>
          );
        })}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const EVENT_CARD_W = 280;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 0,
  },
  pills: {
    gap: 10,
    paddingBottom: 18,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  pillOn: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pillTextOn: {
    color: colors.white,
  },
  section: {
    marginBottom: 22,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  sectionCount: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  hScroll: {
    gap: 14,
  },
  eventCard: {
    width: EVENT_CARD_W,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  eventImgWrap: {
    height: 160,
    position: 'relative',
    backgroundColor: colors.border,
  },
  eventImg: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    bottom: 36,
    left: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  bookmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventTitleOnImg: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  eventBody: {
    padding: 12,
    gap: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventMetaText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
  },
  eventActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  rsvp: {
    flex: 1,
    backgroundColor: colors.greenLight,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  rsvpText: {
    fontWeight: '700',
    color: colors.greenDark,
    fontSize: 15,
  },
  calPlus: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
