import React, {useState, useEffect, useRef} from 'react';
import {v4 as uuidv4} from 'uuid';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
import useAutoScroll from '../hooks/useAutoScroll';
import {fetchGptReply} from '../services/chatApi';

function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [sessionID, setSessionID] = useState('');
    const [isSessionReady, setIsSessionReady] = useState(false);

    const messagesEndRef = useRef(null);
    useAutoScroll(messages, messagesEndRef);

    useEffect(() => {
        const newSessionID = uuidv4();
        setSessionID(newSessionID);

        // 统一使用 sessionID 作为 key 存储
        localStorage.setItem('sessionID', newSessionID);
        localStorage.removeItem('chatMessages');
        setIsSessionReady(true);

    }, []);

    const handleSend = (text) => {
        if (!isSessionReady) return;

        const userMessage = {role: 'user', text};
        setMessages((prev) => [...prev, userMessage]);
        localStorage.setItem('chatMessages', JSON.stringify([...messages, userMessage]));

        fetchGptReply(text, sessionID).then((reply) => {
            const botMessage = {role: 'bot', text: reply};
            setMessages((prev) => [...prev, botMessage]);
            localStorage.setItem('chatMessages', JSON.stringify([...messages, userMessage, botMessage]));
        }).catch((err) => {
            console.error('GPT Error:', err);
            const errorMsg = {role: 'bot', text: '⚠️ Call failed, please try again.'};
            setMessages((prev) => [...prev, errorMsg]);
            localStorage.setItem('chatMessages', JSON.stringify([...messages, userMessage, errorMsg]));
        });
    };

    return (
        <div className="chat-page">
            <div className="chat-window">
                <div className="chat-container">
                    {messages.map((msg, idx) => (
                        <ChatMessage key={idx} role={msg.role} text={msg.text}/>
                    ))}
                    <div ref={messagesEndRef}></div>
                </div>
            </div>
            <ChatInput onSend={handleSend}/>
        </div>
    );
}

export default ChatPage;