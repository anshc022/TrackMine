import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { createProject, joinProject } from '../api/api';

const Project = ({ navigation }) => {
  const [projectName, setProjectName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const handleCreateProject = async () => {
    const token = 'your_token'; // Replace with actual token retrieval
    await createProject({ name: projectName }, token);
    alert('Project created successfully');
    navigation.goBack();
  };

  const handleJoinProject = async () => {
    const token = 'your_token'; // Replace with actual token retrieval
    await joinProject(inviteCode, token);
    alert('Joined project successfully');
    navigation.goBack();
  };

  return (
    <View>
      <TextInput placeholder="Project Name" onChangeText={setProjectName} />
      <Button title="Create Project" onPress={handleCreateProject} />
      <TextInput placeholder="Invite Code" onChangeText={setInviteCode} />
      <Button title="Join Project" onPress={handleJoinProject} />
    </View>
  );
};

export default Project;
