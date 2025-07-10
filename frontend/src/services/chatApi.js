import axios from 'axios';

export async function fetchGptReply(userMessage) {
    const response = await axios.post(
        'http://127.0.0.1:5000/chat', // 本地后端的URL
        {
            input: userMessage,
            session_id: localStorage.getItem("sessionID")
        },
        {
            headers: {
                'Content-Type': 'application/json',
                // 如果本地后端需要身份验证，请在这里添加相应的头部信息
            },
        }
    );

    return response.data.response;
}