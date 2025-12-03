from flask import Flask, request, jsonify
from flask_cors import CORS  # 导入CORS模块
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
import uuid
import time

from dotenv import load_dotenv

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
    try:
        data = request.get_json()
        if not data or 'input' not in data:
            return jsonify({"error": "Missing input"}), 400

        user_input = data.get('input')
        session_id = data.get('session_id') or generate_time_based_uuid()

        if not user_input.strip():
            return jsonify({"error": "Empty input"}), 400

        response = conv_chain.invoke(
            {"input": user_input},
            config={"configurable": {"session_id": session_id}}
        )

        return jsonify({"response": response.content, "session_id": session_id})
    except Exception as e:
        app.logger.error(f"Chat error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": time.time()})


if __name__ == '__main__':
    app.run(port=5000)