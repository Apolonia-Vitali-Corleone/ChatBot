import React, {useState} from 'react';

function UseState() {
    // 1. 计数器示例
    const [count, setCount] = useState(0);

    // 2. 输入框示例
    const [inputValue, setInputValue] = useState('');

    // 3. 列表示例
    const [items, setItems] = useState(['🍎', '🍌']);

    // 添加新项到列表
    const addItem = () => {
        if (inputValue.trim()) {
            setItems([...items, inputValue]);
            setInputValue(''); // 清空输入框
        }
    };

    // 删除指定索引的项
    const removeItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-2xl font-bold mb-6">useState 示例</h1>

            {/* 计数器部分 */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h2 className="text-lg font-semibold mb-2">计数器</h2>
                <p className="mb-4">当前计数: <span className="font-bold">{count}</span></p>
                <button onClick={() => setCount(count + 1)} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                    +1
                </button>
                <button onClick={() => setCount(0)} className="bg-gray-500 text-white px-4 py-2 rounded">
                    重置
                </button>
            </div>

            {/* 输入框和列表部分 */}
            <div className="bg-green-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">待办事项</h2>

                <div className="flex mb-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}

                        placeholder="添加新项..."
                        className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button onClick={addItem} className="bg-green-500 text-white px-4 py-2 rounded-r">
                        添加
                    </button>
                </div>

                <ul>
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center justify-between py-2 border-b border-gray-200">
                            <span>{item}</span>
                            <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">
                                ❌
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default UseState;
