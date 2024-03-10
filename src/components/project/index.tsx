import "./index.css";
import { TProject } from "./types";
import { useNavigate } from "react-router-dom";

export function Project({ project }: { project: TProject & {dueDateFormatted: string, dueHourFormatted: string} }) {
    const navigate = useNavigate();

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
                    
                    {project.advisor &&
                        <p key={project.advisor._id}>{project.advisor.full_name} (Orientador)</p>
                    }
                    
                    {project.students.map(student => (
                        <p key={student._id}>{student.full_name} (Aluno)</p>
                    ))}

                    <p className="mt-2"> <strong>Turma: </strong> {project.class}</p>
                </div>

                <div className="">
                    <p className="mt-2"> 
                        <strong>Data de Entrega: </strong>
                        {project.dueDateFormatted}
                    </p>
                    <p className="mt-2"> 
                        <strong>Horário: </strong>
                        {project.dueHourFormatted}
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
