import { useEffect, useState } from 'react'
import './CreateTicket.css'
import { apiFetch } from '../api.js'

function CreateTicket() {
    const [cats, setCats] = useState([])
    const [catId, setCatId] = useState('')
    const [priority, setPriority] = useState('NORMAL')
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [msg, setMsg] = useState('')

    useEffect(() => {
        apiFetch('http://127.0.0.1:8000/api/categories')
            .then(res => res.json())
            .then(data => setCats(data))
    }, [])


    function addTicket() {
        if (!catId || !title.trim() || !text.trim()) {
            setMsg('Заполните категорию, тему и описание')
            return
        }

        const token = localStorage.getItem('token')

        if (!token) {
            setMsg('Сначала войдите в систему')
            return
        }

        apiFetch('http://127.0.0.1:8000/api/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                categoryId: Number(catId),
                title: title,
                text: text,
                priority: priority
            })
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(data => {
                        throw new Error(data.detail)
                    })
                }

                return res.json()
            })
            .then(data => {
                setMsg('Заявка успешно создана')

                setCatId('')
                setPriority('NORMAL')
                setTitle('')
                setText('')
            })
            .catch(err => {
                setMsg(err.message || 'Ошибка создания заявки')
            })
    }


    return (
        <div className="createPage">
            <div className="createTop">
                <h1>Создать заявку</h1>
                <p>Опишите проблему или обращение</p>
            </div>

            <div className="ticketForm">
                <div className="formRow">
                    <div className="formField">
                        <label>Категория</label>

                        <select
                            value={catId}
                            onChange={(e) => setCatId(e.target.value)}
                        >
                            <option value="">Выберите категорию</option>

                            {cats.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="formField">
                        <label>Приоритет</label>

                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="LOW">Низкий</option>
                            <option value="NORMAL">Обычный</option>
                            <option value="HIGH">Высокий</option>
                        </select>
                    </div>
                </div>

                <div className="formField">
                    <label>Тема</label>

                    <input
                        type="text"
                        placeholder="Кратко опишите проблему"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="formField">
                    <label>Описание</label>

                    <textarea
                        rows="7"
                        placeholder="Опишите проблему подробнее"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                {msg && <p className="ticketMsg">{msg}</p>}

                <div className="formButtons">
                    <button type="button" onClick={addTicket}>
                        Создать заявку
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateTicket