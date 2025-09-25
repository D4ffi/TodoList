import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { DeletedTodo } from '../contexts/TodoContext';

interface RestoreModalProps {
  visible: boolean;
  onClose: () => void;
  onRestore: () => void;
  onPermanentDelete: () => void;
  todo?: DeletedTodo;
}

const RestoreModal: React.FC<RestoreModalProps> = ({
  visible,
  onClose,
  onRestore,
  onPermanentDelete,
  todo,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations for next time
      fadeAnim.setValue(0);
      slideAnim.setValue(300);
    }
  }, [visible, fadeAnim, slideAnim]);

  const handleClose = () => {
    // Start exit animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleRestore = () => {
    // Start exit animations then restore
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onRestore();
    });
  };

  const handlePermanentDelete = () => {
    // Start exit animations then delete permanently
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onPermanentDelete();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.fullScreenContainer}>
        {/* Separate Overlay */}
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={handleClose}
          />
        </Animated.View>

        {/* Modal Content */}
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Restaurar Todo</Text>
          <Text style={styles.message}>
            ¿Qué deseas hacer con "{todo?.title}"?
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestore}
            >
              <Text style={styles.restoreButtonText}>Restaurar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.permanentDeleteButton}
              onPress={handlePermanentDelete}
            >
              <Text style={styles.permanentDeleteButtonText}>Eliminar Permanente</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#262626',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    color: '#f6eeee',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  restoreButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  permanentDeleteButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ff4444',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  restoreButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  permanentDeleteButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RestoreModal;