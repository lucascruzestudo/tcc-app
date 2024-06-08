import { getProjectStatus } from "@utils/project-functions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProjectsService from "src/services/projects";
import "./index.css";
import { TProject } from "./types";

export function Project({ project, userRole }: { project: TProject, userRole: number }) {
    const navigate = useNavigate();
    const expectedCompletion = new Date(project.expectedCompletion);
    const projectsService = new ProjectsService();
    
    const [_project, _setProject] = useState<TProject>(project);
    
    const handleAccessProject = (id: string): void => navigate(`/project-progress/${id}`);
    const handleEditProject = (id: string): void => navigate(`/edit-project/${id}`);

    const getStatus = () => getProjectStatus(_project);

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

    async function handleApproveProject (approve: boolean) {
        const response = await projectsService.approvalProject(project._id, { approve });

        if (response.status !== 200) {
            toast(response.msg || "Opss. Não foi possivel concluir a operação!", { type: "error" });  
            return;
        }
        
        _setProject({..._project, creationApproved: approve})
    }

    function getColorCardByProjectStatus() {
        if (_project.completed) return 'card-approved'
        else if (_project.creationApproved) return 'card-blue'
        else return 'card-yellow'
    }
    
    return (
        <div className={`card container-project ${getColorCardByProjectStatus()}`}>
            
            <div className="header">
                <p>
                    <strong>Projeto: </strong>
                    {_project.projectName}
                </p>
                <p>
                    <strong>Status: </strong>
                    {getStatus()}
                </p>
                {userRole === 1 && 
                    <div className="form-check form-switch">
                        <input disabled={project.completed} onChange={(e) => handleApproveProject(e.target.checked)} 
                            className="form-check-input" 
                            type="checkbox" 
                            id="flexSwitchCheckApproveTCC"
                            checked={_project.creationApproved}
                        />
                        <label className="form-check-label" htmlFor="flexSwitchCheckApproveTCC">
                            {_project.creationApproved ? 'Reprovar' : 'Aprovar'} Ideia
                        </label>
                    </div>
                }
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
                        <button className="btn btn-primary" disabled={!_project.creationApproved} onClick={() => handleAccessProject(project._id)}>
                            Acessar
                        </button>
                        <button disabled={_project.completed} className="btn btn-warning" onClick={() => handleEditProject(project._id)}>
                            Editar
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}
