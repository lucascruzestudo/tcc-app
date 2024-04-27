import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { TProject } from "./types";

export function ProjectFinalApproval({ project }: { project: TProject }) {
    const navigate = useNavigate();
    const expectedCompletion = new Date(project.expectedCompletion);
    
    const [_project, _setProject] = useState<TProject>(project);
    
    const handleAccessProject = (id: string): void => navigate(`/project-progress/${id}`);
    
    function getDate() {
        const year = expectedCompletion.getFullYear();
        const month = expectedCompletion.getMonth() + 1;
        const day = expectedCompletion.getDate();
        return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`
    }

    function getHour() {
        const hours = expectedCompletion.getHours();
        const minutes = expectedCompletion.getMinutes();
    
        return `${hours < 10 ? '0' + hours : hours}:${ minutes < 10 ? '0' + minutes : minutes}`
    }

    
    return (
        <div className="card container-project-final">
            
            <div className="header">
                <p>
                    <strong>Projeto: </strong>
                    {_project.projectName}
                </p>
                <p>
                    <strong>Status: Aguardando aprovação.</strong>
                </p>
            </div>

            <hr className="p-0 m-0 mt-1 mb-3"/>

            <p className="description">
                <strong>Descrição: </strong>
                {_project.description}
            </p>

            <div className="body">

                <div className="members">
                    <p className="mt-2"><strong>Integrantes: </strong></p>
                    
                    {_project.advisor &&
                        <p key={_project.advisor._id}>{_project.advisor.full_name} (Orientador)</p>
                    }
                    
                    {_project.students.map(student => (
                        <p key={student._id}>{student.full_name} (Aluno)</p>
                    ))}

                    <p className="mt-2"> <strong>Turma: </strong> {_project.class}</p>
                </div>

                <div className="">
                    <p className="mt-2"> 
                        <strong>Data de Entrega: </strong>
                        {getDate()}
                    </p>
                    <p className="mt-2"> 
                        <strong>Horário: </strong>
                        {getHour()}
                    </p>
                    <div className="mt-3 btns">
                        <button className="btn btn-primary" disabled={!project.creationApproved} onClick={() => handleAccessProject(project._id)}>
                            Analisar
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}
