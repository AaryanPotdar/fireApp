import { View, Text, Button } from 'react-native'
import React, { useEffect } from 'react'
import { FIREBASE_DB } from '../../firebaseConfig'
import { addDoc, collection } from 'firebase/firestore'

const List = ({ navigation }: any) => {

    useEffect(() =>{
        addDoc(collection(FIREBASE_DB, 'todos'), {tite: 'this is a test', done: false}) 
    }, [])

    return(
        <View>
            <Text>List</Text>
            <Button onPress={() => navigation.navigate('Details')} title="Open Details" />
        </View>
    )
}

export default List;