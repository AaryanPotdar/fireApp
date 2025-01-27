import { View, Text, Button, TextInput, StyleSheet, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_DB } from '../../firebaseConfig'
import { addDoc, collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { Ionicons } from '@expo/vector-icons';

const List = ({ navigation }: any) => {

    const [todos, setTodos] = useState<any[]>([]);
    const [todo, setTodo] = useState('')

    useEffect(() => {
        const todoRef = collection(FIREBASE_DB, 'todos');

        const subscriber = onSnapshot(todoRef, {
            next: (snapshot) => {
                const todos: any[] = [];
                snapshot.docs.forEach(doc => {
                    todos.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
                setTodos(todos);
            }
        })
        return () => subscriber();
    }, []);

    const addToDo = async () => {
        const doc = await addDoc(collection(FIREBASE_DB, 'todos'), {title: todo, done: false})
        setTodo('');
    };

    const toggleDone = async (todoId: string, done: boolean) => {
        const todoRef = doc(FIREBASE_DB, 'todos', todoId);
        await updateDoc(todoRef, {
            done: !done
        });
    };

    const deleteItem = async (todoId: string) => {
        const todoRef = doc(FIREBASE_DB, 'todos', todoId);
        await deleteDoc(todoRef);
    };

    const renderTodo = ({ item }: any) => {
        return (
            <Pressable style={styles.todoContainer}>
                <Pressable 
                    style={styles.todoRow} 
                    onPress={() => toggleDone(item.id, item.done)}
                >
                    <Ionicons 
                        name={item.done ? "checkmark-circle" : "checkmark-circle-outline"} 
                        size={24} 
                        color={item.done ? "#0EA5E9" : "#CCCCCC"}
                    />
                    <Text style={[
                        styles.todoText,
                        item.done && styles.todoTextDone
                    ]}>
                        {item.title}
                    </Text>
                </Pressable>
                <Pressable 
                    onPress={() => deleteItem(item.id)}
                    style={styles.deleteButton}
                >
                    <Ionicons name="trash-outline" size={20} color="#FF4444" />
                </Pressable>
            </Pressable>
        )
    }

    return(
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput 
                    style={styles.input}
                    placeholder='Add new todo' 
                    onChangeText={(text: string) => setTodo(text)} 
                    value={todo}
                    placeholderTextColor="#A1A1A1" 
                />
                <Button onPress={addToDo} title='Add' disabled={todo === ''} />
            </View>
            <FlatList
                data={todos}
                renderItem={renderTodo}
                keyExtractor={todo => todo.id}
                style={styles.list}
            />
        </View>
    )
}

export default List;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    form: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        fontSize: 16,
    },
    list: {
        marginTop: 8,
    },
    todoContainer: {
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    todoRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    todoText: {
        fontSize: 16,
        color: '#1E293B',
    },
    todoTextDone: {
        textDecorationLine: 'line-through',
        color: '#94A3B8',
    },
    deleteButton: {
        padding: 8,
    }
})