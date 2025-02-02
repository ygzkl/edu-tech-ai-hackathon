import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function FlashcardScreen({ route, navigation }) {
  // route.params.flashcards içindeki soruları local state'e alıyoruz
  const { flashcards } = route.params;

  // Soru listesi: ilk turda doğrudan `flashcards`,
  // ikinci turda `wrongAnswers` olacak şekilde güncellenecek.
  const [flashcardList, setFlashcardList] = useState(flashcards);

  // Kaçıncı soruda olduğumuzu tutan indeks
  const [index, setIndex] = useState(0);

  // İlk turda yanlış cevap verilen soruları tutacak dizi
  const [wrongAnswers, setWrongAnswers] = useState([]);

  // İlk tur mu, ikinci tur mu kontrolü
  const [isSecondPass, setIsSecondPass] = useState(false);

  // Ekrana cevabı gösterme kontrolü
  const [answerVisible, setAnswerVisible] = useState(false);

  // Ekrana ipucu gösterme kontrolü
  const [showHint, setShowHint] = useState(false);

  // Her cevap sonrasında çalışacak fonksiyon
  const handleAnswer = (isCorrect) => {
    // Yanlış cevap verildiyse, bu soruyu wrongAnswers dizisine ekle
    if (!isCorrect) {
      setWrongAnswers((prev) => [...prev, flashcardList[index]]);
    }

    // Sonraki soruya geçiş
    const nextIndex = index + 1;

    // Ekrandaki ipucunu ve cevabı sakla
    setShowHint(false);
    setAnswerVisible(false);

    // Eğer sıradaki soru var ise ona geç
    if (nextIndex < flashcardList.length) {
      setIndex(nextIndex);
    } else {
      // Eğer ilk tur tamamlandıysa ve yanlış sorular varsa ikinci tura başla
      if (!isSecondPass && wrongAnswers.length > 0) {
        setFlashcardList(wrongAnswers);
        setIndex(0);
        setWrongAnswers([]);
        setIsSecondPass(true);
      } else {
        // İkinci tur da bitti veya yanlış soru yok
        // Artık index'i -1 yaparak "Bitti" ekranına geçebiliriz
        setIndex(-1);
      }
    }
  };

  // Tüm sorular bitip index = -1 olursa gösterilecek ekran
  if (index === -1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tüm soruları tamamladın!</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.backButton}
        >
          <Text style={styles.buttonText}>← Derslere Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Normal flashcard ekranı
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.buttonText}>← Geri</Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        {/* İkinci turdaysak bunu da belirtebiliriz (opsiyonel) */}
        {isSecondPass ? 'Tekrar Tur' : 'Flashcard'} {index + 1}/{flashcardList.length}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>{flashcardList[index].question}</Text>

        {/* İpucu gösterme */}
        {showHint && flashcardList[index].hint && (
          <Text style={styles.hintText}>İpucu: {flashcardList[index].hint}</Text>
        )}

        {/* Cevap gösterme */}
        {answerVisible && (
          <Text style={styles.answerText}>{flashcardList[index].answer}</Text>
        )}
      </View>

      {/* Eğer cevabı henüz göstermediysek: İpucu ve "Cevabı Gör" butonları */}
      {!answerVisible && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => setShowHint(true)}
            style={styles.hintButton}
          >
            <Text style={styles.buttonText}>İpucu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setAnswerVisible(true)}
            style={styles.showAnswerButton}
          >
            <Text style={styles.buttonText}>Cevabı Gör</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cevap görünüyorsa Doğru / Yanlış butonlarını göster */}
      {answerVisible && (
        <View style={styles.answerButtons}>
          <TouchableOpacity
            onPress={() => handleAnswer(true)}
            style={[styles.answerButton, styles.correctButton]}
          >
            <Text style={styles.buttonText}>Doğru</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleAnswer(false)}
            style={[styles.answerButton, styles.wrongButton]}
          >
            <Text style={styles.buttonText}>Yanlış</Text>
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
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    width: '90%',
    height: 300,
    padding: 30,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  cardText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hintText: {
    fontSize: 16,
    marginTop: 20,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  answerText: {
    fontSize: 18,
    marginTop: 20,
    color: '#444',
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
    width: 100,
    alignItems: 'center',
  },
  correctButton: {
    backgroundColor: '#28a745',
  },
  wrongButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
