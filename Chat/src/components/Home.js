import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Modal, TextInput, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProjects, createProject, joinProject } from '../api/api'; // Ensure these API methods are implemented
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from './BottomNavBar';
import { useRoute } from '@react-navigation/native';

const Home = ({ navigation }) => {
  const route = useRoute(); // Get the route object
  const [projects, setProjects] = useState([]); // Store projects
  const [createModalVisible, setCreateModalVisible] = useState(false); // Modal for creating projects
  const [joinModalVisible, setJoinModalVisible] = useState(false); // Modal for joining projects
  const [projectName, setProjectName] = useState(''); // Store new project name
  const [projectDescription, setProjectDescription] = useState(''); // Store new project description
  const [inviteCode, setInviteCode] = useState(''); // Store invite code for joining projects

  // Fetch projects when the component mounts and when navigation changes
  useEffect(() => {
    fetchProjects();
  }, [navigation]);

  // Fetch projects of the user from the backend
  const fetchProjects = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Error', 'You need to log in first');
        navigation.navigate('Login');
        return;
      }
      const projects = await getUserProjects(token);
      setProjects(projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      Alert.alert('Error', 'Could not fetch projects');
    }
  };

  // Handle creating a new project
  const handleCreateProject = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (!projectName || !projectDescription) {
      Alert.alert('Error', 'Please enter both project name and description');
      return;
    }

    const projectData = { name: projectName, description: projectDescription };
    try {
      const response = await createProject(projectData, token);
      if (response) {
        Alert.alert('Success', 'Project created successfully');
        setCreateModalVisible(false);
        setProjectName(''); // Clear input after success
        setProjectDescription('');
        fetchProjects(); // Refresh the list of projects
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create project');
    }
  };

  // Handle joining an existing project using an invite code
  const handleJoinProject = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (!inviteCode) {
      Alert.alert('Error', 'Please enter an invite code');
      return;
    }

    try {
      await joinProject(inviteCode, token);
      Alert.alert('Success', 'Joined project successfully');
      setJoinModalVisible(false);
      setInviteCode(''); // Clear input after success
      fetchProjects(); // Refresh the list of projects
    } catch (error) {
      Alert.alert('Error', 'Failed to join project');
    }
  };

  // Render each project as a list item with a pressable to navigate to ProjectDetails
  const renderProjectItem = ({ item }) => (
    <TouchableOpacity
      style={styles.projectItem}
      onPress={() => navigation.navigate('ProjectDetails', { projectId: item.id })} // Pass project ID
    >
      <Text style={styles.projectName}>{item.name}</Text>
      <Ionicons name="chevron-forward" size={24} color="#007AFF" />
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Projects</Text>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
          <Ionicons name="person-circle" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Projects List or Empty State */}
      {projects.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="folder-open-outline" size={64} color="#007AFF" />
          <Text style={styles.emptyStateText}>No projects available</Text>
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(project) => project.id.toString()}
          renderItem={renderProjectItem}
          contentContainerStyle={styles.projectList}
        />
      )}

      {/* Buttons for Creating or Joining Projects */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setCreateModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Create Project</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setJoinModalVisible(true)}>
          <Ionicons name="enter-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Join Project</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Bar */}
      <BottomNavBar navigation={navigation} route={route} />

      {/* Modal for Creating Projects */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={createModalVisible}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Create Project</Text>
            <TextInput
              style={styles.input}
              value={projectName}
              onChangeText={setProjectName}
              placeholder="Project Name"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={projectDescription}
              onChangeText={setProjectDescription}
              placeholder="Project Description"
              multiline={true}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleCreateProject}>
                <Text style={styles.modalButtonText}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setCreateModalVisible(false)}>
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Joining Projects */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={joinModalVisible}
        onRequestClose={() => setJoinModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Join Project</Text>
            <TextInput
              style={styles.input}
              value={inviteCode}
              onChangeText={setInviteCode}
              placeholder="Invite Code"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleJoinProject}>
                <Text style={styles.modalButtonText}>Join</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setJoinModalVisible(false)}>
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 18,
    color: '#666',
  },
  projectList: {
    padding: 16,
  },
  projectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    marginLeft: 8,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  modalButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#333',
  },
});

export default Home;
