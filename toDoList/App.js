import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
const Colors = { primary: '#1f145c', white: '#fff', grey: 'grey' };



const App = () => {
  const [textInput, settextInput] = useState('')
  const [todos, settodos] = useState([])
  useEffect(() => {
    getTasksFromDevice();
  }, [])

  useEffect(() => {
    saveTasksToDevice();
  }, [todos])

  const saveTasksToDevice = async () => {
    try {
      const stringifyTasks = JSON.stringify(todos)
      await AsyncStorage.setItem('todos', stringifyTasks)
    } catch (e) {
      console.log(e)
    }
  };
  const getTasksFromDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos')
      if (todos != null) {
        settodos(JSON.parse(todos));
      }
    } catch (e) {
      console.log(e)
    }
  };
  const setToDo = () => {
    if (textInput == '') {
      Alert.alert('Error', 'Please Enter a Task!')
    }
    else {
      const newTask = {
        id: Math.random(),
        task: textInput,
        completed: false
      };
      settodos([...todos, newTask])
      settextInput('')
    }
  };
  const markToDoComplete = todoid => {
    const newTasks = todos.map(item => {
      if (item.id == todoid) {
        return { ...item, completed: true }
      }
      return item;
    });
    settodos(newTasks);
  };
  const deleteToDo = todoid => {
    const newToDo = todos.filter(item => item.id != todoid)
    settodos(newToDo);
  };
  const deleteAllToDo = () => {
    Alert.alert('Confirm', 'Do you want to Clear All Tasks?', [
      {
        text: 'Yes',
        onPress: () => settodos([]),
      },
      {
        text: 'No'
      }
    ])

  };




  const ListItem = ({ todo }) => {
    return (
      <View style={{ padding: 20, backgroundColor: 'lightgrey', flexDirection: 'row', elevation: 12, borderRadius: 12, marginVertical: 10 }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: Colors.primary,
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.task}
          </Text>
        </View>
        {!todo?.completed && (
          <TouchableOpacity onPress={() => markToDoComplete(todo?.id)}>
            <Text style={{ fontSize: 20 }}>
              ✅ {/*was suppose to use vector icons but then thought to do it simply but it's not good practice though */}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity>
          <Text style={{ fontSize: 20 }} onPress={() => deleteToDo(todo?.id)}>
            🗑
          </Text>
        </TouchableOpacity>

      </View>
    )
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white
      }}>
      <View style={styles.header}>
        <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.primary }}>
          Sooraj's TODO List
        </Text>
        <TouchableOpacity onPress={deleteAllToDo}>
          <Text style={{ fontSize: 25 }}>🗑</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        data={todos}
        renderItem={({ item }) => <ListItem todo={item} />}
      />
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Enter a Task!'
            style={{ padding: 20 }}
            onChangeText={(text) => settextInput(text)}
            value={textInput}
          />
        </View>
        <TouchableOpacity onPress={setToDo}>
          <View style={styles.iconContainer}>
            <Text style={{ fontSize: 35, color: 'white', fontWeight: '600' }}>
              +
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: '#f1f1f1',
    flex: 1,
    // height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',


  }
});

export default App;
