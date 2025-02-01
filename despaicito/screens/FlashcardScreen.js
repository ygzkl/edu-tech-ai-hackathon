import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function FlashcardScreen({ route }) {
  const { flashcards } = route.params;
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const nextCard = () => {
    setShowAnswer(false);
    if (index < flashcards.length - 1) {
      setIndex(index + 1);
    }
  };

  const prevCard = () => {
    setShowAnswer(false);
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcard {index + 1}/{flashcards.length}</Text>
      <TouchableOpacity onPress={() => setShowAnswer(!showAnswer)} style={styles.card}>
        <Text style={styles.cardText}>
          {showAnswer ? flashcards[index].answer : flashcards[index].question}
        </Text>
      </TouchableOpacity>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={prevCard} style={styles.button} disabled={index === 0}>
          <Text style={styles.buttonText}>Doğru</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextCard} style={styles.button} disabled={index === flashcards.length - 1}>
          <Text style={styles.buttonText}>Yanlış</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center'},
  title: { fontSize: 22, marginBottom: 20 },
  card: { padding: 30, borderWidth: 2, borderRadius: 10, marginBottom: 20 },
  cardText: { fontSize: 18 },
  buttons: { flexDirection: 'row' },
  button: { padding: 10, margin: 5, backgroundColor: 'green', borderRadius: 5 },
  buttonText: { color: '#fff' },
});

