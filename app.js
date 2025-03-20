// app.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// ミドルウェア：POSTデータのパース
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静的ファイルの配信（publicフォルダ内）
app.use(express.static('public'));

// フォーム送信のエンドポイント
app.post('/processLogin', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ status: 'Error', message: '入力が不足しています' });
  }
  
  // 保存するデータ
  const data = {
    date: new Date(),
    username,
    password
  };

  // 保存先のJSONファイルパス
  const filePath = path.join(__dirname, 'data.json');

  // 既存のデータを読み込む（なければ空配列）
  let fileData = [];
  if (fs.existsSync(filePath)) {
    try {
      fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.error('JSON parse error:', e);
    }
  }

  // 新しいデータを追加
  fileData.push(data);

  // JSONファイルに書き込む
  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
  
  res.json({ status: 'Success' });
});

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});