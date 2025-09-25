import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  initialTitle?: string;
  initialDescription?: string;
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  onClose,
  onSave,
  initialTitle = '',
  initialDescription = '',
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  // Animation refs
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const modalTranslateY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
      setDescription(initialDescription);
      // Start enter animations
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(modalTranslateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations for next time
      overlayOpacity.setValue(0);
      modalTranslateY.setValue(300);
    }
  }, [visible, initialTitle, initialDescription, overlayOpacity, modalTranslateY]);

  const handleSave = () => {
    if (title.trim() && description.trim()) {
      onSave(title, description);
      onClose();
    }
  };

  const handleClose = () => {
    // Start exit animations
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalTranslateY, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset state after animations complete
      setTitle(initialTitle);
      setDescription(initialDescription);
      onClose();
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
              opacity: overlayOpacity,
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
              transform: [{ translateY: modalTranslateY }],
            },
          ]}
        >
          {/* Todo Title */}
          <View style={styles.titleContainer}>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Todo title"
              placeholderTextColor="#888888"
              textAlign="center"
            />
          </View>

          {/* Todo Description */}
          <View style={styles.descriptionContainer}>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              multiline={true}
              textAlignVertical="top"
              placeholder="Enter your description..."
              placeholderTextColor="#888888"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <MaterialIcons name="check" size={24} color="#ffffff" />
          </TouchableOpacity>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  titleContainer: {
    marginBottom: 16,
  },
  titleInput: {
    color: '#f6eeee',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
    paddingBottom: 8,
    paddingTop: 4,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionInput: {
    color: '#f6eeee',
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default EditModal;