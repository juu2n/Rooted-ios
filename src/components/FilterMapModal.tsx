import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ProductCategory } from '../types';
import { colors } from '../theme/colors';
import {
  DEFAULT_MAP_FILTERS,
  type MapFilterState,
} from '../utils/marketSchedule';

type CatOpt = { value: 'all' | Exclude<ProductCategory, 'featured'>; label: string };
const CATEGORY_OPTIONS: CatOpt[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'bakery', label: 'Bakery' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'flowers', label: 'Flowers' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'honey', label: 'Honey' },
  { value: 'vegetables', label: 'Vegetables' },
];

const DIST_OPTIONS: { value: MapFilterState['distanceMiles']; label: string }[] = [
  { value: 'any', label: 'Any Distance' },
  { value: 1, label: 'Within 1 mi' },
  { value: 3, label: 'Within 3 mi' },
  { value: 5, label: 'Within 5 mi' },
];

function formatUs(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function toIsoLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

type Props = {
  visible: boolean;
  onClose: () => void;
  value: MapFilterState;
  onApply: (next: MapFilterState) => void;
};

export function FilterMapModal({ visible, onClose, value, onApply }: Props) {
  const [draft, setDraft] = useState<MapFilterState>(value);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sheet, setSheet] = useState<'category' | 'distance' | null>(null);

  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);

  const dateObj = draft.specificDate
    ? new Date(
        parseInt(draft.specificDate.slice(0, 4), 10),
        parseInt(draft.specificDate.slice(5, 7), 10) - 1,
        parseInt(draft.specificDate.slice(8, 10), 10),
        12,
      )
    : new Date();

  const onDateChange = (ev: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setPickerOpen(false);
      if (ev.type === 'dismissed') return;
    }
    if (selected) {
      setDraft((d) => ({ ...d, specificDate: toIsoLocal(selected) }));
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Filter Map</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={26} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            <RowLabel icon="cube-outline" label="Product Category" />
            <Pressable style={styles.dropdown} onPress={() => setSheet('category')}>
              <Text style={styles.dropdownText}>
                {CATEGORY_OPTIONS.find((o) => o.value === draft.category)?.label}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </Pressable>
            <Text style={styles.helper}>Show markets and stores with these products</Text>

            <RowLabel icon="location-outline" label="Distance" />
            <Pressable style={styles.dropdown} onPress={() => setSheet('distance')}>
              <Text style={styles.dropdownText}>
                {DIST_OPTIONS.find((o) => o.value === draft.distanceMiles)?.label}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </Pressable>

            <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Market Status</Text>
            <CheckRow
              label="Active (Next 7 days)"
              checked={draft.statusActive}
              onToggle={() => setDraft((d) => ({ ...d, statusActive: !d.statusActive }))}
            />
            <CheckRow
              label="Upcoming (Future)"
              checked={draft.statusUpcoming}
              onToggle={() => setDraft((d) => ({ ...d, statusUpcoming: !d.statusUpcoming }))}
            />

            <RowLabel icon="calendar-outline" label="Specific Date" />
            <Pressable
              style={styles.dropdown}
              onPress={() => {
                if (Platform.OS === 'ios') setPickerOpen(true);
                else setPickerOpen(true);
              }}
            >
              <Text style={[styles.dropdownText, !draft.specificDate && { color: colors.textSecondary }]}>
                {draft.specificDate ? formatUs(dateObj) : 'mm/dd/yyyy'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            </Pressable>
            {pickerOpen ? (
              <DateTimePicker
                value={dateObj}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
              />
            ) : null}
            {Platform.OS === 'ios' && pickerOpen ? (
              <Pressable style={styles.doneIos} onPress={() => setPickerOpen(false)}>
                <Text style={styles.doneIosText}>Done</Text>
              </Pressable>
            ) : null}
            <Text style={styles.helper}>Show markets available on this date (clears status range logic)</Text>
            <Pressable
              style={styles.clearDate}
              onPress={() => setDraft((d) => ({ ...d, specificDate: null }))}
            >
              <Text style={styles.clearDateText}>Clear specific date</Text>
            </Pressable>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={[styles.footBtn, styles.clearBtn]}
              onPress={() => {
                setDraft({ ...DEFAULT_MAP_FILTERS });
              }}
            >
              <Text style={styles.clearBtnText}>Clear</Text>
            </Pressable>
            <Pressable
              style={[styles.footBtn, styles.applyBtn]}
              onPress={() => {
                onApply(draft);
                onClose();
              }}
            >
              <Text style={styles.applyBtnText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Modal visible={sheet !== null} transparent animationType="fade">
        <Pressable style={styles.sheetBackdrop} onPress={() => setSheet(null)} />
        <View style={styles.optionSheet}>
          <Text style={styles.optionTitle}>{sheet === 'category' ? 'Category' : 'Distance'}</Text>
          <ScrollView>
            {sheet === 'category'
              ? CATEGORY_OPTIONS.map((o) => (
                  <Pressable
                    key={o.value}
                    style={styles.optionRow}
                    onPress={() => {
                      setDraft((d) => ({ ...d, category: o.value }));
                      setSheet(null);
                    }}
                  >
                    <Text style={styles.optionText}>{o.label}</Text>
                    {draft.category === o.value ? (
                      <Ionicons name="checkmark" size={20} color={colors.green} />
                    ) : null}
                  </Pressable>
                ))
              : DIST_OPTIONS.map((o) => (
                  <Pressable
                    key={String(o.value)}
                    style={styles.optionRow}
                    onPress={() => {
                      setDraft((d) => ({ ...d, distanceMiles: o.value }));
                      setSheet(null);
                    }}
                  >
                    <Text style={styles.optionText}>{o.label}</Text>
                    {draft.distanceMiles === o.value ? (
                      <Ionicons name="checkmark" size={20} color={colors.green} />
                    ) : null}
                  </Pressable>
                ))}
          </ScrollView>
        </View>
      </Modal>
    </Modal>
  );
}

function RowLabel({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.rowLabel}>
      <Ionicons name={icon} size={18} color={colors.textSecondary} />
      <Text style={styles.rowLabelText}>{label}</Text>
    </View>
  );
}

function CheckRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable style={styles.checkRow} onPress={onToggle}>
      <View style={[styles.checkbox, checked && styles.checkboxOn]}>
        {checked ? <Ionicons name="checkmark" size={16} color={colors.white} /> : null}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '92%',
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  rowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    marginBottom: 8,
  },
  rowLabelText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.text,
  },
  helper: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.accentPurple,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  checkboxOn: {
    backgroundColor: colors.accentPurple,
    borderColor: colors.accentPurple,
  },
  checkLabel: {
    fontSize: 15,
    color: colors.text,
  },
  clearDate: {
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  clearDateText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.green,
  },
  doneIos: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  doneIosText: {
    fontWeight: '600',
    color: colors.green,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  footBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearBtn: {
    backgroundColor: colors.background,
  },
  clearBtnText: {
    fontWeight: '700',
    fontSize: 16,
    color: colors.text,
  },
  applyBtn: {
    backgroundColor: colors.green,
  },
  applyBtnText: {
    fontWeight: '700',
    fontSize: 16,
    color: colors.white,
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  optionSheet: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 120,
    maxHeight: 320,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 12,
  },
  optionTitle: {
    fontWeight: '700',
    fontSize: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
  },
});
