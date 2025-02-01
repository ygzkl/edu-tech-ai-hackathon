import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FlashcardScreen({ route, navigation }) {
  const { flashcards } = route.params;
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [scheduledTimes, setScheduledTimes] = useState({});
  const [easeFactor, setEaseFactor] = useState(2.5);
  const [intervalDays, setIntervalDays] = useState(0);
  const [repeatMessage, setRepeatMessage] = useState('');

  useEffect(() => {
    loadFlashcardData();
  }, []);

  const loadFlashcardData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('flashcard_schedules');
      if (storedData) {
        setScheduledTimes(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Veri yüklenirken hata oluştu:', error);
    }
  };

  const saveFlashcardData = async (newData) => {
    try {
      await AsyncStorage.setItem('flashcard_schedules', JSON.stringify(newData));
    } catch (error) {
      console.error('Veri kaydedilirken hata oluştu:', error);
    }
  };

  const handleAnswer = (isCorrect) => {
    let newEaseFactor = easeFactor;
    let newIntervalDays = intervalDays;

    if (isCorrect) {
      if (intervalDays === 0) {
        newIntervalDays = 1 / 1440; // 1 dakika sonra tekrar göster
      } else if (intervalDays < 1) {
        newIntervalDays = 1; // 1 gün sonra göster
      } else {
        newEaseFactor = Math.max(1.3, newEaseFactor + 0.1);
        newIntervalDays *= newEaseFactor; // Zaman aralığını artır
      }
    } else {
      newEaseFactor = Math.max(1.3, newEaseFactor - 0.2); // Yanlışta faktörü azalt
      newIntervalDays = 0; // Yanlışta hemen tekrar göster
      setRepeatMessage('Bu kart tekrar edilecek.');
    }

    const updatedSchedule = { ...scheduledTimes, [flashcards[index].question]: newIntervalDays };

    setEaseFactor(newEaseFactor);
    setIntervalDays(newIntervalDays);
    setScheduledTimes(updatedSchedule);
    saveFlashcardData(updatedSchedule);

    setShowAnswer(false);
    setAnswerVisible(false);

    moveToNextCard(updatedSchedule);
  };

  const moveToNextCard = (updatedSchedule) => {
    const remainingCards = flashcards.filter(
      (q) => !updatedSchedule[q.question] || updatedSchedule[q.question] <= 1
    );

    if (remainingCards.length === 0) {
      setIndex(-1); // Tüm kartlar bitti, ekranı kapat
    } else {
      setIndex(flashcards.indexOf(remainingCards[0]));
      setRepeatMessage('');
    }
  };

  if (index === -1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Yarın tekrar gel!</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
          <Text style={styles.buttonText}>← Derslere Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.buttonText}>← Geri</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Flashcard {index + 1}/{flashcards.length}</Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>{flashcards[index].question}</Text>
        {answerVisible && <Text style={styles.answerText}>{flashcards[index].answer}</Text>}
      </View>

      {repeatMessage ? <Text style={styles.repeatText}>{repeatMessage}</Text> : null}

      {!answerVisible && (
        <TouchableOpacity onPress={() => setAnswerVisible(true)} style={styles.showAnswerButton}>
          <Text style={styles.buttonText}>Cevabı Gör</Text>
        </TouchableOpacity>
      )}

      {answerVisible && (
        <View style={styles.answerButtons}>
          <TouchableOpacity onPress={() => handleAnswer(true)} style={[styles.answerButton, styles.correctButton]}>
            <Text style={styles.buttonText}>Doğru</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleAnswer(false)} style={[styles.answerButton, styles.wrongButton]}>
            <Text style={styles.buttonText}>Yanlış</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 20 },
  backButton: { position: 'absolute', top: 50, left: 20, padding: 10, backgroundColor: '#6c757d', borderRadius: 8 },
  title: { fontSize: 22, marginBottom: 20 },
  card: { width: '90%', height: 200, padding: 30, borderWidth: 2, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  cardText: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  answerText: { fontSize: 18, marginTop: 20, color: '#444', textAlign: 'center' },
  showAnswerButton: { padding: 15, backgroundColor: '#ffc107', borderRadius: 8, marginTop: 10 },
  answerButtons: { flexDirection: 'row', marginTop: 10 },
  answerButton: { padding: 15, margin: 5, borderRadius: 5, width: 100, alignItems: 'center' },
  correctButton: { backgroundColor: '#28a745' },
  wrongButton: { backgroundColor: '#dc3545' },
  buttonText: { color: '#fff', fontSize: 16 },
  repeatText: { marginTop: 10, fontSize: 16, color: '#dc3545' },
});

