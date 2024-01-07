import './index.css'
import { useEffect, useState } from "react";
import stepsJson from "./steps.json";
import { StepData, UploadFile } from "./types"
import { FaFileUpload } from "react-icons/fa";
import { FcCheckmark } from "react-icons/fc";

const project = { id: "uuid", currentStep: 3,}

export function Home() {
    const [currentStep, setCurrentStep] = useState<StepData | null>(null);
    const [steps, setSteps] = useState<StepData[]>([]);
    const [endDate, setEndDate] = useState<string>('');
    
    useEffect(() => {
        // Mock
        setSteps(stepsJson);

        const step = stepsJson.find(step => step.step === project.currentStep) ?? null

        if (!step) return

        changeStep(step);
    },[])

    const nextStep = (step_id: number) => {
        const _step = steps.find(step => step.step === step_id) ?? null
        if (!_step || _step.step > project.currentStep) return

        changeStep(_step);
    };

    const changeStep = (step: StepData) => {
        setCurrentStep(step);

        const date = new Date(step.end_date);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        setEndDate(`${day}/${month}/${year}`);
    }

    const handleUploadFile = (event: any, _file: UploadFile) => {
        if(event.cancelable) return;
        
        const file = event.target.files[0];

        if (file.size > 100000) {
            throw new Error(`Very large file. ${file.size}/${100000}`);
        }

        const extensionMap: Record<string, string> = {
            "pdf": "application/pdf",
            "txt": "text/plan"
        }

        if (file.type !== extensionMap[_file.extension]) {
            throw new Error(`Extension ${file.type} not supported - expected: ${_file.extension}`);
        }

        console.log("send file", file)
    }

    const handleSubmitCommets = () => {
        console.log("Send");
    }

    return (
        <div className="container-home">
            <div className='steps'>
                <nav className="menu-step">
                    {steps.map(({ step, label }) => (
                        <div key={`step-${step}`}>
                            <button onClick={() => nextStep(step)}>{label}</button>
                        </div>
                    ))}
                </nav>
                
                {currentStep && (
                    <>
                        <section className='header'>
                            <div>
                                <span>Etapa: {currentStep.step} -
                                    {currentStep.step === project.currentStep ? ' Em andamento' : ' Concluido'} 
                                </span>
                                
                                <div className='description'>
                                    <strong>Descrição da etapa: </strong>
                                    <small>{currentStep.description}</small>
                                </div>
                            </div>
            
                            <div>
                                <span>Data de entrega:</span>
                                <div className='project-end-date'>{endDate}</div>
                            </div>

                        </section>

                        <p className='title-upload-files'><FaFileUpload /> Faça upload dos seus documentos aqui:</p>

                        <section className='upload-files'>
                            <div className='files'>
                                {currentStep.upload_files.map((file) => (
                                    <div key={file.id} className='file'>
                                        <label htmlFor={`file-${file.id}`}>Enviar arquivo .{file.extension}</label>
                                        <input 
                                            type="file" 
                                            name={`file-${file.id}`}
                                            id={`file-${file.id}`}
                                            accept={`.${file.extension}`}
                                            onChange={(event => handleUploadFile(event, file))}
                                        ></input>
                                        {file.send ? <FcCheckmark /> : <></>} 
                                    </div>
                                ))}
                            </div>

                            <div>
                                <span>Status: </span> <br />
                                <p>{currentStep.status}</p>
                            </div>
                        </section>
            
                        <section className='comments-form'>
                            <h3>Comentários:</h3>
                            
                            <textarea id="comment" name="comment" rows={5} cols={63}>
                                It was a dark and stormy night...
                            </textarea>
                            
                            <button type="button" onClick={handleSubmitCommets}>Enviar</button>

                        </section>
                    </>    
                )}
            </div>
        </div>
    )
}