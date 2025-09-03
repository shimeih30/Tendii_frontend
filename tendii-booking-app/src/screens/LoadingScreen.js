import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LoadingScreen() {
  return (
    <LinearGradient
      colors={['#007AFF', '#0051D5']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>Tendii</Text>
        <ActivityIndicator size="large" color="white" style={styles.spinner} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  spinner: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
});