import { View, Text, Button, TextInput, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_DB } from '../../firebaseConfig'
import { addDoc, collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const List = ({ navigation }: any) => {
    const { colors } = useTheme();

    const [todos, setTodos] = useState<any[]>([]);
    const [todo, setTodo] = useState('')
    const [joke, setJoke] = useState('');
    const [loadingJoke, setLoadingJoke] = useState(false);

    const fetchJoke = async () => {
        setLoadingJoke(true);
        try {
            // console.log('Fetching joke...');
            const response = await fetch('https://icanhazdadjoke.com/', {
                headers: {
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();
            // console.log('Joke received:', data.joke);
            setJoke(data.joke);
        } catch (error) {
            console.error('Error fetching joke:', error);
            setJoke('Failed to fetch joke. Tap refresh to try again.');
        } finally {
            setLoadingJoke(false);
        }
    };

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

    useEffect(() => {
        fetchJoke();
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

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: colors.background,
        },
        form: {
            marginBottom: 20,
        },
        input: {
            backgroundColor: colors.card,
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
            fontSize: 16,
            color: colors.text,
        },
        list: {
            marginTop: 8,
        },
        todoContainer: {
            backgroundColor: colors.card,
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: colors.border,
        },
        todoRow: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        todoText: {
            fontSize: 16,
            color: colors.text,
        },
        todoTextDone: {
            textDecorationLine: 'line-through',
            color: '#94A3B8',
        },
        deleteButton: {
            padding: 8,
        },
        jokeSection: {
            marginBottom: 20,
            marginTop: 10,
        },
        jokeContainer: {
            backgroundColor: colors.jokeBackground,
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.jokeBorder,
            shadowColor: colors.text,
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
            minHeight: 100,
            flexGrow: 1,
        },
        jokeContent: {
            flex: 1,
            justifyContent: 'center',
        },
        jokeLabel: {
            fontSize: 12,
            fontWeight: 'bold',
            color: colors.jokeText,
            marginBottom: 8,
        },
        jokeText: {
            fontSize: 14,
            color: colors.jokeText,
            lineHeight: 20,
            flexWrap: 'wrap',
        },
        refreshButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: 12,
            borderRadius: 8,
            backgroundColor: '#DBEAFE',
            borderWidth: 1,
            borderColor: '#93C5FD',
            marginTop: 8,
        },
        refreshText: {
            color: '#0EA5E9',
            fontSize: 14,
            fontWeight: '500',
        },
    });

    return(
        <View style={styles.container}>
            <View style={styles.jokeSection}>
                <View style={styles.jokeContainer}>
                    {loadingJoke ? (
                        <ActivityIndicator size="large" color="#0EA5E9" />
                    ) : (
                        <View style={styles.jokeContent}>
                            <Text style={styles.jokeLabel}>Dad Joke of the Day:</Text>
                            <Text style={styles.jokeText}>{joke || 'Loading joke...'}</Text>
                        </View>
                    )}
                </View>
                <Pressable 
                    onPress={fetchJoke} 
                    style={styles.refreshButton}
                    hitSlop={10}
                >
                    <Text style={styles.refreshText}>Get New Joke</Text>
                    <Ionicons 
                        name="refresh" 
                        size={20} 
                        color="#0EA5E9" 
                    />
                </Pressable>
            </View>
            
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