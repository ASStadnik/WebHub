import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import LoginModal from './LoginModal.jsx'
import './SideBar.css'


function SideBar({ user, setUser }) {
    const [showLogin, setShowLogin] = useState(false)

    function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setUser(null)
}
    return (
        <aside className="sideBar">
            <div>
                <h2>WebHub</h2>
            </div>

            <nav>
                <NavLink to="/">Главная</NavLink>
                <NavLink to="/create">Создать заявку</NavLink>
                <NavLink to="/tickets">Мои заявки</NavLink>
            </nav>

            {user ? (
                <div className="userBlock">
                    <div className="userIcon">
                        {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="userInfo">
                        <p className="userName">{user.name}</p>
                        <span>{user.role}</span>
                    </div>

                    <button
                        type="button"
                        className="logoutBtn"
                        onClick={logout}
                    >
                        Выйти
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    className="loginOpenBtn"
                    onClick={() => setShowLogin(true)}
                >
                    Войти
                </button>
            )}

            {showLogin && (
                <LoginModal
                    close={() => setShowLogin(false)}
                    setUser={setUser}
                />
            )}
        </aside>
    )
}

export default SideBar