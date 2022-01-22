import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, Modal, Pressable, } from 'react-native';
import filter from 'lodash.filter';
const Colors = { primary: '#1f145c', white: '#fff', grey: 'grey', lightGrey: '#f1f1f1' };



const App = () => {
  const [textInput, settextInput] = useState('')
  const [description, setdescription] = useState('')
  const [todos, settodos] = useState([])
  const [filteredTodos, setFilteredTodos] = useState([])
  const [query, setQuery] = useState('');
  const [fullData, setFullData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

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
      console.error(e)
    }
  };
  const getTasksFromDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos')
      if (todos != null) {
        settodos(JSON.parse(todos));
        setFullData(JSON.parse(todos));
      }
    } catch (e) {
      console.error(e)
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
        description: description,
        completed: false
      };
      settodos([...todos, newTask])
      settextInput('')
      setdescription('')
      setModalVisible(false)
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
    setFilteredTodos(newTasks);

  };
  const deleteToDo = todoid => {
    const newToDo = todos.filter(item => item.id != todoid)
    settodos(newToDo);
    setFilteredTodos(newToDo);
  };

  const handleOnDeleteAll = () => {
    settodos([]);
    setFilteredTodos([]);
  }

  const deleteAllToDo = () => {
    Alert.alert('Confirm', 'Do you want to Clear All Tasks?', [
      {
        text: 'Yes',
        onPress: () => handleOnDeleteAll(),
      },
      {
        text: 'No'
      }
    ])

  };

  const ListItem = ({ todo }) => {
    return (
      <View>
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
            <Text
              style={{
                fontWeight: '500',
                fontSize: 12,
                textDecorationLine: todo?.completed ? 'line-through' : 'none',
              }}
            >
              {todo?.description}
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
      </View>
    )
  }

  const handleSearch = text => {
    setFullData(todos)
    const filteredData = filter(fullData, task => {
      return contains(task.task.toLowerCase(), text.toLowerCase());
    });
    setFilteredTodos(filteredData)
    setQuery(text);
  };

  const contains = (task, query) => {

    if (task.includes(query)) {
      return true;
    }

    return false;
  };

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
      <View style={{ backgroundColor: Colors.lightGrey, borderRadius: 10, height: 40, margin: 20, justifyContent: 'center', padding: 10 }}>
        <TextInput placeholder='Search' placeholderTextColor={'grey'} value={query}
          onChangeText={queryText => handleSearch(queryText)} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        data={filteredTodos.length || query ? filteredTodos : todos}
        renderItem={({ item }) => <ListItem todo={item} />}
      />


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ width: '100%', }}>
              <View style={{ backgroundColor: 'white', borderRadius: 20, margin: 5, width: 200 }}>
                <TextInput
                  placeholder='Enter a Task!'
                  style={{ padding: 20 }}
                  onChangeText={(text) => settextInput(text)}
                  value={textInput}
                  placeholderTextColor={'grey'}
                />
              </View>
              <View style={{ backgroundColor: 'white', borderRadius: 20, margin: 5, width: 200 }}>
                <TextInput
                  placeholder='Enter Description...'
                  style={{ padding: 20, }}
                  onChangeText={(text) => setdescription(text)}
                  value={description} x
                  placeholderTextColor={'grey'}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.add}
                onPress={setToDo}
              >
                <Text style={styles.textStyle}>ADD</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.add, styles.cancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      <View style={styles.footer}>
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <View style={styles.iconContainer}>
            <Text style={{ fontSize: 35, color: 'white', fontWeight: '600' }}>
              +
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView >
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
    bottom: 30,
    backgroundColor: Colors.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center'

  },
  inputContainer: {
    backgroundColor: Colors.lightGrey,
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


  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.lightGrey,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textStyle: {
    color: Colors.white,
    fontWeight: '600',
  },
  add: {
    backgroundColor: Colors.primary,
    width: 100,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
  cancel: {
    backgroundColor: '#DF4C5E',
  }
});

export default App;
