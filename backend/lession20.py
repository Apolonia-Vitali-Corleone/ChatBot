"""
目标是创建一个http服务器，使用langchain来作为后端
传递给前端

pip install flask
pip install flask-cors
"""
from flask import Flask, request, jsonify
from flask_cors import CORS  # 导入CORS模块
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
import uuid
import time

import os
from dotenv import load_dotenv

# 设置代理
os.environ['http_proxy'] = "127.0.0.1:4343"
os.environ['https_proxy'] = "127.0.0.1:4343"

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)  # 启用CORS支持，允许携带凭证

llm = ChatOpenAI(model="gpt-4", temperature=0)
store = {}


def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]


prompt = ChatPromptTemplate.from_messages([
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])

chain = prompt | llm

conv_chain = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history"
)


def generate_time_based_uuid():
    timestamp = str(time.time())
    unique_id = uuid.uuid5(uuid.NAMESPACE_DNS, timestamp)
    return str(unique_id)


@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get('input')
    session_id = data.get('session_id')

    response = conv_chain.invoke(
        {"input": user_input},
        config={"configurable": {"session_id": session_id}}
    )

    return jsonify({"response": response.content})


if __name__ == '__main__':
    app.run(port=5000)
