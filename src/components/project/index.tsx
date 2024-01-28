import { useEffect } from "react";
import "./index.css";
import { TProject } from "./types";

export function Project({ project }: { project: TProject }) {

    useEffect(() => {})

    function handleAccessProject(id: string): void {
        console.log(id);
    }

    return (
        <div className="card container-project">
            
            <div className="card-header header">
                <p>
                    <strong>Projeto: </strong>
                    {project.name}
                </p>
                <p>
                    <strong>Status: </strong>
                    {project.status}
                </p>
            </div>

            <div className="body">
                <div className="members">
                    <p className="mt-2"><strong>Integrantes: </strong></p>
                    
                    {project.members.map(member => (
                        <p key={member.id}>{member.name}</p>
                    ))}

                    <p className="mt-2"> <strong>Turma: </strong> {project.class}</p>
                </div>

                <div className="">
                    <p className="mt-2"> 
                        <strong>Data de Entrega: </strong>
                        {project.completion_at}
                    </p>
                    <p className="mt-2"> 
                        <strong>Horário: </strong>
                        {project.completion_at}
                    </p>
                    <button className="btn btn-primary mt-3" onClick={() => handleAccessProject("f7d4e510-783c-4a5c-8c7f-1423dfe91bcf")}>Acessar</button>
                </div>
            </div>

        </div>
    )
}
