import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../../styles/theme';
import Card from './Card';

interface ClubDetails {
  club: string;
  distance: number;
  adjustedDistance: number;
  environmentalFactors: {
    temperature: number;
    wind: number;
    altitude: number;
  };
  confidence: number;
  reason?: string;
}

interface ClubDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  details: ClubDetails;
}

export const ClubDetailsModal: React.FC<ClubDetailsModalProps> = ({
  visible,
  onClose,
  details,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Card style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.title}>{details.club}</Text>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Distance</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Standard:</Text>
                <Text style={styles.value}>{details.distance}y</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Adjusted:</Text>
                <Text style={styles.value}>{details.adjustedDistance}y</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Environmental Impact</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Temperature:</Text>
                <Text style={styles.value}>{details.environmentalFactors.temperature}%</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Wind:</Text>
                <Text style={styles.value}>{details.environmentalFactors.wind}%</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Altitude:</Text>
                <Text style={styles.value}>{details.environmentalFactors.altitude}%</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Confidence</Text>
              <View style={styles.confidenceBar}>
                <View 
                  style={[
                    styles.confidenceFill,
                    { width: `${details.confidence * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.confidenceText}>
                {Math.round(details.confidence * 100)}% Confidence
              </Text>
            </View>

            {details.reason && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.reason}>{details.reason}</Text>
              </View>
            )}

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  value: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: 'bold',
  },
  confidenceBar: {
    height: 8,
    backgroundColor: theme.colors.text.secondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  confidenceText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  reason: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
  },
  closeButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  closeButtonText: {
    ...theme.typography.button,
    color: theme.colors.text.inverse,
  },
});
