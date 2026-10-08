import { useEffect, useState } from 'react'
import './Admin.css'
import AddUserModal from '../components/AddUserModal.jsx'


function Admin() {
    const [tickets, setTickets] = useState([])
    const [users, setUsers] = useState([])
    const [showAddUser, setShowAddUser] = useState(false)
    const [section, setSection] = useState('tickets')

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            return
        }

        fetch('http://127.0.0.1:8000/api/admin/tickets', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Ошибка загрузки заявок')
                }

                return res.json()
            })
            .then(data => {
                setTickets(data)
            })
            .catch(err => {
                console.log(err)
                setTickets([])
            })

        fetch('http://127.0.0.1:8000/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Ошибка загрузки пользователей')
                }

                return res.json()
            })
            .then(data => {
                setUsers(data)
            })
            .catch(err => {
                console.log(err)
                setUsers([])
            })
    }, [])


    function changeStatus(ticketId, status) {
        const token = localStorage.getItem('token')

        fetch(`http://127.0.0.1:8000/api/admin/tickets/${ticketId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                status: status
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Ошибка изменения статуса')
                }

                return res.json()
            })
            .then(() => {
                setTickets(
                    tickets.map(ticket => {
                        if (ticket.id === ticketId) {
                            return {
                                ...ticket,
                                status: status
                            }
                        }

                        return ticket
                    })
                )
            })
            .catch(err => {
                alert(err.message)
            })
    }


    function changePriority(ticketId, priority) {
        const token = localStorage.getItem('token')

        fetch(`http://127.0.0.1:8000/api/admin/tickets/${ticketId}/priority`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                priority: priority
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Ошибка изменения приоритета')
                }

                return res.json()
            })
            .then(() => {
                setTickets(
                    tickets.map(ticket => {
                        if (ticket.id === ticketId) {
                            return {
                                ...ticket,
                                priority: priority
                            }
                        }

                        return ticket
                    })
                )
            })
            .catch(err => {
                alert(err.message)
            })
    }
    function loadUsers() {
        const token = localStorage.getItem('token')

        fetch('http://127.0.0.1:8000/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Ошибка загрузки пользователей')
                }

                return res.json()
            })
            .then(data => {
                setUsers(data)
            })
            .catch(err => {
                console.log(err)
            })
    }


    return (
        <div className="adminPage">

            <div className="adminTop">
                <div>
                    <h1>Админ-панель</h1>
                </div>
            </div>

            <div className="adminMenu">
                <button
                    type="button"
                    className={section === 'tickets' ? 'adminMenuBtn active' : 'adminMenuBtn'}
                    onClick={() => setSection('tickets')}
                >
                    Все заявки
                </button>

                <button
                    type="button"
                    className={section === 'users' ? 'adminMenuBtn active' : 'adminMenuBtn'}
                    onClick={() => setSection('users')}
                >
                    Пользователи
                </button>

               <button
                    type="button"
                    className="adminAddBtn"
                    onClick={() => setShowAddUser(true)}
                >
                    + Создать пользователя
               </button>
                </div>


            {section === 'tickets' && (
                <div className="adminTickets">

                    {tickets.length === 0 ? (
                        <div className="adminEmpty">
                            Заявок пока нет
                        </div>
                    ) : (
                        tickets.map(ticket => (
                            <div
                                className="adminTicket"
                                key={ticket.id}
                            >

                                <div className="adminTicketHead">
                                    <div>
                                        <span className="adminTicketNum">
                                            #{ticket.id}
                                        </span>

                                        <h3>
                                            {ticket.title}
                                        </h3>
                                    </div>

                                    <div
                                        className={`adminStatus ${ticket.status}`}
                                    >
                                        {ticket.status === 'NEW' && 'Новая'}
                                        {ticket.status === 'IN_PROGRESS' && 'В работе'}
                                        {ticket.status === 'DONE' && 'Выполнена'}
                                    </div>
                                </div>

                                <p className="adminTicketText">
                                    {ticket.text}
                                </p>

                                <div className="adminTicketInfo">

                                    <span>
                                        <b>Пользователь:</b> {ticket.userName}
                                    </span>

                                    <span>
                                        <b>Логин:</b> {ticket.userLogin}
                                    </span>

                                    <span>
                                        <b>Категория:</b> {ticket.category}
                                    </span>

                                    <span>
                                        <b>Приоритет:</b>{' '}

                                        {ticket.priority === 'LOW' && 'Низкий'}
                                        {ticket.priority === 'NORMAL' && 'Обычный'}
                                        {ticket.priority === 'HIGH' && 'Высокий'}
                                    </span>

                                    <span>
                                        <b>Дата:</b>{' '}
                                        {new Date(
                                            ticket.createdAt
                                        ).toLocaleDateString('ru-RU')}
                                    </span>

                                </div>

                                <div className="adminControls">

                                    <label>
                                        Статус

                                        <select
                                            value={ticket.status}
                                            onChange={(e) =>
                                                changeStatus(
                                                    ticket.id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="NEW">
                                                Новая
                                            </option>

                                            <option value="IN_PROGRESS">
                                                В работе
                                            </option>

                                            <option value="DONE">
                                                Выполнена
                                            </option>
                                        </select>
                                    </label>


                                    <label>
                                        Приоритет

                                        <select
                                            value={ticket.priority}
                                            onChange={(e) =>
                                                changePriority(
                                                    ticket.id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="LOW">
                                                Низкий
                                            </option>

                                            <option value="NORMAL">
                                                Обычный
                                            </option>

                                            <option value="HIGH">
                                                Высокий
                                            </option>
                                        </select>
                                    </label>

                                </div>

                            </div>
                        ))
                    )}

                </div>
            )}


            {section === 'users' && (
                <div className="adminUsers">

                    <h2>Пользователи</h2>

                    <div className="userList">

                        {users.length === 0 ? (
                            <div className="adminEmpty">
                                Пользователей пока нет
                            </div>
                        ) : (
                            users.map(user => (
                                <div
                                    className="adminUserCard"
                                    key={user.id}
                                >
                                    <div>
                                        <p className="adminUserName">
                                            {user.name}
                                        </p>

                                        <span className="adminUserLogin">
                                            {user.login}
                                        </span>
                                    </div>

                                    <div
                                        className={`adminUserRole ${user.role}`}
                                    >
                                        {user.role === 'ADMIN'
                                            ? 'Администратор'
                                            : 'Пользователь'}
                                    </div>
                                </div>
                            ))
                        )}

                    </div>
                </div>
            )}


            {showAddUser && (
                <AddUserModal
                    close={() => setShowAddUser(false)}
                    userAdded={loadUsers}
                />
            )}

        </div>
    )
}



export default Admin