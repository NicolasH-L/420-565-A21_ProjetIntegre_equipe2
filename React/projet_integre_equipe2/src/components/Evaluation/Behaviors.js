import React from 'react'
import { useEffect } from 'react'
import Evaluations from '../Constants/Evaluations'
import EvaluationBehavior from './EvaluationBehavior'

const Behaviors = ({ behaviors, setBehaviors, submitState }) => {

    useEffect(() => {
        setBehaviors(Evaluations.behaviors())
        // console.log(Evaluations.behaviors())
    }, [])

    const displayBehaviors = () => {
        return (
            <>
                {behaviors.map(behavior => (
                    <div key={behavior.header}>
                        <EvaluationBehavior newBehavior={behavior} submitState={submitState}/>
                    </div>
                ))}
            </>
        )
    }

    return (
        <div className="form-group">
            {behaviors !== null ?
                displayBehaviors()
                : ""}
        </div>
    )
}

export default Behaviors
