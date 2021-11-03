import React from 'react'
import { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'


const SessionsButton = () => {
    const [sessions, setSessions] = useState([])
    const history = useHistory()
    const historyState = history.location.state
    const monitor = historyState.monitor
    const location = useLocation()

    useEffect(() => {
        getSessions()
    }, [])

    const changeSession = (selectedSession) => {
        monitor.actualSession = selectedSession
        historyState.monitor = monitor
        history.replace(location.pathname, historyState)
    }

    const getSessions = async () => {
        const sessionsFromServer = await fetchSessions()
        setSessions(sessionsFromServer)
    }

    const fetchSessions = async () => {
        const res = await fetch('http://localhost:8888/sessions/get-all-sessions')
        return await res.json()
    }

    const sessionValueToFrench = (session) => {
        let sessionSeason = session.slice(0, -4)
        let sessionYear = session.slice(-4)
        let sessionSeasonToFrench = sessionSeason === "winter" ? "Hiver"
            : sessionSeason === "summer" ? "Été" : ""
        return sessionSeasonToFrench + " " + sessionYear
    }

    return (
        <div className="btn-group">
            <button type="button" className="btn btn-primary dropdown-toggle " id="navbarDropdown" role="button" data-toggle="dropdown" aria-expanded="false">
                Sessions
            </button>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                {sessions.map((session) => (
                    <button
                        type="button"
                        key={session.idSession}
                        className={`dropdown-item ${session.session === monitor.actualSession ? 'active' : ''}`}
                        onClick={(e) => {e.preventDefault(); changeSession(session.session)}}>
                        {sessionValueToFrench(session.session)}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default SessionsButton
