import { useState } from 'react'
import './ChangePassModal.css'
import { apiFetch } from '../api.js'


function ChangePassModal({ close }) {
    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [msg, setMsg] = useState('')
    function changePass() {
    if (!oldPass || !newPass || !confirmPass) {
        setMsg('Заполните все поля')
        return
    }

    if (newPass !== confirmPass) {
        setMsg('Новые пароли не совпадают')
        return
    }

    const token = localStorage.getItem('token')

    if (!token) {
        setMsg('Сначала войдите в систему')
        return
    }

    apiFetch('http://127.0.0.1:8000/api/password', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            oldPass: oldPass,
            newPass: newPass
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
            setMsg('Пароль успешно изменён')
            setOldPass('')
            setNewPass('')
            setConfirmPass('')
        })
        .catch(err => {
            setMsg(err.message || 'Ошибка смены пароля')
        })
}
    return (
        <div className="passBack">
            <div className="passModal">

                <button
                    type="button"
                    className="passClose"
                    onClick={close}
                >
                    ×
                </button>

                <h2>Смена пароля</h2>
                <p>Введите текущий и новый пароль</p>

                <input
                    type="password"
                    placeholder="Старый пароль"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Новый пароль"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Подтверждение нового пароля"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                />

                <button
                    type="button"
                    className="passBtn"
                    onClick={changePass}
                >
                    Изменить пароль
                </button>

                {msg && (
                    <div className="passMsg">
                        {msg}
                    </div>
                )}

            </div>
        </div>
    )
}

export default ChangePassModal