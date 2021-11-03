import React from 'react'
import { useEffect, useState } from 'react'

const Contract = ({ passwordUser, currentStatus, contractProp, signature }) => {
    const [internship, setInternship] = useState(null)
    const [contract, setContract] = useState(null)
    const [contractState, setContractState] = useState({ password: "", userPassword: "", isDisabled: false })
    const baseUrl = "http://localhost:8888"
    const studentSignatureStatus = "StudentSignature"
    const monitorSignatureStatus = "MonitorSignature"
    const adminSignatureStatus = "AdminSignature"
    const completeSignatureStatus = "Completed"
    const signatureStatusList = [studentSignatureStatus, monitorSignatureStatus, adminSignatureStatus, completeSignatureStatus]

    useEffect(() => {
        setInternship(contractProp.internship)
        setContract(contractProp)
        contractState.userPassword = passwordUser
        setContractState({
            ...contractState, isDisabled: currentStatus !== contractProp.internship.status
        })
    }, [])

    const updateContract = async (contract) => {
        const result = await fetch(`${baseUrl}/contract/save-contract`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(contract)
            })
        const data = await result.json()
        setContract(data)
        return data
    }

    // TODO il manque la mise a jours de isStudentSigned, etc.
    // maybe?
    const updateInternship = async () => {
        const result = await fetch(`${baseUrl}/internship/save-internship`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(internship)
            })
        const data = await result.json()
        setInternship(data)
        return data
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (validateInput()) {
            updateContract(contract)
        }
    }

    const validateInput = () => {
        let isValid = false
        if (contractState.password === contractState.userPassword) {
            setContractState({ ...contractState, isDisabled: true })
            if (internship.status === studentSignatureStatus) {
                contract.studentSignature = internship.student.firstName + " " + internship.student.lastName
                contract.signatureDateStudent = getToday()
            } else if (internship.status === monitorSignatureStatus) {
                contract.monitorSignature = internship.offer.monitor.firstName + " " + internship.offer.monitor.lastName
                contract.signatureDateMonitor = getToday()
            }
            updateStatus()
            updateInternship()
            isValid = true
        } else {
            alert("Veuillez entrer votre mot de passe correctement")
        }
        return isValid
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

    const getToday = () => {
        return new Date().toLocaleString("en-CA", { year: "numeric", month: "numeric", day: "numeric" })
    }

    return (
        <>
            <form className="container-fluid" onSubmit={onSubmit} >
                <h1 className="text-center">Contrat</h1>
                {internship && contract && (
                    <div>
                        <div className="form-group">
                            <label htmlFor="adminName" className="text-secondary">Le gestionnaire de stage : </label>
                            {/* TODO: ajouter la condition pour enable le input de admin name 
                                il va falloir aussi rajouter la methode qui permet de SET le nom de l'admin.
                                */}
                            <input type="text" className="form-control text-center" id="adminName" name="adminName" disabled={true} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="monitorName" className="text-secondary"> L'employeur : </label>
                            <input type="text" className="form-control text-center" id="monitorName" name="monitorName"
                                value={internship.offer.monitor.firstName + " " + internship.offer.monitor.lastName} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="studentName" className="text-secondary"> L'étudiant : </label>
                            <input type="text" className="form-control text-center" id="studentName" name="studentName"
                                value={internship.student.firstName + " " + internship.student.lastName} readOnly />
                        </div>
                        <h2 className="text-center mt-5">Conditions de stage suivantes :</h2>
                        <div className="form-group">
                            <label htmlFor="session" className="text-secondary">Session du stage : </label>
                            <input type="text" className="form-control text-center" id="session" name="session" value={internship.session} readOnly />
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
                            <label htmlFor="responsabilityCollege" className="text-secondary">Le Collège s’engage à : </label>
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
                                value={contract.signatureDateStudent !== "" ? contract.signatureDateStudent : (internship.status === studentSignatureStatus && contract.studentSignature !== "") ? getToday() : ""} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signatureMonitor" className="text-secondary">Signature employeur : </label>
                            <input type="text" className="form-control text-center" id="signatureMonitor" name="signatureMonitor" value={contract.monitorSignature !== "" ? contract.monitorSignature : ""} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signatureDateMonitor" className="text-secondary">Date de signature de l'employeur : </label>
                            <input type="text" className="form-control text-center" id="signatureDateMonitor" name="signatureDateMonitor"
                                value={contract.signatureDateMonitor !== "" ? contract.signatureDateMonitor : (internship.status === monitorSignatureStatus && contract.monitorSignature !== "") ? getToday() : ""} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signatureAdmin" className="text-secondary">Signature du gestionnaire : </label>
                            <input type="text" className="form-control text-center" id="signatureAdmin" name="signatureAdmin" readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signatureDateAdmin" className="text-secondary">Date de signature du gestionnaire : </label>
                            <input type="text" className="form-control text-center" id="signatureDateAdmin" name="signatureDateAdmin" readOnly />
                        </div>
                        {internship.status !== undefined && internship.status === currentStatus 
                            ?
                            <div className="form-group">
                                <label htmlFor="password" className="text-secondary">Entrez votre mot de passe : </label>
                                <input type="password" className="form-control text-center" id="password" name="password" disabled={contractState.isDisabled} onChange={setContractStatePassword} />
                            </div>
                            : ""}
                        <div className="d-flex justify-content-center mt-5">
                            {internship.status !== undefined && !contractState.isDisabled && (signature !== null || signature === "") ?
                                <button type="submit" className="btn btn-block grad text-white">Soumettre</button>
                                : internship.status !== undefined && contractState.isDisabled && signature !== null && signature !== "" ?
                                <strong className="text-success text-center">Contrat signée <i className="fas fa-exclamation-circle text-success fa-sm"></i></strong>
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
