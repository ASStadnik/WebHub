import { useEffect, useState } from 'react'
import './Admin.css'
import AddUserModal from '../components/AddUserModal.jsx'
import { apiFetch } from '../api.js'

function Admin() {
    const [tickets, setTickets] = useState([])
    const [users, setUsers] = useState([])
    const [showAddUser, setShowAddUser] = useState(false)
    const [section, setSection] = useState('tickets')
    const [openTicketId, setOpenTicketId] = useState(null)
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState('')


    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            return
        }

        apiFetch('http://127.0.0.1:8000/api/admin/tickets', {
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


        apiFetch('http://127.0.0.1:8000/api/admin/users', {
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

        apiFetch(`http://127.0.0.1:8000/api/admin/tickets/${ticketId}/status`, {
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

        apiFetch(`http://127.0.0.1:8000/api/admin/tickets/${ticketId}/priority`, {
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

        apiFetch('http://127.0.0.1:8000/api/admin/users', {
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


    function openComments(ticketId) {
        if (openTicketId === ticketId) {
            setOpenTicketId(null)
            setComments([])
            setCommentText('')
            return
        }

        const token = localStorage.getItem('token')

        apiFetch(`http://127.0.0.1:8000/api/tickets/${ticketId}/comments`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Ошибка загрузки комментариев')
                }

                return res.json()
            })
            .then(data => {
                setComments(data)
                setOpenTicketId(ticketId)
                setCommentText('')
            })
            .catch(err => {
                alert(err.message)
            })
    }


        function addComment(ticketId) {
            if (!commentText.trim()) {
                return
            }

            const token = localStorage.getItem('token')

            apiFetch(`http://127.0.0.1:8000/api/tickets/${ticketId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    text: commentText
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
                    setCommentText('')

                    return apiFetch(
                        `http://127.0.0.1:8000/api/tickets/${ticketId}/comments`,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }
                    )
                })
                .then(res => res.json())
                .then(data => {
                    setComments(data)
                })
                .catch(err => {
                    alert(err.message || 'Ошибка добавления комментария')
                })
        }
        function deleteUser(userId) {
        const answer = window.confirm('Удалить этого пользователя?')

        if (!answer) {
            return
        }

        const token = localStorage.getItem('token')

        apiFetch(`http://127.0.0.1:8000/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
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
                setUsers(
                    users.filter(user => user.id !== userId)
                )
            })
            .catch(err => {
                alert(err.message || 'Ошибка удаления пользователя')
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
                    className={
                        section === 'tickets'
                            ? 'adminMenuBtn active'
                            : 'adminMenuBtn'
                    }
                    onClick={() => setSection('tickets')}
                >
                    Все заявки
                </button>

                <button
                    type="button"
                    className={
                        section === 'users'
                            ? 'adminMenuBtn active'
                            : 'adminMenuBtn'
                    }
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


                                <button
                                    type="button"
                                    className="adminCommentsBtn"
                                    onClick={() => openComments(ticket.id)}
                                >
                                    {openTicketId === ticket.id
                                        ? 'Скрыть комментарии'
                                        : 'Комментарии'}
                                </button>


                                {openTicketId === ticket.id && (
                                    <div className="adminComments">

                                        {comments.length === 0 ? (
                                            <p className="adminNoComments">
                                                Комментариев пока нет
                                            </p>
                                        ) : (
                                            comments.map(comment => (

                                                <div
                                                    className={`adminComment ${comment.userRole}`}
                                                    key={comment.id}
                                                >

                                                    <div className="adminCommentTop">

                                                        <b>
                                                            {comment.userName}
                                                        </b>

                                                        <span>
                                                            {comment.userRole === 'ADMIN'
                                                                ? 'Администратор'
                                                                : 'Пользователь'}
                                                        </span>

                                                    </div>

                                                    <p>
                                                        {comment.text}
                                                    </p>

                                                    <small>
                                                        {new Date(
                                                            comment.createdAt
                                                        ).toLocaleString('ru-RU')}
                                                    </small>

                                                </div>
                                            ))
                                        )}


                                        <div className="adminCommentAdd">

                                            <textarea
                                                placeholder="Ответить пользователю..."
                                                value={commentText}
                                                onChange={(e) =>
                                                    setCommentText(e.target.value)
                                                }
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addComment(ticket.id)
                                                }
                                            >
                                                Отправить
                                            </button>

                                        </div>

                                    </div>
                                )}

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
                                    {user.role !== 'ADMIN' && (
                                    <button
                                        type="button"
                                        className="deleteUserBtn"
                                        onClick={() => deleteUser(user.id)}
                                    >
                                        Удалить
                                    </button>
                                )}

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