import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ChangeBackgroundModalProps {
  visible: boolean;
  onClose: () => void;
  onUpload: () => void;
  onDefault: () => void;
}

const ChangeBackgroundModal: React.FC<ChangeBackgroundModalProps> = ({
  visible,
  onClose,
  onUpload,
  onDefault,
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
          <Text style={styles.title}>Change Background</Text>
          <Text style={styles.message}>
            Customize your todo list background
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={onUpload}>
              <MaterialIcons name="photo-library" size={24} color="#4CAF50" />
              <Text style={styles.uploadButtonText}>Upload Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.defaultButton} onPress={onDefault}>
              <MaterialIcons name="refresh" size={24} color="#666666" />
              <Text style={styles.defaultButtonText}>Default</Text>
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
    flexDirection: 'column',
    gap: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  uploadButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  defaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#666666',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  defaultButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});

export default ChangeBackgroundModal;