import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function FlashcardScreen({ route }) {
  const { flashcards } = route.params;
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Doğru/yanlış seçimi için state
  const [answerVisible, setAnswerVisible] = useState(false); // Cevabı Gör butonunu yönetmek için

  const nextCard = () => {
    setShowAnswer(false);
    setSelectedAnswer(null); // Yeni karta geçince renk sıfırla
    setAnswerVisible(false); // Yeni kartta Cevabı Gör butonu tekrar aktif hale gelsin
    if (index < flashcards.length - 1) {
      setIndex(index + 1);
    }
  };

  const prevCard = () => {
    setShowAnswer(false);
    setSelectedAnswer(null);
    setAnswerVisible(false);
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const selectAnswer = (isCorrect) => {
    setSelectedAnswer(isCorrect ? 'correct' : 'wrong');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flashcard {index + 1}/{flashcards.length}</Text>

      <View 
        style={[
          styles.card, 
          selectedAnswer === 'correct' ? styles.correctCard : 
          selectedAnswer === 'wrong' ? styles.wrongCard : null
        ]}
      >
        <Text style={styles.cardText}>
          {flashcards[index].question}
        </Text>
        {answerVisible && (
          <Text style={styles.answerText}>{flashcards[index].answer}</Text>
        )}
      </View>

      {!answerVisible && (
        <TouchableOpacity 
          onPress={() => setAnswerVisible(true)} 
          style={styles.showAnswerButton}
        >
          <Text style={styles.buttonText}>Cevabı Gör</Text>
        </TouchableOpacity>
      )}

      {answerVisible && !selectedAnswer && (
        <View style={styles.answerButtons}>
          <TouchableOpacity 
            onPress={() => selectAnswer(true)} 
            style={[styles.answerButton, styles.correctButton]}
          >
            <Text style={styles.buttonText}>Doğru</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => selectAnswer(false)} 
            style={[styles.answerButton, styles.wrongButton]}
          >
            <Text style={styles.buttonText}>Yanlış</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedAnswer && (
        <TouchableOpacity onPress={nextCard} style={styles.nextButton}>
          <Text style={styles.buttonText}>Sonraki</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#fff', 
    padding: 20
  },
  title: { 
    fontSize: 22, 
    marginBottom: 20 
  },
  card: { 
    width: '100%', 
    height: 500,  // Sabit yükseklik 
    padding: 30, 
    borderWidth: 2, 
    borderRadius: 10, 
    marginBottom: 20, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5
  },
  correctCard: {
    backgroundColor: '#28a745', // Yeşil
  },
  wrongCard: {
    backgroundColor: '#dc3545', // Kırmızı
  },
  cardText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center'
  },
  answerText: { 

    fontSize: 18, 
    marginTop: 200, 
    color: '#444', 
    textAlign: 'center'
  },
  showAnswerButton: { 
    padding: 15, 
    backgroundColor: '#ffc107', 
    borderRadius: 8, 
    marginTop: 10 
  },
  answerButtons: { 
    flexDirection: 'row', 
    marginTop: 10 
  },
  answerButton: { 
    padding: 15, 
    margin: 5, 
    borderRadius: 5, 
    width: 100, 
    alignItems: 'center'
  },
  correctButton: { 
    backgroundColor: '#28a745' 
  },
  wrongButton: { 
    backgroundColor: '#dc3545' 
  },
  nextButton: { 
    marginTop: 20, 
    padding: 15, 
    backgroundColor: '#007bff', 
    borderRadius: 5 
  },

  buttonText: { 
    color: '#fff', 
    fontSize: 16 
  },
});

