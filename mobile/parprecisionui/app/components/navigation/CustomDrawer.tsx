import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Link, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const MENU_ITEMS = [
  { icon: 'cloud-outline', label: 'Weather', href: '/weather' },
  { icon: 'golf-outline', label: 'Shot Calc', href: '/shot-calculator' },
  { icon: 'compass-outline', label: 'Wind Calc', href: '/wind-calc' },
  { icon: 'settings-outline', label: 'Settings', href: '/settings' },
];

export default function CustomDrawer(props: any) {
  const pathname = usePathname();

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>LastShot</Text>
        <Text style={styles.subtitle}>Golf Shot Calculator</Text>
      </View>

      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} asChild>
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  isActive && styles.menuItemActive,
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={isActive ? '#FFFFFF' : '#B0B0B0'}
                  style={styles.menuIcon}
                />
                <Text
                  style={[
                    styles.menuLabel,
                    isActive && styles.menuLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1F2E',
  },
  header: {
    padding: 16,
    paddingTop: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#252B3D',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#B0B0B0',
    fontSize: 14,
    marginTop: 4,
  },
  menu: {
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 24,
  },
  menuItemActive: {
    backgroundColor: '#252B3D',
  },
  menuIcon: {
    marginRight: 16,
    width: 24,
  },
  menuLabel: {
    color: '#B0B0B0',
    fontSize: 16,
  },
  menuLabelActive: {
    color: '#FFFFFF',
  },
});