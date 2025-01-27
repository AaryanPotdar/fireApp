import { View, Text, Button, TextInput, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_DB } from '../../firebaseConfig'
import { addDoc, collection } from 'firebase/firestore'



const List = ({ navigation }: any) => {

    const [todos, setTodos] = useState<any[]>([]);
    const [todo, setTodo] = useState('')

    useEffect(() => {}, []);

    const addToDo = async () => {
        const doc = await addDoc(collection(FIREBASE_DB, 'todos'), {tite: todo, done: false})
        setTodo('');
    };

    return(
        <View style={styles.container}>
            <View>
                <TextInput 
                    style={styles.input}
                    placeholder='Add new todo' 
                    onChangeText={(text: string) => setTodo(text)} 
                    value={todo} 
                />
                <Button onPress={addToDo} title='Add Todo' disabled={todo === ''} />
            </View>
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
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center'

    },
    input: {
        backgroundColor: '#f6f6f6',
        padding: 12,
        borderRadius: 6,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    }
})