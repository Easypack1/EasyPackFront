import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const DetectedInfoScreen = ({ route, navigation }) => {
  const { label, imageUri, description } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>감지된 사물: {label.toUpperCase()}</Text>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <Text style={styles.subtitle}>안내 사항</Text>
      <Text style={styles.guidance}>{description}</Text>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
        <Text style={styles.buttonText}>돌아가기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DetectedInfoScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  image: {
    width: 250,
    height: 350,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  guidance: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3886a8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
