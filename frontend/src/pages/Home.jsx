import { useEffect, useState } from 'react'
import './Home.css'


function Home({ user }) {
    const [tickets, setTickets] = useState([])

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            setTickets([])
            return
        }

        fetch('http://127.0.0.1:8000/api/tickets', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setTickets(data))
   }, [user])
    const newCount = tickets.filter(ticket => ticket.status === 'NEW').length
    const workCount = tickets.filter(ticket => ticket.status === 'IN_PROGRESS').length
    const doneCount = tickets.filter(ticket => ticket.status === 'DONE').length
    return (
        <div className="homePage">
            <div className="homeTop">
                <div>
                    <h1>Главная</h1>
                    <p>Центр технической поддержки</p>
                </div>
            </div>

            <div className="homeCards">
                <div className="infoCard">
                    <span>Открытые заявки</span>
                    <h2>{newCount}</h2>
                </div>

                <div className="infoCard">
                    <span>В работе</span>
                    <h2>{workCount}</h2>
                </div>

                <div className="infoCard">
                    <span>Выполнено</span>
                    <h2>{doneCount}</h2>
                </div>
            </div>

            <div className="homeBlock">
                <div>
                    <h2>Нужна помощь?</h2>
                    <p>Создайте новую заявку в техническую поддержку</p>
                </div>

                <a href="/create">Создать заявку</a>
            </div>
        </div>
    )
}

export default Home