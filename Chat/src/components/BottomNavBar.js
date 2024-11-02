// src/components/BottomNavBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomNavBar = ({ navigation }) => {
  return (
    <View style={styles.bottomNavBar}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={24} color="#007AFF" />
        <Text style={[styles.navText, { color: '#007AFF' }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Chat')}>
        <Ionicons name="chatbubbles" size={24} color="#FF9500" />
        <Text style={[styles.navText, { color: '#FF9500' }]}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Activity')}>
        <Ionicons name="pulse" size={24} color="#FF2D55" />
        <Text style={[styles.navText, { color: '#FF2D55' }]}>Activity</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('More')}>
        <Ionicons name="ellipsis-horizontal" size={24} color="#5856D6" />
        <Text style={[styles.navText, { color: '#5856D6' }]}>More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default BottomNavBar;
