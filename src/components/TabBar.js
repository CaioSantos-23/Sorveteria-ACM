import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ICON_MAP = {
  home: { on: 'home', off: 'home-outline' },
  map: { on: 'map', off: 'map-outline' },
  chart: { on: 'bar-chart', off: 'bar-chart-outline' },
  grid: { on: 'grid', off: 'grid-outline' },
  store: { on: 'storefront', off: 'storefront-outline' },
  team: { on: 'people', off: 'people-outline' },
};

export default function TabBar({ tabs, active, onChange }) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isOn = active === tab.id;
        const icons = ICON_MAP[tab.icon] || { on: 'ellipse', off: 'ellipse-outline' };
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onChange(tab.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isOn ? icons.on : icons.off}
              size={24}
              color={isOn ? '#3D1A78' : '#9090A0'}
            />
            <Text style={[styles.label, isOn && styles.labelActive]}>
              {tab.label}
            </Text>
            <View style={[styles.dot, isOn && styles.dotActive]} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ECE7F5',
    paddingBottom: Platform.OS === 'ios' ? 20 : 28,
    paddingTop: 8,
    shadowColor: '#3D1A78',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9090A0',
  },
  labelActive: {
    color: '#3D1A78',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FF4D8D',
    marginTop: 1,
    opacity: 0,
  },
  dotActive: {
    opacity: 1,
  },
});
