import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const TaskList = ({ navigation }) => {
  const [newTaskName, setNewTaskName] = useState('');
  const [assignedEmail, setAssignedEmail] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editTaskName, setEditTaskName] = useState('');
  const [editAssignedEmail, setEditAssignedEmail] = useState('');
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [currentTask, setCurrentTask] = useState(null);
  const route = useRoute();

  const { project } = route.params;
  useEffect(() => {
    // Fetch tasks when the component is mounted
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setTasks([]); // Réinitialise les projets dans l'état avant de les mettre à jour
      console.log(project);
      const response = await axios.get(
        `https://bb8d-196-179-92-208.ngrok-free.app/project/task/projet/${project}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("hhhhhhhh",response.data.task);
      if (Array.isArray(response.data.task)) {
        setTasks(response.data.task);
        
      } else if(response.data.task){
        setTasks(response.data.task)
        console.log("hahah",tasks);
      }
      else {
        console.error("Erreur : La réponse de l'API n'est pas un tableau !");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des taches :", error);
      alert("Erreur lors de la récupération des taches.");
    }
  };

  const addTask = async () => {
    try {
      const newTask = { name: newTaskName, email: assignedEmail, status: 'TO DO', description: taskDescription ,projectId:{project}};
      const response = await axios.post(`'https://bb8d-196-179-92-208.ngrok-free.app/project/project/create'`, newTask);
      if (response.status === 201) {
        fetchTasks(); // Reload tasks after adding
        setNewTaskName('');
        setAssignedEmail('');
        setTaskDescription('');
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
 

  
  

  const deleteTask = (id) => {
    axios.delete(`https://bb8d-196-179-92-208.ngrok-free.app/project/task/delete/${id}`)
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter(task => task.id !== id)); // Retirer le projet de la liste
      })
      .catch(error => {
        console.error('Erreur lors de la suppression du projet!', error);
      });
  };

  const editTask = async () => {
    try {
      const response = await axios.put(
        `https://bb8d-196-179-92-208.ngrok-free.app/project/task/update`,
        null,
        {
          params: {
            id: currentTask.id,
            name: editTaskName,
            email: editAssignedEmail,
            description: editDescription,
          },
          headers: { 'Content-Type': 'application/json' },
        }
      );
  
      if (response.status === 200) {
        // Si la mise à jour est réussie, récupère la liste complète des projets
        await fetchTasks(); // Appel pour synchroniser les données
        setEditTaskName('');
        setEditAssignedEmail('');
        setEditDescription('');
        setEditTaskIndex(null);
        toggleEditModal();
      }
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const openEditModal = (task) => {
    setCurrentTask(task);
    setEditTaskName(task.name);
    setEditAssignedEmail(task.assignedEmail)
    setEditDescription(task.description)
    setEditModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks for {project.name}</Text>
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.taskContainer}>
            <TouchableOpacity
              style={styles.task}
              onPress={() => navigation.navigate('TaskDetails', { task: item })}
            >
              <Text style={styles.taskName}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
              <Icon name="delete" size={24} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { openEditModal(item)
              }}
              style={styles.editButton}
            >
              <Icon name="edit" size={24} color="blue" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
        <Icon name="add" size={30} color="blue" style={styles.addIcon} />
      </TouchableOpacity>

      {/* Modal for Adding Tasks */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Icon name="close" size={30} color="black" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Task Name"
              value={newTaskName}
              onChangeText={setNewTaskName}
            />
            <TextInput
              style={styles.input}
              placeholder="Assigned Email"
              value={assignedEmail}
              onChangeText={setAssignedEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Task Description"
              value={taskDescription}
              onChangeText={setTaskDescription}
            />
            <Button title="Add Task" onPress={addTask} />
          </View>
        </View>
      </Modal>

      {/* Modal for Editing Tasks */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.closeButton}>
              <Icon name="close" size={30} color="black" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Edit Task Name"
              value={editTaskName}
              onChangeText={setEditTaskName}
            />
            <TextInput
              style={styles.input}
              placeholder="Edit Assigned Email"
              value={editAssignedEmail}
              onChangeText={setEditAssignedEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Edit Task Description"
              value={editDescription}
              onChangeText={setEditDescription}
            />
            <Button title="Save Changes" onPress={editTask} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  task: { flex: 1 },
  taskName: { fontSize: 16 },
  deleteButton: { marginLeft: 10 },
  editButton: { marginLeft: 10 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  addIcon: {
    alignSelf: 'center',
  },
  addButton: {
    marginTop: 20,
    alignSelf: 'center',
  }
});

export default TaskList;
