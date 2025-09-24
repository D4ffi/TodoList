import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface DeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  onEdit: (todo: Todo) => void;
  todo?: Todo;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  onClose,
  onDelete,
  onEdit,
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
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
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
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim]);
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.fullScreenContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Delete Todo</Text>
          <Text style={styles.message}>
            Are you sure you want to delete "{todo?.title}"?
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => todo && onEdit(todo)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlay: {
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
  editButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  deleteButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ff4444',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  editButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DeleteModal;