import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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

  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
      setDescription(initialDescription);
    }
  }, [visible, initialTitle, initialDescription]);

  const handleSave = () => {
    if (title.trim() && description.trim()) {
      onSave(title, description);
      onClose();
    }
  };

  const handleClose = () => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.fullScreenContainer}
        activeOpacity={1}
        onPress={handleClose}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
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
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    backgroundColor: '#262626',
    borderRadius: 12,
    padding: 24,
    width: 350,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
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