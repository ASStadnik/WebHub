import { useEffect, useState } from 'react'
import './MyTickets.css'


function MyTickets() {
    const [tickets, setTickets] = useState([])
    const [openTicketId, setOpenTicketId] = useState(null)
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            return
        }

        fetch('http://127.0.0.1:8000/api/tickets', {
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
    }, [])


    function deleteTicket(ticketId) {
        const answer = window.confirm('Удалить эту заявку?')

        if (!answer) {
            return
        }

        const token = localStorage.getItem('token')

        fetch(`http://127.0.0.1:8000/api/tickets/${ticketId}`, {
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
                setTickets(
                    tickets.filter(ticket => ticket.id !== ticketId)
                )
            })
            .catch(err => {
                alert(err.message || 'Ошибка удаления заявки')
            })
    }


    function openComments(ticketId) {
        if (openTicketId === ticketId) {
            setOpenTicketId(null)
            setComments([])
            return
        }

        const token = localStorage.getItem('token')

        fetch(`http://127.0.0.1:8000/api/tickets/${ticketId}/comments`, {
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

    fetch(`http://127.0.0.1:8000/api/tickets/${ticketId}/comments`, {
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

            return fetch(
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


    return (
        <div className="ticketsPage">

            <div className="ticketsTop">
                <h1>Мои заявки</h1>
                <p>История ваших обращений</p>
            </div>

            <div className="ticketList">

                {tickets.length === 0 ? (
                    <div className="emptyTickets">
                        У вас пока нет заявок
                    </div>
                ) : (
                    tickets.map(ticket => (
                        <div
                            className="ticketCard"
                            key={ticket.id}
                        >

                            <div className="ticketMain">

                                <div className="ticketNum">
                                    #{ticket.id}
                                </div>

                                <div>
                                    <h3>{ticket.title}</h3>
                                    <p>{ticket.category}</p>
                                </div>

                            </div>


                            <div className="ticketDate">
                                {new Date(
                                    ticket.createdAt
                                ).toLocaleDateString('ru-RU')}
                            </div>


                            <div className="ticketPriority">
                                {ticket.priority === 'LOW' && 'Низкий'}
                                {ticket.priority === 'NORMAL' && 'Обычный'}
                                {ticket.priority === 'HIGH' && 'Высокий'}
                            </div>


                            <div className={`ticketStatus ${ticket.status}`}>
                                {ticket.status === 'NEW' && 'Новая'}
                                {ticket.status === 'IN_PROGRESS' && 'В работе'}
                                {ticket.status === 'DONE' && 'Выполнена'}
                            </div>


                            {ticket.status === 'NEW' && (
                                <button
                                    type="button"
                                    className="deleteTicketBtn"
                                    onClick={() => deleteTicket(ticket.id)}
                                >
                                    Удалить
                                </button>
                            )}


                            <button
                                type="button"
                                className="commentsBtn"
                                onClick={() => openComments(ticket.id)}
                            >
                                {openTicketId === ticket.id
                                    ? 'Скрыть комментарии'
                                    : 'Комментарии'}
                            </button>


                            {openTicketId === ticket.id && (
                                <div className="ticketComments">

                                    {comments.length === 0 ? (
                                        <p className="noComments">
                                            Комментариев пока нет
                                        </p>
                                    ) : (
                                        comments.map(comment => (
                                            <div
                                                className={`commentItem ${comment.userRole}`}
                                                key={comment.id}
                                            >

                                                <div className="commentTop">

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
                                    <div className="commentAdd">
                                        <textarea
                                            placeholder="Напишите комментарий..."
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => addComment(ticket.id)}
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

        </div>
    )
}


export default MyTickets