import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

export default function HomeScreen({ navigation, setIsLoggedIn }) {
  const courses = [
    { id: 1, name: 'Matematik' },
    { id: 2, name: 'Fizik' },
    { id: 3, name: 'Kimya' },
    { id: 4, name: 'Biyoloji' },
    { id: 5, name: 'Tarih' },
    { id: 6, name: 'Edebiyat' },
  ];

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
    Tarih: [
      { question: 'İstanbul hangi yılda fethedildi?', answer: '1453' },
      { question: 'Cumhuriyet hangi yılda ilan edildi?', answer: '1923' },
    ],
    Edebiyat: [
      { question: 'Divan edebiyatında önemli bir şair kimdir?', answer: 'Fuzuli' },
      { question: 'Orhun Kitabeleri hangi döneme aittir?', answer: 'Göktürkler' },
    ],
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Kullanıcı giriş durumunu sıfırla
    navigation.navigate('Login'); // Geri kayma animasyonu ile giriş ekranına yönlendir
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dersler</Text>
      
      <FlatList
        data={courses}
        numColumns={2} // 2 sütunlu grid yapısı
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Flashcards', { flashcards: flashcards[item.name] })}
          >
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Çıkış Yap Butonu */}
      <TouchableOpacity onPress={() => setIsLoggedIn(false) } style={styles.logoutButton}>
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 50, 
    alignItems: 'center', 
    backgroundColor: '#f8f9fa' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 20, 
    marginTop: 20,
  },
  gridContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 140,  // Kare şeklinde
    height: 140, // Kare şeklinde
    backgroundColor: '#007bff',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  logoutButton: {
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    width: 150,
    alignItems: 'center',
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

