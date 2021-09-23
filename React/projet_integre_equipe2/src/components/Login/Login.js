import React from 'react'
// import StudentLogin from '../StudentLogin';
import MonitorLogin from '../MonitorLogin'; 
// import SupervisorLogin from '../SupervisorLogin';
import './Login.css'

const Login = () => {
    const addMonitor = async (monitor) => {
        const result = await fetch('http://localhost:5000/monitors',
        {
        method:'GET',
        headers:{
            'Content-type': 'application/json'
        },
            body: JSON.stringify(monitor)
        })
        const data = await result.json()
    }

    return (
        <div className="grad">
            <div className="d-flex justify-content-center">
                <div className="jumbotron jumbotron-fluid bg-light rounded w-25 shadow m-5">
                    <h2 className="text-center text-secondary">Login</h2>
                    <ul className="nav nav-tabs justify-content-center" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <a className="nav-link active" id="student-tab" data-toggle="tab" href="#student" role="tab" aria-controls="student" aria-selected="true">Étudiant</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className="nav-link text-black" id="monitor-tab" data-toggle="tab" href="#monitor" role="tab" aria-controls="monitor" aria-selected="false">Moniteur</a>
                        </li>
                        <li className="nav-item" role="presentation">
                            <a className="nav-link text-black" id="supervisor-tab" data-toggle="tab" href="#supervisor" role="tab" aria-controls="supervisor" aria-selected="false">Superviseur</a>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        {/* <div className="tab-pane fade show active" id="cegep" role="tabpanel" aria-labelledby="cegep-tab"><StudentLogin/></div> */}
                        <div className="tab-pane fade" id="monitor" role="tabpanel" aria-labelledby="monitor-tab"><MonitorLogin/></div>
                        {/* <div className="tab-pane fade" id="supervisor" role="tabpanel" aria-labelledby="supervisor-tab"><SupervisorLogin/></div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
