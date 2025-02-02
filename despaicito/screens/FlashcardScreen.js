import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FlashcardScreen({ route, navigation }) {
  const { flashcards } = route.params;

  // Flashcard indeks ve görünürlük durumları
  const [index, setIndex] = useState(0);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const [easeFactor, setEaseFactor] = useState(2.5);
  const [intervalDays, setIntervalDays] = useState(0); // hesaplanan interval (gün cinsinden)
  const [repetitions, setRepetitions] = useState(0);

  // Kartların tekrar zamanlarını ve "yanlış" bilgisini saklamak için
  // Her kart için scheduledTimes nesnesinde { timestamp, wrong } bilgisi tutulur.
  const [scheduledTimes, setScheduledTimes] = useState({});

  // Cevap sonrası ekranda gösterilecek mesaj ve pendingSchedule
  const [repeatMessage, setRepeatMessage] = useState('');
  const [pendingSchedule, setPendingSchedule] = useState(null);

  useEffect(() => {
    loadFlashcardData();
  }, []);

  const loadFlashcardData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('flashcard_schedules');
      let parsedData = storedData ? JSON.parse(storedData) : {};
  
      // Şu anki zamanın timestamp'ini al
      const now = Date.now();
  
      // Tekrar zamanı gelen veya olmayan kartları seç
      const availableCards = flashcards.filter((card) => {
        if (!parsedData[card.question]) return true; // Eğer kart hiç planlanmamışsa dahil et
        return parsedData[card.question].timestamp <= now; // Eğer süresi geçmişse dahil et
      });
  
      // Eğer tekrar edilmesi gereken kart yoksa, index'i -1 yap
      if (availableCards.length === 0) {
        setIndex(-1);
      } else {
        setScheduledTimes(parsedData);
      }
    } catch (error) {
      console.error('Veri yüklenirken hata oluştu:', error);
    }
  };
  

  // Yeni tekrar zamanlarını AsyncStorage’a kaydet
  const saveFlashcardData = async (newData) => {
    try {
      await AsyncStorage.setItem('flashcard_schedules', JSON.stringify(newData));
    } catch (error) {
      console.error('Veri kaydedilirken hata oluştu:', error);
    }
  };

  /**
   * "Doğru" (Biliyorum) seçeneğinde:
   *   - İlk doğru: 1 gün sonra tekrar
   *   - İkinci ve sonrası: önceki interval * ease factor (yuvarlanarak)
   *   - Repetitions 1 artar, ease factor +0.1 artar.
   *
   * "Yanlış" (Bilmiyorum) seçeneğinde:
   *   - Repetitions sıfırlanır.
   *   - Yeni interval 0 (yani tekrar zamanı = şimdi) olarak ayarlanır,
   *     fakat kart "yanlış" olarak işaretlenecek; böylece diğer kartlardan sonra gösterilecektir.
   *   - Ease factor 0.2 azalır (ancak minimum 1.3’e inmez).
   *
   * @param {boolean} isKnown - true ise "Doğru", false ise "Yanlış"
   * @param {number} repetitions - Önceki doğru sayısı (ilk seferde 0)
   * @param {number} previousEF - Önceki ease factor (ilk seferde 2.5)
   * @param {number} previousInterval - Önceki tekrar aralığı (gün cinsinden, ilk seferde 0)
   * @returns {object} - { interval, repetitions, easeFactor }
   */
  const updateSM2 = (isKnown, repetitions, previousEF, previousInterval) => {
    let newInterval, newRepetitions, newEF;

    if (isKnown) {
      if (repetitions === 0) {
        // İlk doğru: 10 dakika sonra tekrar (10/1440 gün)
        newInterval = 1440 / 1440;
      } else if (repetitions === 1) {
        // İkinci doğru: 1 gün sonra tekrar
        newInterval = 1;
      } else {
        // Üçüncü ve sonraki doğru: önceki interval * ease factor (yuvarlanarak)
        newInterval = Math.ceil(previousInterval * previousEF);
      }
      newRepetitions = repetitions + 1;
      newEF = previousEF + 0.1;
    } else {
      // Yanlış durumda: kart yanlış işaretlenecek,
      // tekrar için interval 0 (yani hemen tekrar) olarak ayarlanır.
      newRepetitions = 0;
      newInterval = 0;
      newEF = previousEF - 0.2;
      if (newEF < 1.3) newEF = 1.3;
    }

    return {
      interval: newInterval,
      repetitions: newRepetitions,
      easeFactor: newEF,
    };
  };

  /**
   * Verilen interval (gün cinsinden) değerine göre,
   * sonraki tekrar zamanının tam tarih/saat bilgisini hesaplar.
   */
  const getNextReviewTime = (interval) => {
    const now = new Date();
    const nextTime = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);
    return nextTime.toLocaleString();
  };

  const formatIntervalMessage = (interval, isWrong) => {
    let timeStr;
    if (interval < 1) {
      const minutes = Math.round(interval * 1440);
      timeStr = `Birazdan`;
    } else if (interval === 1) {
      timeStr = `1 gün sonra`;
    } else {
      timeStr = `${interval} gün sonra`;
    }
    return `${timeStr} tekrar edilecek.\n(Tekrar zamanı: ${getNextReviewTime(interval)})`;
  };


  const handleAnswer = (isKnown) => {
    const { interval, repetitions: newReps, easeFactor: newEF } = updateSM2(
      isKnown,
      repetitions,
      easeFactor,
      intervalDays
    );

    setRepetitions(newReps);
    setEaseFactor(newEF);
    setIntervalDays(interval);

    const now = Date.now();
    // Eğer cevap doğruysa, tekrar zamanı gelecekte ayarlanır.
    // Yanlışsa, timestamp = şimdi (yani anında) fakat wrong flag true.
    const nextReviewTimestamp =
      isKnown ? now + interval * 24 * 60 * 60 * 1000 : now;

    // scheduledTimes nesnesini güncelle (yanlış cevapsa wrong:true, doğru ise wrong:false)
    const updatedSchedule = {
      ...scheduledTimes,
      [flashcards[index].question]: { timestamp: nextReviewTimestamp, wrong: !isKnown },
    };
    setScheduledTimes(updatedSchedule);
    saveFlashcardData(updatedSchedule);

    // Kullanıcıya gösterilecek mesajı hazırla
    const message = formatIntervalMessage(interval, !isKnown);
    setRepeatMessage(message);
    setPendingSchedule(updatedSchedule);
  };

  const handleNextCard = () => {
    if (pendingSchedule) {
      moveToNextCard(pendingSchedule);
      setPendingSchedule(null);
      setRepeatMessage('');
      setAnswerVisible(false);
      setShowHint(false);
    }
  };

  const moveToNextCard = (updatedSchedule) => {
    const now = Date.now();
    const availableCards = flashcards.filter((card) => {
      if (!updatedSchedule[card.question]) return true;
      return updatedSchedule[card.question].timestamp <= now;
    });
  
    if (availableCards.length === 0) {
      setIndex(-1); // Eğer tekrar edilmesi gereken kart yoksa, tamamlandı mesajı göster
    } else {
      availableCards.sort((a, b) => {
        const aWrong = updatedSchedule[a.question]?.wrong ? 1 : 0;
        const bWrong = updatedSchedule[b.question]?.wrong ? 1 : 0;
        return aWrong - bWrong;
      });
      setIndex(flashcards.indexOf(availableCards[0]));
      setRepetitions(0);
      setEaseFactor(2.5);
      setIntervalDays(0);
    }
  };
  
  if (index === -1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tüm kartlar tamamlandı. Yarın tekrar gel!</Text>
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

      <Text style={styles.title}>
        Flashcard {index + 1}/{flashcards.length}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>{flashcards[index].question}</Text>

        {/* İpucu varsa ve showHint true ise ipucu göster */}
        {showHint && flashcards[index].hint && (
          <Text style={styles.hintText}>İpucu: {flashcards[index].hint}</Text>
        )}

        {answerVisible && (
          <Text style={styles.answerText}>{flashcards[index].answer}</Text>
        )}
      </View>

      {repeatMessage ? (
        <View style={styles.repeatContainer}>
          <Text style={styles.repeatText}>{repeatMessage}</Text>
          <TouchableOpacity onPress={handleNextCard} style={styles.nextButton}>
            <Text style={styles.buttonText}>Sonraki Kart</Text>
          </TouchableOpacity>
        </View>
      ) : answerVisible ? (
        <View style={styles.answerButtons}>
          <TouchableOpacity onPress={() => handleAnswer(true)} style={[styles.answerButton, styles.correctButton]}>
            <Text style={styles.buttonText}>Doğru</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleAnswer(false)} style={[styles.answerButton, styles.wrongButton]}>
            <Text style={styles.buttonText}>Yanlış</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => setShowHint(true)} style={styles.hintButton}>
            <Text style={styles.buttonText}>İpucu</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAnswerVisible(true)} style={styles.showAnswerButton}>
            <Text style={styles.buttonText}>Cevabı Gör</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
    backgroundColor: '#6c757d',
    borderRadius: 8,
  },
  title: {
    fontSize: 45,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    width: '90%',
    height: 500,
    padding: 30,
    borderWidth: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  cardText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hintText: {
    fontSize: 20,
    marginTop: 40,
    marginBottom: 40,
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  answerText: {
    fontSize: 30,
    marginTop: 20,
    color: '#222',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  hintButton: {
    padding: 15,
    backgroundColor: '#17a2b8',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  showAnswerButton: {
    padding: 15,
    backgroundColor: '#ffc107',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  answerButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  answerButton: {
    padding: 15,
    margin: 5,
    borderRadius: 5,
    width: 120,
    alignItems: 'center',
  },
  correctButton: {
    backgroundColor: '#28a745',
  },
  wrongButton: {
    backgroundColor: '#dc3545',
  },
  nextButton: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  repeatText: {
    marginTop: 10,
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
  },
  repeatContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
});
