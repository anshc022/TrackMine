import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import { getProjectDetails } from '../api/api';

const ProjectDetails = ({ route }) => {
  const { projectId } = route.params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        const projectData = await getProjectDetails(projectId, token);
        setProject(projectData);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert('Copied to clipboard!', text);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {project ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>{project.name}</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Invitation Code</Text>
              <View style={styles.invitationCodeContainer}>
                <Text style={styles.invitationCode}>{project.invitation_code}</Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => copyToClipboard(project.invitation_code)}
                >
                  <Text style={styles.copyButtonText}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Users in this Project</Text>
              {project.users.map((user, index) => (
                <Text key={index} style={styles.user}>
                  {user.username}
                </Text>
              ))}
            </View>
          </View>
        </>
      ) : (
        <Text>No project found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  invitationCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
  },
  invitationCode: {
    flex: 1,
    fontSize: 16,
  },
  copyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  user: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default ProjectDetails;