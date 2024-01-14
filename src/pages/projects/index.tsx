import { useEffect, useState } from "react";
import { Project } from "../../components/project";
import "./index.css";
import { TProject } from "../../components/project/types";
import projectsMock from "./mock.json";

export function Projects() {
    const [projects, setProjects] = useState<TProject[]>([]);

    useEffect(() => {
        setProjects(projectsMock as TProject[]);
    }, [])

    return (
        <div className="container-projects">
            {/* <div className="projects-list"> */}
                {projects.map(project => (
                    <Project project={project} key={project.id} />
                ))}
            {/* </div> */}
        </div>
    )
}