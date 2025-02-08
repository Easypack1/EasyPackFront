const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');  // ✅ `auth.js` 파일 가져오기
const db = require('./config/db'); // MySQL 연결 파일

const app = express();

// 📌 Middleware 설정
app.use(cors());
app.use(bodyParser.json());

// 📌 API 라우트 설정
app.use('/api/user', authRoutes);  // `/api/user/register`, `/api/user/login` 등 사용 가능

// 📌 서버 실행
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
