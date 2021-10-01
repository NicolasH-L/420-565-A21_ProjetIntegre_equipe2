import React from 'react'
import MonitorLogin from '../MonitorLogin'; 
import SupervisorLogin from '../SupervisorLogin';
import AdminLogin from '../AdminLogin';
import StudentLogin from '../StudentLogin';
import '../Form.css'
import {Link } from 'react-router-dom'
import NavbarRegistrationLogin from '../NavbarRegistrationLogin';
import { useHistory } from "react-router-dom";

const Login = () => {
    // const history = useHistory();
    // console.log(history.location.state.student)

    const studentLogin = async(matricule, password) => {
        const res = await fetch(`http://localhost:8888/students/${matricule}/${password}`)
        const data = await res.json()
        return data
    }
    
    const adminLogin = async(username, password) => {
        const res = await fetch(`http://localhost:8888/admin/${username}/${password}`)
        const data = await res.json()
        return data
    }

    const monitorLogin = async(email, password) => {
        const res = await fetch(`http://localhost:8888/monitors/${email}/${password}`)
        const data = await res.json()
        return data
    }

    return (
        <div className="grad">
            <NavbarRegistrationLogin/>
            <div className="d-flex justify-content-center">
                <div className="jumbotron jumbotron-fluid bg-light rounded w-50 shadow reactivescreen">
                    <h2 className="text-center text-secondary">Login</h2>
                    <ul className="nav nav-tabs justify-content-center" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a className="nav-link active text-black" id="student-tab" data-toggle="tab" href="#student" role="tab" aria-controls="student" aria-selected="false">Étudiant</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className="nav-link text-black" id="monitor-tab" data-toggle="tab" href="#monitor" role="tab" aria-controls="monitor" aria-selected="false">Moniteur</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className="nav-link text-black" id="supervisor-tab" data-toggle="tab" href="#supervisor" role="tab" aria-controls="supervisor" aria-selected="false">Superviseur</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className="nav-link text-black" id="admin-tab" data-toggle="tab" href="#admin" role="tab" aria-controls="supervisor" aria-selected="false">Gestionnaire</a>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="student" role="tabpanel" aria-labelledby="student-tab"><StudentLogin onLogin={studentLogin}/></div>
                        <div className="tab-pane fade" id="monitor" role="tabpanel" aria-labelledby="monitor-tab"><MonitorLogin onLogin={monitorLogin}/></div>
                        <div className="tab-pane fade" id="supervisor" role="tabpanel" aria-labelledby="supervisor-tab"><SupervisorLogin/></div>
                        <div className="tab-pane fade" id="admin" role="tabpanel" aria-labelledby="admin-tab"><AdminLogin onLogin={adminLogin}/></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
