import './index.css'
import { useState } from "react";

const steps = [
    { id: 1, label: "Primeira etapa" },
    { id: 2, label: "Segunda etapa" },
    { id: 3, label: "Terceira etapa" },
    { id: 4, label: "Quarta etapa" },
]

export function Home() {
    const [currentStep, setCurrentStep] = useState(1);

    const nextStep = (step_id: number) => {
        if (step_id > 0 && step_id <= steps.length) setCurrentStep(step_id);
    };

    return (
        <div className="container-home">
            <div className="menu-step">
                {steps.map(({ id, label }) => (
                    <div key={`step-${id}`}>
                        <button onClick={() => nextStep(id)}>{label}</button>
                    </div>
                ))}
            </div>

            <form className='form'>
                <h6>Stepa: {(steps.find(step => step.id === currentStep))?.id}</h6>
                <label htmlFor="comment">Comentário:</label>
                <textarea id="comment" name="comment" />

                <button type="button" onClick={() => { }}>
                    Enviar
                </button>
            </form>
        </div>
    )
}