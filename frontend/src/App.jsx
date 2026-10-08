import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'

import SideBar from './components/SideBar.jsx'
import Home from './pages/Home.jsx'
import CreateTicket from './pages/CreateTicket.jsx'
import MyTickets from './pages/MyTickets.jsx'
import Admin from './pages/Admin.jsx'

function App() {
    const [user, setUser] = useState(() => {
        const userData = localStorage.getItem('user')

        if (userData) {
            return JSON.parse(userData)
        }

        return null
    })

    return (
        <div className="app">
            <SideBar user={user} setUser={setUser} />

            <main>
                <Routes>
                    <Route path="/" element={<Home user={user} />} />
                    <Route path="/create" element={<CreateTicket />} />
                    <Route path="/tickets" element={<MyTickets />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </main>
        </div>
    )
}

export default App