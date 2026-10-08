import { useState } from 'react'
import './AddUserModal.css'
import { apiFetch } from '../api.js'

function AddUserModal({ close, userAdded }) {
    const [name, setName] = useState('')
    const [login, setLogin] = useState('')
    const [userPass, setUserPass] = useState('')
    const [msg, setMsg] = useState('')

    function addUser() {
    if (!name.trim() || !login.trim() || !userPass.trim()) {
        setMsg('Заполните все поля')
        return
    }

    const token = localStorage.getItem('token')

    if (!token) {
        setMsg('Нет доступа')
        return
    }

    apiFetch('http://127.0.0.1:8000/api/admin/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: name,
            login: login,
            userPass: userPass
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
        .then(() => {
            setMsg('Пользователь создан')
            setName('')
            setLogin('')
            setUserPass('')

            userAdded()
        })
        .catch(err => {
            setMsg(err.message || 'Ошибка создания пользователя')
        })
}
    return (
        <div className="addUserBack">
            <div className="addUserModal">

                <button
                    type="button"
                    className="addUserClose"
                    onClick={close}
                >
                    ×
                </button>

                <h2>Новый пользователь</h2>
                <p>Создание новой учётной записи</p>

                <input
                    type="text"
                    placeholder="Имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Логин"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Пароль"
                    value={userPass}
                    onChange={(e) => setUserPass(e.target.value)}
                />

                <button
                    type="button"
                    className="addUserBtn"
                    onClick={addUser}
                >
                    Создать пользователя
                </button>

                {msg && (
                    <div className="addUserMsg">
                        {msg}
                    </div>
                )}

            </div>
        </div>
    )
}

export default AddUserModal