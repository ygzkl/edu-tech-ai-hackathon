import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  // Örnek ders listesi
  const courses = [
    { id: 1, name: 'Matematik' },
    { id: 2, name: 'Fizik' },
    { id: 3, name: 'Kimya' },
    { id: 4, name: 'Biyoloji' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dersler</Text>
      {courses.map(course => (
        <TouchableOpacity
          key={course.id}
          style={styles.button}
          onPress={() => navigation.navigate('Course', { course })}
        >
          <Text style={styles.buttonText}>{course.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#007bff',
    marginVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});
