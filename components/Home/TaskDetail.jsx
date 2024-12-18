import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList,ScrollView } from 'react-native';
import { Menu, Provider } from 'react-native-paper'; // Import Menu and Provider
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Fontisto from '@expo/vector-icons/Fontisto';

const TaskDetail = ({ route }) => {
  const { task } = route.params;
  const [visible, setVisible] = useState(false); 
  const [selectedStatus, setSelectedStatus] = useState(task.status);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(task.comments || []);
  

  const addComment = () => {
    if (!newComment) return;

    setComments([...comments, newComment]);
    setNewComment('');
  };

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    closeMenu();
  };

  return (
    <Provider>
      <FlatList
        style={styles.container}
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
          <View style={styles.taskDetail}>
        <Text style={styles.title}>Détails de la Tâche</Text>
        <View style={styles.etat2}>
        <Text style={styles.label}>Nom : </Text>
        <Text style={styles.label3}> {task.name}</Text>
        </View>
        <View style={styles.etat2}>
        <Text style={styles.label}>Assigné à :</Text>
        <Text style={styles.label3}>{task.email}</Text>
        </View>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <View style={styles.etat2}>
              <Text style={styles.label2}>État :</Text>
              <TouchableOpacity style={styles.etat} onPress={openMenu}>
                <MaterialCommunityIcons name="menu-down" size={30} color="black" />
                <Text style={styles.label2}>{selectedStatus}</Text>
              </TouchableOpacity>
            </View>
          }
        >
          <Menu.Item onPress={() => handleStatusChange('TO DO')} title="TO DO" />
          <Menu.Item onPress={() => handleStatusChange('IN PROGRESS')} title="IN PROGRESS" />
          <Menu.Item onPress={() => handleStatusChange('DONE')} title="DONE" />
        </Menu>
            <Text style={styles.label}>Description : {task.description || 'Aucune description'}</Text>
            </View>
            {comments.length > 0 && <Text style={styles.label}>Commentaires :</Text>}
          </>
        }
        renderItem={({ item }) => <Text style={styles.comment}>{item}</Text>}
        ListFooterComponent={
          <View>
            <TextInput
              style={styles.commentInput}
              multiline
              placeholder="Ajouter un commentaire"
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity style={styles.submitButton} onPress={addComment}>
              <Text style={styles.submitText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </Provider>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 ,textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 10 ,fontWeight: 'bold'},
  label2: { fontSize: 16, marginBottom: 10, paddingTop: 5, fontWeight: 'bold' },
  label3: {fontSize: 16, marginBottom: 10 ,fontWeight: 'bold', color:"#87CEEF"},
  commentInput: {
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#ccc',
    shadowRadius: 2,
    borderRadius: 20,
    padding: 20,
    marginTop: 30,
    marginBottom: 30,
    borderColor: "#87CEEF",
  },
  etat2: {flexDirection: 'row',},
  etat: {flexDirection: 'row', borderColor: '#000000',borderRadius: 2,marginLeft: 10,paddingRight: 10, backgroundColor:"#87CEEF" },
  submitButton:{
    borderRadius: 20,
    padding:10,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    backgroundColor: "#87CEEF",
  },
  comment:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  taskDetail:{
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    borderRadius: 20,
    borderWidth: 1
  }
});

export default TaskDetail;