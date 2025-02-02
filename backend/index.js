// app.js
const express = require('express');
const { BedrockClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock');
const mysql = require('mysql2/promise');

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Create an AWS Bedrock client (adjust the region as needed)
const bedrockClient = new BedrockRuntimeClient({ region: 'us-east-1' });

// Create a MySQL connection pool for your RDS instance
const pool = mysql.createPool({
  host: process.env.RDS_HOST,         // e.g., 'your-rds-endpoint.amazonaws.com'
  user: process.env.RDS_USER,         // your MySQL username
  password: process.env.RDS_PASSWORD, // your MySQL password
  database: process.env.RDS_DB,       // your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Define your system prompt (could also be loaded from a config)
const SYSTEM_PROMPT = `Amaç:

Kazanimlar_Tablosu.csv dosyasında yer alan, x.x.x.x formatında kodlanmış (örn: 9.1.1.1) öğrenme hedeflerine göre hafıza kartları oluşturmak.
Her bir kazanım için y adet, aktif hatırlama (active recall) ilkesine uygun, atomik (tek bilgi odaklı) hafıza kartı üretmek. (adet kullanıcı tarafından belirtilecek)

İçerik Yapısı: 
(İçerik Yapısının dışına çıkma ekstra herhangi bir açıklama yapma)

örnek1(Boşluk Doldurma):
[
    {
        "sinif": "9",
        "kazanim_kodu": "9.1.1.2",
        "konu": "Mantık",
        "aciklama": "İkinci dereceden bir bilinmeyenli eşitsizlik sistemlerinin çözüm kümesini bulmak.",
        "flashcards": [
            {
                "soru": "\"Ve\" bağlacı kullanılan bir bileşik önerme ancak iki önerme de .......... olduğunda doğrudur.",
                "cevap": "doğru",
                "ipucu": "Bir önerme doğru ise, o önerme doğru olarak kabul edilir."
            },
        ]
    }
]

örnek2(Boşluk Doldurma):
{
"sinif": "12",
"kazanim_kodu": "12.5.2.1",
"konu": "Türev",
"aciklama": "Türev kavramını açıklayarak işlemler yapar.",
"flashcards": [
{
"soru": "Bir fonksiyonun herhangi bir noktadaki türevi, o noktadaki .......... ifade eder.",
"cevap": "anlık değişim hızını",
"ipucu": "Eğimin matematiksel karşılığı"
},
{
"soru": "f(x) fonksiyonunun x=a noktasındaki türevi f'(a) = lim(h→0) .......... ile hesaplanır.",
"cevap": "[f(a+h)-f(a)]/h",
"ipucu": "Türevin limit tanımı"
}
]
}

örnek3(Nedir sorusu):
{
"sinif": "12",
"kazanim_kodu": "12.6.1.2",
"konu": "İntegral",
"aciklama": "Değişken değiştirme yoluyla integral alma işlemleri yapar.",
"flashcards": [
{
"soru": "İntegralde değişken değiştirme yönteminde u = g(x) seçildiğinde, dx yerine yazılması gereken ifade nedir?",
"cevap": "du/g'(x)",
"ipucu": "Diferansiyel formülü"
}
]
}

Dosyada yer alan her öğrenme hedefi aşağıdaki alanları içerir:

Sınıf: (Örn: 9)
Kazanım Kodu: (Örn: 9.1.1.1, hiyerarşik yapıdaki kod)
Konu: (Örn: Mantık, Yazılım Mühendisliği vb.)
Açıklama: Öğrenme hedefinin detaylı ifadesi
Genel Yönergeler:

Dil ve Format:

Tüm kartlar Türkçe hazırlanacaktır.
Kart metinleri, ilgili konuya özgü bir başlangıç ifadesiyle başlamalıdır.

Atomik Olmalı: Her kart tek bir bilgi parçasını hedeflemeli, birden fazla soru veya kavram içermemelidir.
Cloze Deletion Kullanımı: Kartlarda cevap kısmı, cloze deletion formatında "cevap" şeklinde yer almalıdır.
İpucu eklemek istenirse, format "cevap::ipucu" şeklinde kullanılmalıdır.
Kısa ve Öz Cevap: Cevaplar genellikle tek kelime veya birkaç anahtar kelimeden oluşmalıdır.
Öğrenme Hedeflerine Yönelik İçerik:

Üretilen kartlar, aktif hatırlama ve spaced repetition sistemlerine uygun olarak hazırlanmalıdır.
Her kart, ilgili kazanımın açıklamasındaki temel ve kritik bilgiyi hedeflemelidir.
Soru, kullanıcıya öğrenme hedefiyle ilgili tek bir kavramı (örneğin, önerme, mantıksal ilişki, algoritma adımı vb.) sormalıdır.

Özel Notlar:

Kullanıcı, dosyadaki her bir kazanım için y adet hafıza kartı oluşturmasını isteyecektir.
Kartlar, lise seviyesindeki YKS çalışanlarının öğrenme süreçlerine katkıda bulunacak şekilde, temel ve kritik bilgileri öne çıkaracak biçimde hazırlanmalıdır.
Kullanıcı y,x.x.x.x şeklinde bir promt girdiğinde bu bilgiden x.x.x.x kısmından o kazanımın kodu olduğu anlaşılmalıdır bu kazanıma göre de y adet anki style atomic soru oluşturulacak.
Soruların doğru olması konusunda özen göster.
Sadece Json formatında bilgi ver herhangi bir açıklama yapma.
Eşit oranda boşluk doldurma ve nedir sorusu sor.`;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route to handle prompt generation
app.post('/generate', async (req, res) => {
  try {
    // expected JSON body: { "messageContent": "3,9.1.1.1" }
    const { messageContent } = req.body;
    if (!messageContent) {
      return res.status(400).json({ error: "there is no messageContent in req body" });
    }

    const finalPrompt = `${SYSTEM_PROMPT}\n\n${messageContent}`;

    const command = new InvokeModelCommand({
      ModelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0',  // e.g., the ID for a specific foundation model
      InputText: finalPrompt,
      // Additional parameters such as temperature, max tokens, etc., may be required.
    });

    // Invoke the model
    const response = await bedrockClient.send(command);

    // Extract the generated text from the response.
    // (Change 'GeneratedText' to the correct field based on the API.)
    const generatedFlashCards = response.GeneratedText || "No flashcards are generated";

    // Insert the flashcards into the database
    // const connection = await pool.getConnection();
    // try {
    //   const insertQuery = 'INSERT INTO prompts (user_prompt, generated_text) VALUES (?, ?)';
    //   await connection.execute(insertQuery, [prompt, generatedText]);
    // } finally {
    //   connection.release();
    // }

    // Return the generated text as the response.
    res.json({ success: true, generatedFlashCards });
  } catch (error) {
    console.error('Error during generation:', error);
    res.status(500).json({ error: 'An error occurred while generating text.' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
