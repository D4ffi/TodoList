import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTodos, DeletedTodo } from "../contexts/TodoContext";
import RestoreModal from "../components/RestoreModal";
import ChangeBackgroundModal from "../components/ChangeBackgroundModal";
import {
  pickImage,
  processImage,
  saveBackgroundImage,
  getBackgroundImage,
  removeBackgroundImage,
  BackgroundImageData
} from "../utils/imageUtils";

interface RecentlyDeletedProps {
  onNavigateBack: () => void;
}

export const RecentlyDeleted: React.FC<RecentlyDeletedProps> = ({ onNavigateBack }) => {
  const { deletedTodos, restoreTodo, permanentDelete } = useTodos();
  const [restoreModalVisible, setRestoreModalVisible] = useState(false);
  const [changeBackgroundVisible, setChangeBackgroundVisible] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<BackgroundImageData | null>(null);

  const handleLongPress = (todoId: number) => {
    setSelectedTodoId(todoId);
    setRestoreModalVisible(true);
  };

  const handleRestoreTodo = () => {
    if (selectedTodoId !== null) {
      restoreTodo(selectedTodoId);
      setRestoreModalVisible(false);
      setSelectedTodoId(null);
    }
  };

  const handlePermanentDelete = () => {
    if (selectedTodoId !== null) {
      permanentDelete(selectedTodoId);
      setRestoreModalVisible(false);
      setSelectedTodoId(null);
    }
  };

  const handleCancelRestore = () => {
    setRestoreModalVisible(false);
    setSelectedTodoId(null);
  };

  const handleBackgroundLongPress = () => {
    setChangeBackgroundVisible(true);
  };

  const handleCloseChangeBackground = () => {
    setChangeBackgroundVisible(false);
  };

  const handleUploadBackground = async () => {
    try {
      const imageUri = await pickImage();
      if (imageUri) {
        const processedUri = await processImage(imageUri);
        if (processedUri) {
          const imageData: BackgroundImageData = {
            uri: imageUri,
            processedUri: processedUri,
          };
          await saveBackgroundImage(processedUri);
          setBackgroundImage(imageData);
          setChangeBackgroundVisible(false);
        }
      }
    } catch (error) {
      console.error('Error uploading background:', error);
    }
  };

  const handleDefaultBackground = async () => {
    try {
      await removeBackgroundImage();
      setBackgroundImage(null);
      setChangeBackgroundVisible(false);
    } catch (error) {
      console.error('Error setting default background:', error);
    }
  };

  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        const savedImage = await getBackgroundImage();
        if (savedImage) {
          setBackgroundImage(savedImage);
        }
      } catch (error) {
        console.error('Error loading background image:', error);
      }
    };

    loadBackgroundImage();
  }, []);

  const formatDeletedDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Eliminado hoy';
    } else if (diffInDays === 1) {
      return 'Eliminado ayer';
    } else {
      return `Eliminado hace ${diffInDays} días`;
    }
  };

  const renderDeletedTodoItem = ({ item }: { item: DeletedTodo }) => (
    <TouchableOpacity
      style={styles.todoItem}
      onLongPress={() => handleLongPress(item.id)}
    >
      <View style={styles.todoContent}>
        <Text style={styles.todoTitle}>
          {item.title}
        </Text>
        <Text style={styles.todoDescription}>
          {item.description}
        </Text>
        <Text style={styles.deletedDate}>
          {formatDeletedDate(item.deletedAt)}
        </Text>
      </View>
      <MaterialIcons
        name="delete-sweep"
        size={24}
        color="#888888"
      />
    </TouchableOpacity>
  );

  const containerContent = (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#f6eeee" />
        </TouchableOpacity>
        <Text style={styles.title}>Eliminados Recientemente</Text>
        <View style={styles.placeholder} />
      </View>

      {deletedTodos.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="delete-sweep" size={64} color="#444444" />
          <Text style={styles.emptyText}>No hay elementos eliminados</Text>
          <Text style={styles.emptySubtext}>Los todos eliminados aparecerán aquí</Text>
        </View>
      ) : (
        <FlatList
          data={deletedTodos}
          renderItem={renderDeletedTodoItem}
          keyExtractor={(item) => `deleted-${item.id}`}
          style={styles.todoList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <RestoreModal
        visible={restoreModalVisible}
        onClose={handleCancelRestore}
        onRestore={handleRestoreTodo}
        onPermanentDelete={handlePermanentDelete}
        todo={selectedTodoId ? deletedTodos.find(todo => todo.id === selectedTodoId) : undefined}
      />

      <ChangeBackgroundModal
        visible={changeBackgroundVisible}
        onClose={handleCloseChangeBackground}
        onUpload={handleUploadBackground}
        onDefault={handleDefaultBackground}
      />
    </>
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onLongPress={handleBackgroundLongPress}
      activeOpacity={1}
    >
      {backgroundImage ? (
        <ImageBackground
          source={{ uri: backgroundImage.processedUri }}
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
        >
          <View style={styles.grayscaleOverlay} />
          {containerContent}
        </ImageBackground>
      ) : (
        <View style={styles.defaultBackground}>
          {containerContent}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  defaultBackground: {
    flex: 1,
    backgroundColor: "#262626",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backgroundImage: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backgroundImageStyle: {
    opacity: 0.5,
  },
  grayscaleOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    mixBlendMode: 'luminosity',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: "#f6eeee",
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#f6eeee",
    fontSize: 18,
    marginBottom: 10,
    marginTop: 20,
  },
  emptySubtext: {
    color: "#888888",
    fontSize: 14,
    textAlign: "center",
  },
  todoList: {
    flex: 1,
    marginBottom: 20,
  },
  todoItem: {
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    opacity: 0.7,
  },
  todoContent: {
    flex: 1,
    marginRight: 12,
  },
  todoTitle: {
    color: "#f6eeee",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  todoDescription: {
    color: "#888888",
    fontSize: 14,
    marginBottom: 6,
  },
  deletedDate: {
    color: "#666666",
    fontSize: 12,
    fontStyle: 'italic',
  },
});