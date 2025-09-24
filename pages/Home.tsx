import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AddNoteModal from "../components/AddNoteModal";
import DeleteModal from "../components/DeleteModal";
import EditModal from "../components/EditModal";
import ChangeBackgroundModal from "../components/ChangeBackgroundModal";
import {
  pickImage,
  processImage,
  saveBackgroundImage,
  getBackgroundImage,
  removeBackgroundImage,
  BackgroundImageData
} from "../utils/imageUtils";

interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

export const Home = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [changeBackgroundVisible, setChangeBackgroundVisible] = useState(false);
    const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [backgroundImage, setBackgroundImage] = useState<BackgroundImageData | null>(null);

    const handleAddTodo = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleSaveTodo = (title: string, description: string) => {
        const newTodo: Todo = {
            id: Date.now(),
            title,
            description,
            completed: false,
        };
        setTodos([...todos, newTodo]);
        setModalVisible(false);
    };

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const handleLongPress = (todoId: number) => {
        setSelectedTodoId(todoId);
        setDeleteModalVisible(true);
    };

    const handleDeleteTodo = () => {
        if (selectedTodoId !== null) {
            setTodos(todos.filter(todo => todo.id !== selectedTodoId));
            setDeleteModalVisible(false);
            setSelectedTodoId(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteModalVisible(false);
        setSelectedTodoId(null);
    };

    const handleEditTodo = (todo: Todo) => {
        setDeleteModalVisible(false);
        setEditModalVisible(true);
    };

    const handleSaveEditTodo = (title: string, description: string) => {
        if (selectedTodoId !== null) {
            setTodos(todos.map(todo =>
                todo.id === selectedTodoId
                    ? { ...todo, title, description }
                    : todo
            ));
            setEditModalVisible(false);
            setSelectedTodoId(null);
        }
    };

    const handleCloseEditModal = () => {
        setEditModalVisible(false);
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

    const renderTodoItem = ({ item }: { item: Todo }) => (
        <TouchableOpacity
            style={[styles.todoItem, item.completed && styles.completedTodo]}
            onPress={() => toggleTodo(item.id)}
            onLongPress={() => handleLongPress(item.id)}
        >
            <View style={styles.todoContent}>
                <Text style={[styles.todoTitle, item.completed && styles.completedText]}>
                    {item.title}
                </Text>
                <Text style={[styles.todoDescription, item.completed && styles.completedText]}>
                    {item.description}
                </Text>
            </View>
            <MaterialIcons 
                name={item.completed ? "check-circle" : "radio-button-unchecked"} 
                size={24} 
                color={item.completed ? "#44ff44" : "#888888"} 
            />
        </TouchableOpacity>
    );

    const containerContent = (
        <>
            <Text style={styles.title}>Todo List</Text>
            
            {todos.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No todos yet!</Text>
                    <Text style={styles.emptySubtext}>Tap the + button to add your first todo</Text>
                </View>
            ) : (
                <FlatList
                    data={todos}
                    renderItem={renderTodoItem}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.todoList}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
                <MaterialIcons name="add" size={24} color="#f6eeee" />
            </TouchableOpacity>

            <AddNoteModal
                visible={modalVisible}
                onClose={handleCloseModal}
                onSave={handleSaveTodo}
            />

            <DeleteModal
                visible={deleteModalVisible}
                onClose={handleCancelDelete}
                onDelete={handleDeleteTodo}
                onEdit={handleEditTodo}
                todo={selectedTodoId ? todos.find(todo => todo.id === selectedTodoId) : undefined}
            />

            <EditModal
                visible={editModalVisible}
                onClose={handleCloseEditModal}
                onSave={handleSaveEditTodo}
                initialTitle={selectedTodoId ? todos.find(todo => todo.id === selectedTodoId)?.title : ''}
                initialDescription={selectedTodoId ? todos.find(todo => todo.id === selectedTodoId)?.description : ''}
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
    title: {
        color: "#f6eeee",
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 30,
        textAlign: "center",
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
    },
    emptySubtext: {
        color: "#888888",
        fontSize: 14,
        textAlign: "center",
    },
    todoList: {
        flex: 1,
        marginBottom: 80,
    },
    todoItem: {
        backgroundColor: "#1f1f1f",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    completedTodo: {
        opacity: 0.6,
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
    },
    completedText: {
        textDecorationLine: "line-through",
    },
    addButton: {
        position: "absolute",
        bottom: 30,
        right: 30,
        backgroundColor: "#1f1f1f",
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});