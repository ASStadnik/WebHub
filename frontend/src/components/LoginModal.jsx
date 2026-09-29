import { useState } from 'react'
import './LoginModal.css'


function LoginModal({ close, setUser }) {
    const [login, setLogin] = useState('')
    const [userPass, setUserPass] = useState('')
    const [msg, setMsg] = useState('')


    function logUser() {
    if (!login.trim() || !userPass.trim()) {
        setMsg('Введите логин и пароль')
        return
    }

    fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
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
        .then(data => {
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))

            setUser(data.user)
            close()
        })
        .catch(err => {
            console.log(err)
            setMsg(err.message || 'Ошибка входа')
        })
}


    return (
        <div className="loginBack">
            <div className="loginModal">

                <button
                    type="button"
                    className="loginClose"
                    onClick={close}
                >
                    ×
                </button>

                <h2>Вход</h2>
                <p>Войдите в свою учётную запись</p>

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
                    className="loginBtn"
                    onClick={logUser}
                >
                    Войти
                </button>

                {msg && (
                    <div className="loginMsg">
                        {msg}
                    </div>
                )}

            </div>
        </div>
    )
}

export default LoginModal