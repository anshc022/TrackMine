import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { getUserProfile } from '../api/api'; // This is the correct path based on your structure

import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Assuming token is stored in AsyncStorage
        if (token) {
          const userData = await getUserProfile(token);
          setProfile(userData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!profile) {
    return <Text>No profile data available</Text>;
  }

  return (
    <View>
      <Text>Username: {profile.username}</Text>
      {/* Add more fields here as needed */}
    </View>
  );
};

export default UserProfile;
