import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CourseScreen({ route, navigation }) {
  const { course } = route.params;

  // Flashcard verisi (derslere özel)
  const flashcards = {
    Matematik: [
      { question: '2 + 2 = ?', answer: '4' },
      { question: '3 x 5 = ?', answer: '15' },
    ],
    Fizik: [
      { question: 'Newton’un 2. yasası nedir?', answer: 'F = m * a' },
      { question: 'Işık hızı kaçtır?', answer: '299,792,458 m/s' },
    ],
    Kimya: [
      { question: 'H2O nedir?', answer: 'Su' },
      { question: 'Element nedir?', answer: 'Tek cins atomdan oluşan madde' },
    ],
    Biyoloji: [
      { question: 'İnsan vücudundaki en büyük organ nedir?', answer: 'Deri' },
      { question: 'Fotosentez hangi organelde gerçekleşir?', answer: 'Kloroplast' },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{course.name} Dersi</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Flashcards', { flashcards: flashcards[course.name] })}
      >
        <Text style={styles.buttonText}>Flashcard Çalış</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
