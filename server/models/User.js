const db = require("../config/db");

const User = {
    findByUserId: async (user_id) => {
        const [rows] = await db.execute("SELECT * FROM users WHERE user_id = ?", [user_id]);
        return rows[0];
    },

    createUser: async (user_id, user_nick, password, country, airline) => {
        try {
            await db.execute(
                "INSERT INTO users (user_id, user_nick, password, country, airline) VALUES (?, ?, ?, ?, ?)",
                [user_id, user_nick, password, country, airline]
            );
            console.log(`✅ 회원가입 완료: ${user_id}`);
        } catch (error) {
            console.error("❌ MySQL 저장 오류:", error);
            throw error;
        }
    }
};

module.exports = User;
