import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface MenuProps {
  visible: boolean;
  onClose: () => void;
}

export const Menu: React.FC<MenuProps> = ({ visible, onClose }) => {
  const router = useRouter();

  const navigateTo = (route: string) => {
    onClose();
    router.push(route);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.menu}>
          <View style={styles.header}>
            <Text style={styles.title}>LastShot</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FREE FEATURES</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('/weather')}
            >
              <Ionicons name="cloudy" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.menuText}>Weather</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.activeMenuItem]}
              onPress={() => navigateTo('/shot-calc')}
            >
              <Ionicons name="calculator" size={24} color={theme.colors.primary} />
              <Text style={[styles.menuText, styles.activeMenuText]}>Shot Calc</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigateTo('/settings')}
            >
              <Ionicons name="settings" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PREMIUM FEATURES</Text>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="stats-chart" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.menuText}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="compass" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.menuText}>Wind Calc</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="analytics" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.menuText}>Shot Analysis</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="speedometer" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.menuText}>Wind Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="eye" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.menuText}>Shot View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    width: '80%',
    height: '100%',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.primary,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  activeMenuItem: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
  },
  menuText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  activeMenuText: {
    color: theme.colors.primary,
  },
}); 