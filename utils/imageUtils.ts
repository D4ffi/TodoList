import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKGROUND_IMAGE_KEY = 'background_image';

export interface BackgroundImageData {
  uri: string;
  processedUri: string;
}

export const requestPermissions = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
};

export const pickImage = async (): Promise<string | null> => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      alert('Permission to access camera roll is required!');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: false,
      exif: false,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
};

export const processImage = async (uri: string): Promise<string | null> => {
  try {
    // Apply grayscale filter and resize
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [
        // Resize to optimize performance
        { resize: { width: 400 } },
      ],
      {
        compress: 0.7,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: false,
      }
    );

    return manipulatedImage.uri;
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
};

export const saveBackgroundImage = async (uri: string): Promise<void> => {
  try {
    const imageData: BackgroundImageData = {
      uri,
      processedUri: uri,
    };
    await AsyncStorage.setItem(BACKGROUND_IMAGE_KEY, JSON.stringify(imageData));
  } catch (error) {
    console.error('Error saving background image:', error);
  }
};

export const getBackgroundImage = async (): Promise<BackgroundImageData | null> => {
  try {
    const data = await AsyncStorage.getItem(BACKGROUND_IMAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting background image:', error);
    return null;
  }
};

export const removeBackgroundImage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(BACKGROUND_IMAGE_KEY);
  } catch (error) {
    console.error('Error removing background image:', error);
  }
};