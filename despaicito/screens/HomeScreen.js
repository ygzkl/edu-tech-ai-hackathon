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
      { question: "De Morgan kuralına göre \n'~(p ∧ q)' ifadesi .......... ifadesine eşittir.", answer: "~p ∨ ~q", hint: "Ve bağlacının değili, değillerin veyasıdır" },
      { question: "A kümesi B kümesinin alt kümesi ise A'nın eleman sayısı B'nin eleman sayısından ne olmalıdır?", answer: "küçük veya eşit", hint: "Alt küme en fazla ana küme kadar eleman içerebilir"},
      { question: "Üç doğru parçasının üçgen oluşturabilmesi için, herhangi iki kenarın toplamı .......... olmalıdır.", answer: "üçüncü kenardan büyük", hint: "Üçgen eşitsizliği"},
      { question: "n elemanlı bir kümeden r elemanlı permütasyon sayısı nedir?", answer: "P(n,r) = n!/(n-r)!" , hint: "Sıralı seçim formülü"},  
      { question: "Birim çemberde, bir noktanın x koordinatı .......... değerine eşittir.", answer: "cosx" , hint: "Yatay eksen değeri"},
      { question: "Bir fonksiyonun grafiğinde, y değerlerinin en büyük olduğu nokta neyi gösterir?", answer: "maksimum değeri" , hint:  "Tepe noktası kavramı"},
      { question: "Bir çemberde, çapın orta noktasına eşit uzaklıktaki kirişler .......... olur.", answer: "eşit uzunlukta" , hint:  "Merkeze eşit uzaklık özelliği"},
      { question: "Bir aritmetik dizide ardışık terimler arasındaki farka ne ad verilir?", answer: "artış miktarı" , hint: "Sabit fark"},
      { question: "∫[a,b] f(x)dx = -∫[b,a] f(x)dx özelliği belirli integralin hangi özelliğidir?", answer: "yön değiştirme özelliği" , hint:  "İntegral sınırlarının yer değiştirmesi"},
    ],
    
    Fizik: [
      { question: "Bir maddenin birim hacminin kütlesine .......... denir.", answer: "özkütle", hint: "d=m/V formülünde d ile gösterilir" },
      { question: "Hareketli bir cisme göre duran bir cisim nedir?", answer: "Göreceli olarak hareketli", hint: "Referans noktasına bağlı hareket durumu" },
      { question: "Birim zamanda geçen elektrik yükü miktarına ne ad verilir?", answer: "Elektrik akımı", hint: "I = Q/t formülü ile hesaplanır" },
      { question: "Bir dalganın ardışık iki tepe noktası arasındaki mesafeye .......... denir.", answer: "dalga boyu", hint: "Lambda (λ) ile gösterilir" },
      { question: "Bir cismin kütlesi ile hızının çarpımına ne ad verilir?", answer: "Momentum", hint: "p = m.v formülü ile hesaplanır" },
      { question: "Coulomb yasasına göre yüklü cisimler arasındaki uzaklık iki katına çıkarıldığında elektriksel kuvvet .......... kat azalır.", answer: "dört", hint: "Uzaklığın karesiyle ters orantılı" },
      { question: "Atomun merkezinde yer alan ve proton ile nötronları barındıran bölgeye ne ad verilir?", answer: "çekirdek", hint: "Atomun en yoğun kısmı" },
    ],
    
    Kimya: [
      { question: "............ atom modelinde atom, içinde pozitif yüklerin homojen olarak dağıldığı bir küre ve bu kürenin içine gömülü elektronlardan oluşur.", answer: "Thomson", hint: "Üzümlü kek modeli olarak da bilinir" },
      { question: "İki ya da daha fazla atomun bir araya gelerek oluşturduğu kimyasal tür nedir?", answer: "Molekül", hint: "H2O bir örnektir" },
      { question: "Kimyasal tepkimelerde toplam kütle ............ kalır.", answer: "sabit", hint: "Lavoisier Yasası" },
      { question: "Sulu çözeltilerine H+ iyonu veren maddelere ne ad verilir?", answer: "Asit", hint: "pH değeri 7'den küçüktür" },
      { question: "Elektronların bulunma olasılığının en yüksek olduğu bölgeye ne ad verilir?", answer: "Orbital", hint: "s, p, d, f harfleriyle gösterilir" },
      { question: "Tepkimeye giren taneciklerin sahip olması gereken minimum enerji değerine ............ denir.", answer: "aktivasyon enerjisi", hint: "Ea ile gösterilir" },
      { question: "Elektron alarak indirgenme sayısı azalan türe ne ad verilir?", answer: "Yükseltgen", hint: "Kendisi indirgenir" },
      { question: "Sadece karbon ve hidrojen içeren bileşiklere ............ denir.", answer: "hidrokarbon", hint: "Metan, etan örnektir" },
    ],
    
    Biyoloji: [
      { question: "Canlıların sınıflandırılmasında kullanılan en küçük birim .......... 'dür.", answer: "tür", hint: "Birbirleriyle çiftleşip verimli döller oluşturabilen canlı grubu" },
      { question: "Tek hücreli canlılarda hücre bölünmesinin temel amacı nedir?", answer: "Üreme", hint: "Neslin devamını sağlama" },
      { question: "Bir karaktere ait iki alelden baskın olan alel .......... ile gösterilir.", answer: "büyük harf", hint: "Mendel genetiğinde kullanılan gösterim" },
      { question: "Göz sağlığının korunması için ekrana bakma mesafesi en az .......... cm olmalıdır.", answer: "50", hint: "Yarım metre" },
      { question: "Miyelin kılıfın hasar görmesiyle ortaya çıkan sinir sistemi hastalığı nedir?", answer: "Multiple Skleroz (MS)", hint: "Merkezi sinir sistemini etkileyen otoimmün hastalık" },
      { question: "DNA'nın çift sarmal yapısını keşfeden bilim insanları .......... ve .......... 'dır.", answer: "Watson ve Crick", hint: "1953 yılında Nobel ödülü alan ikili" },
      { question: "Protein sentezinin başlama kodonu nedir?", answer: "AUG", hint: "Metiyonin amino asidini kodlayan üçlü" },
      { question: "DNA'nın belirli bölgelerini kesen enzimlere ne ad verilir?", answer: "restriksiyon endonükleaz", hint: "Genetik mühendisliğinde kullanılan moleküler makas" },
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

