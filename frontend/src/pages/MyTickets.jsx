import { useEffect, useState } from 'react'
import './MyTickets.css'


function MyTickets() {
    const [tickets, setTickets] = useState([])

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
            .then(res => res.json())
            .then(data => setTickets(data))
    }, [])

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
                    <div className="ticketCard" key={ticket.id}>
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
                            {new Date(ticket.createdAt).toLocaleDateString('ru-RU')}
                        </div>

                        <div className="ticketPriority">
                            {ticket.priority === 'LOW' && 'Низкий'}
                            {ticket.priority === 'NORMAL' && 'Обычный'}
                            {ticket.priority === 'HIGH' && 'Высокий'}
                        </div>

                        <div className={`ticketStatus ${ticket.status}`}>
                            {ticket.status === 'NEW' ? 'Новая' : ticket.status}
                        </div>
                    </div>
                ))
            )}
        </div>
        </div>
    )
}

export default MyTickets