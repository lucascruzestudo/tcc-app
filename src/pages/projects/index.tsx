import "./index.css";
import { useEffect, useState } from "react";
import { Project } from "../../components/project";
import { TProject } from "../../components/project/types";
import projectsMock from "./mock.json";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


export function Projects() {
  const [projects, setProjects] = useState<TProject[]>([]);
  const [showModalNewProject, setShowModalNewProject] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setProjects(projectsMock as TProject[]);
  }, []);

  const handleNavigate = (path: string) => navigate(path);

  return (
    <div className="container-projects">
      <div className="new-project"></div>

      <div className="list-projects">
        {projects.map((project) => (
          <Project project={project} key={project.id} />
        ))}
      </div>

      <button
        onClick={() => handleNavigate('/new-project')}
        title="Iniciar novo projeto"
        className="btn-new-project btn btn-primary"
      >
        <FaPlus /> Novo projeto
      </button>
    </div>
  );
}
