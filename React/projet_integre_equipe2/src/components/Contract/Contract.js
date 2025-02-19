import React from 'react'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Signature } from '../Constants/Signature'
import Swal from 'sweetalert2'

const Contract = ({ currentStatus, contractProp, signature }) => {
    const history = useHistory()
    const historyState = history.location.state
    const typeNotification = "Signature"
    const message = "Veuillez signer le contrat disponible"
    const [internship, setInternship] = useState(null)
    const [contract, setContract] = useState(null)
    const [contractState, setContractState] = useState({ password: "", isDisabled: false, signature: "", adminSignature: "" })
    const [notification, setNotification] = useState({
        typeNotification: typeNotification, message: message, session: ""
    })
    let hasStudentSigned = false
    let hasMonitorSigned = false
    const baseUrl = "http://localhost:8888"
    const signatureStatusList = [Signature.getStudentSignatureStatus(), Signature.getMonitorSignatureStatus(),
    Signature.getAdminSignatureStatus(), Signature.getCompleteSignatureStatus()]

    const fireSwalBadName = () => {
        Swal.fire({
            title: "Veuillez inscrire votre nom au complet",
            icon: 'info',
            position: 'top',
            toast: true,
            timer: 2000,
            showConfirmButton: false,
            width: '450px',
        })
    }

    const fireSwalBadPassword = () => {
        Swal.fire({
            title: "Veuillez entrer votre mot de passe correctement",
            icon: 'warning',
            position: 'top',
            toast: true,
            timer: 2000,
            showConfirmButton: false,
            width: '500px',
        })
    }

    useEffect(() => {
        if (contractState.signature === "") {
            contractState.signature = signature
        }
        setInternship(contractProp.internship)
        setContract(contractProp)
        setContractState({ ...contractState, isDisabled: currentStatus !== contractProp.internship.status })
    }, [])

    useEffect(() => {
        if (contractState.password !== "" && contractState.signature !== "") {
            window.location.reload(true)
        }

    }, [contractState.signature, contractState.adminSignature])

    const updateContract = async (contract) => {
        const result = await fetch(`${baseUrl}/contract/save-contract`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(contract)
            })
        return await result.json()
    }

    const updateInternship = async () => {
        const result = await fetch(`${baseUrl}/internship/save-internship`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(internship)
            })
        return await result.json()
    }

    const verifyPwdStudent = async (matricule, pwd) => {
        const res = await fetch(`http://localhost:8888/students/verify-password/${matricule}/${pwd}`)
        return await res.json()
    }

    const verifyPwdMonitor = async (email, pwd) => {
        const res = await fetch(`http://localhost:8888/monitors/verify-password/${email}/${pwd}`)
        return await res.json()
    }

    const verifyPwdAdmin = async (username, pwd) => {
        const res = await fetch(`http://localhost:8888/admin/verify-password/${username}/${pwd}`)
        return await res.json()
    }

    const onSubmit = (e) => {
        e.preventDefault()
        validateInput()
    }

    const verifyStatus = (actualStatus, expectedStatus) => {
        return currentStatus === actualStatus && currentStatus === expectedStatus
    }

    const sign = () => {
        if (internship.status === Signature.getStudentSignatureStatus()) {
            contract.studentSignature = internship.student.firstName + " " + internship.student.lastName
            contract.signatureDateStudent = getToday()
            contractState.signature = contract.studentSignature
            hasStudentSigned = true

        } else if (internship.status === Signature.getMonitorSignatureStatus()) {
            contract.monitorSignature = internship.offer.monitor.firstName + " " + internship.offer.monitor.lastName
            contract.signatureDateMonitor = getToday()
            contractState.signature = contract.monitorSignature
            hasMonitorSigned = true

        } else if (internship.status === Signature.getAdminSignatureStatus()) {
            if (contractState.adminSignature === "" || contractState.adminSignature === null) {
                fireSwalBadName()
                return
            }
            contract.signatureDateAdmin = getToday()
            contract.adminSignature = contractState.adminSignature
            contractState.signature = contract.adminSignature
        }
        updateStatus()
        updateInternship()
        setContractState({ ...contractState, isDisabled: true })
        updateContract(contract)
        notification.session = contract.session
        if (hasStudentSigned) {
            createNotificationForMonitor(notification, contract.internship.offer.monitor.id)
        } else if (hasMonitorSigned)
            createNotificationForAdmin(notification, contract.internship.offer.monitor.id)
    }

    const validateInput = () => {

        if (verifyStatus(contractProp.internship.status, signatureStatusList[0])) {
            verifyPwdStudent(contract.internship.student.matricule, contractState.password)
                .then(data => data === true ? sign() : data === false ?
                    fireSwalBadPassword()
                    : fireSwalBadPassword())
        }
        else if (verifyStatus(contractProp.internship.status, signatureStatusList[1])) {
            verifyPwdMonitor(contract.internship.offer.monitor.email, contractState.password)
                .then(data => data === true ? sign() : data === false ?
                    fireSwalBadPassword()
                    : fireSwalBadPassword())
        }
        else if (verifyStatus(contractProp.internship.status, signatureStatusList[2])) {
            verifyPwdAdmin(historyState.admin.username, contractState.password)
                .then(data => data === true ? sign() : data === false ?
                    fireSwalBadPassword()
                    : fireSwalBadPassword())
        }
    }

    const createNotificationForMonitor = async (notification, monitorId) => {
        const result = await fetch(`http://localhost:8888/notification/save-notification-for-monitor/${monitorId}`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(notification)
            })
        return await result.json()
    }

    const createNotificationForAdmin = async (notification) => {
        const result = await fetch('http://localhost:8888/notification/save-notification-for-admin',
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(notification)
            })
        return await result.json()
    }

    const updateStatus = () => {
        var nextStatusIndex = signatureStatusList.indexOf(internship.status) + 1
        if (nextStatusIndex > signatureStatusList.length)
            nextStatusIndex = signatureStatusList.length - 1
        internship.status = signatureStatusList[nextStatusIndex]
    }

    const setContractStatePassword = (e) => {
        setContractState({ ...contractState, password: e.target.value })
    }

    const setAdminSignature = (e) => {
        setContractState({ ...contractState, adminSignature: e.target.value })
    }

    const getToday = () => {
        return new Date().toLocaleString("en-CA", { year: "numeric", month: "numeric", day: "numeric" })
    }

    const isAdminSignStatus = () => {
        return (currentStatus !== Signature.getAdminSignatureStatus() || (contract.adminSignature !== "" && contract.adminSignature !== null)
            || (currentStatus === Signature.getAdminSignatureStatus() && currentStatus !== internship.status))
    }

    const sessionValueToFrench = (session) => {
        let sessionSeason = session.slice(0, -4)
        let sessionYear = session.slice(-4)
        let sessionSeasonToFrench = sessionSeason === "winter" ? "Hiver"
            : sessionSeason === "summer" ? "Été" : ""
        return sessionSeasonToFrench + " " + sessionYear
    }

    return (
        <>
            <form className="container-fluid" onSubmit={onSubmit} >
                <h1 className="text-center">Contrat</h1>
                {internship && contract && (
                    <div>
                        <div className="form-group">
                            <label htmlFor="adminName" className="text-secondary">Le gestionnaire de stage : </label>
                            <input type="text" className="form-control text-center" id="adminName" name="adminName" onChange={setAdminSignature}
                                disabled={isAdminSignStatus()} placeholder={contract.adminSignature !== "" && contract.adminSignature !== null ? contract.adminSignature : ""} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="monitorName" className="text-secondary"> L'employeur : </label>
                            <input type="text" className="form-control text-center" id="monitorName" name="monitorName"
                                value={internship.offer.monitor.firstName + " " + internship.offer.monitor.lastName} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="monitorTelephoneNumber" className="text-secondary"> Numéro de téléphone de l'employeur : </label>
                            <input type="text" className="form-control text-center" id="monitorTelephoneNumber" name="monitorTelephoneNumber"
                                value={internship.offer.monitor.telephoneNumber} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="studentName" className="text-secondary"> L'étudiant : </label>
                            <input type="text" className="form-control text-center" id="studentName" name="studentName"
                                value={internship.student.firstName + " " + internship.student.lastName} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="studentTelephoneNumber" className="text-secondary"> Numéro de téléphone de l'étudiant : </label>
                            <input type="text" className="form-control text-center" id="studentTelephoneNumber" name="studentTelephoneNumber"
                                value={internship.student.telephoneNumber} readOnly />
                        </div>
                        <h2 className="text-center mt-5">Conditions de stage suivants :</h2>
                        <div className="form-group">
                            <label htmlFor="session" className="text-secondary">Session du stage : </label>
                            <input type="text" className="form-control text-center" id="session" name="session" value={sessionValueToFrench(internship.session)} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location" className="text-secondary">Endroit du stage : </label>
                            <input type="text" className="form-control text-center" id="location" name="location" value={internship.offer.address} readOnly />
                        </div>
                        <h4 className="text-center mt-5">Durée du stage</h4>
                        <div className="form-group">
                            <label htmlFor="durationStart" className="text-secondary">Date de début : </label>
                            <input type="text" className="form-control text-center" id="durationStart" name="durationStart" value={internship.offer.startInternshipDate} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="durationEnd" className="text-secondary">Date de fin : </label>
                            <input type="text" className="form-control text-center" id="durationEnd" name="durationEnd" value={internship.offer.endInternshipDate} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="numberOfWeeks" className="text-secondary">Nombre total de semaines : </label>
                            <input type="text" className="form-control text-center" id="numberOfWeeks" name="numberOfWeeks"
                                value={internship.offer.weeksBetweenDates} readOnly />
                        </div>
                        <h4 className="text-center mt-5">Horaire de travail</h4>
                        <div className="form-group">
                            <label htmlFor="schedule" className="text-secondary">Horaire de travail : </label>
                            <input type="text" className="form-control text-center" id="schedule" name="schedule" value={internship.offer.jobSchedules} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="weeklyHours" className="text-secondary">Nombre total d'heures par semaine : </label>
                            <input type="text" className="form-control text-center" id="weeklyHours" name="weeklyHours" value={internship.offer.workingHours} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="salary" className="text-secondary">Salaire : </label>
                            <input type="text" className="form-control text-center" id="salary" name="salary" value={internship.offer.salary} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="duties" className="text-secondary">Taches et responsabilités du stagiaire : </label>
                            <textarea type="text" className="form-control" id="duties" name="duties" rows="5" value={internship.offer.description} readOnly />
                        </div>
                        <h4 className="text-center mt-5">Responsabilités</h4>
                        <div className="form-group">
                            <label htmlFor="responsabilityCollege" className="text-secondary">Le collège s’engage à : </label>
                            <textarea type="text" className="form-control" id="responsabilityCollege" name="responsabilityCollege" rows="5" value={contract.collegeResponsability} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="responsabilityCompany" className="text-secondary">L’entreprise s’engage à : </label>
                            <textarea type="text" className="form-control" id="responsabilityCompany" name="responsabilityCompany" rows="5" value={contract.companyResponsability} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="responsabilityStudent" className="text-secondary">L’étudiant s’engage à : </label>
                            <textarea type="text" className="form-control" id="responsabilityStudent" name="responsabilityStudent" rows="5" value={contract.studentResponsability} readOnly />
                        </div>
                        <h3 className="text-center mt-5">Signatures</h3>
                        <div className="form-group">
                            <label htmlFor="signatureStudent" className="text-secondary">Signature de l'étudiant : </label>
                            <input type="text" className="form-control text-center" id="signatureStudent" name="signatureStudent" value={contract.studentSignature !== "" ? contract.studentSignature : ""} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signatureDateStudent" className="text-secondary">Date de signature de l'étudiant : </label>
                            <input type="text" className="form-control text-center" id="signatureDateStudent" name="signatureDateStudent"
                                value={contract.signatureDateStudent !== "" ? contract.signatureDateStudent : (currentStatus === Signature.getStudentSignatureStatus() && contract.studentSignature !== "") ? getToday() : ""} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signatureMonitor" className="text-secondary">Signature de l'employeur : </label>
                            <input type="text" className="form-control text-center" id="signatureMonitor" name="signatureMonitor" value={contract.monitorSignature !== "" ? contract.monitorSignature : ""} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signatureDateMonitor" className="text-secondary">Date de signature de l'employeur : </label>
                            <input type="text" className="form-control text-center" id="signatureDateMonitor" name="signatureDateMonitor"
                                value={contract.signatureDateMonitor !== "" ? contract.signatureDateMonitor : (currentStatus === Signature.getMonitorSignatureStatus() && contract.monitorSignature !== "") ? getToday() : ""} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signatureAdmin" className="text-secondary">Signature du gestionnaire : </label>
                            <input type="text" className="form-control text-center" id="signatureAdmin" name="signatureAdmin" value={contract.adminSignature !== "" ? contract.adminSignature : ""} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signatureDateAdmin" className="text-secondary">Date de signature du gestionnaire : </label>
                            <input type="text" className="form-control text-center" id="signatureDateAdmin" name="signatureDateAdmin"
                                value={contract.signatureDateAdmin !== "" ? contract.signatureDateAdmin : (currentStatus === Signature.getAdminSignatureStatus() && contract.adminSignature !== "") ? getToday() : ""} readOnly />
                        </div>
                        {internship.status !== undefined && internship.status === currentStatus
                            ?
                            <div className="form-group">
                                <label htmlFor="password" className="text-secondary">Entrez votre mot de passe pour signer : </label>
                                <input type="password" className="form-control text-center" id="password" name="password" disabled={contractState.isDisabled} onChange={setContractStatePassword} />
                            </div>
                            : ""}
                        <div className="d-flex justify-content-center mt-5">
                            {internship.status !== undefined && !contractState.isDisabled && (contractState.signature === null || contractState.signature === "") ?
                                <button type="submit" className="btn btn-block grad text-white">Soumettre</button>
                                : internship.status !== undefined && contractState.isDisabled && contractState.signature !== null && contractState.signature !== "" ?
                                    <strong className="text-success text-center">Contrat signé <i className="fas fa-exclamation-circle text-success fa-sm"></i></strong>
                                    :
                                    <strong className="text-danger text-center">Ce n'est pas à votre tour de signer <i className="fas fa-exclamation-circle text-danger fa-sm"></i></strong>
                            }
                        </div>
                    </div>
                )}
            </form>
        </>
    )
}

export default Contract
