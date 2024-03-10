import { useEffect } from "react";
import "./index.css";
import { TProject } from "./types";
import { useNavigate } from "react-router-dom";

export function Project({ project }: { project: TProject }) {
    const navigate = useNavigate();

    useEffect(() => {
    })

    const handleAccessProject = (id: string): void => console.log(id);

    const handleEditProject = (id: string): void => navigate(`/edit-project/${id}`);

    return (
        <div className="card container-project">
            
            <div className="card-header header">
                <p>
                    <strong>Projeto: </strong>
                    {project.projectName}
                </p>
                <p>
                    <strong>Status: </strong>
                    {project.completed ? "Completo" : (project.active ? "Em andamento" : "Aprovação pendente")}
                </p>
            </div>

            <div className="body">
                <div className="members">
                    <p className="mt-2"><strong>Integrantes: </strong></p>
                    
                    {project.students.map(student => (
                        <p key={student.studentId}>{student.name}</p>
                    ))}

                    <p className="mt-2"> <strong>Turma: </strong> {project.class}</p>
                </div>

                <div className="">
                    <p className="mt-2"> 
                        <strong>Data de Entrega: </strong>
                        {project.dueDate}
                    </p>
                    <p className="mt-2"> 
                        <strong>Horário: </strong>
                        {project.dueDate}
                    </p>
                    <div className="mt-3 btns">
                        <button className="btn btn-primary" onClick={() => handleAccessProject(project._id)}>
                            Acessar
                        </button>
                        <button className="btn btn-warning" onClick={() => handleEditProject(project._id)}>
                            Editar
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}
