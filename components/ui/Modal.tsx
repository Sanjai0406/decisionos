import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { X } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function CustomModal({
  visible,
  onClose,
  title,
  children,
  size = 'md',
}: CustomModalProps) {
  const { theme } = useTheme();
  
  const getModalWidth = () => {
    switch (size) {
      case 'sm':
        return '60%';
      case 'lg':
        return '95%';
      case 'full':
        return '100%';
      default:
        return '85%';
    }
  };
  
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={[
        styles.modal,
        size === 'full' && { margin: 0 },
      ]}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.card,
            width: getModalWidth(),
            maxHeight: size === 'full' ? '100%' : '90%',
          },
        ]}
      >
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          {title && (
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {title}
            </Text>
          )}
          <Pressable onPress={onClose} style={styles.closeButton}>
            <X size={24} color={theme.colors.textSecondary} />
          </Pressable>
        </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
});
