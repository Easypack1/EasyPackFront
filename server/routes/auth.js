const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();  // ✅ `router` 정의 추가

// 📌 회원가입 API
router.post("/register", async (req, res) => {
    try {
        const { user_id, user_nick, password, country, airline } = req.body;

        if (!user_id || !user_nick || !password || !country || !airline) {
            return res.status(400).json({ status: "error", message: "모든 필드를 입력하세요." });
        }

        // 이미 존재하는 사용자 확인
        const existingUser = await User.findByUserId(user_id);
        if (existingUser) {
            return res.status(400).json({ status: "duplicate", message: "이미 존재하는 아이디입니다." });
            }

            // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.createUser(user_id, user_nick, country, airline, hashedPassword);

        console.log("✅ 회원가입 성공: ", user_id); // 로그 추가

        return res.json({ status: "success", message: "회원가입 성공!" });
    } catch (error) {
        console.error("❌ 회원가입 오류:", error);
        return res.status(500).json({ status: "error", message: "서버 오류" });
                    }
});



// 📌 로그인 API
router.post("/login", async (req, res) => {
    try {
        const { user_id, password } = req.body;
        const user = await User.findByUserId(user_id);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ status: "error", message: "아이디 또는 비밀번호가 올바르지 않습니다." });
                }

        // JWT 토큰 생성
        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ status: "success", token, user });
    } catch (error) {
        console.error("❌ 로그인 오류:", error);
        res.status(500).json({ status: "error", message: "서버 오류" });
    }
});

// 📌 `router`를 내보내야 `server.js`에서 사용할 수 있음!
module.exports = router;
