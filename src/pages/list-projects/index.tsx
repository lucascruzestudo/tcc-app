import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "src/hooks/authContextProvider";
import ProjectsService from "src/services/projects";
import { Project } from "../../components/project";
import { TProject } from "../../components/project/types";
import "./index.css";


export function ListProjects() {
  const projectsService = new ProjectsService();
  const userLocalStorage = useAuth().user!
  
  const [projects, setProjects] = useState<TProject[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    onInit();
  }, []);

  const onInit = async () => {
    const response = await projectsService.getProjects<Array<TProject>>();
    
    if (response.status !== 200) return;

    setProjects(
      response.data.map((p, index) => ({
        ...p,
        projecId: String((index + 1)),
        class: "ADS NOITE",
        dueDate: p.dueDate ? (new Date(p.dueDate)).toISOString() : '-',
        startDate: p.startDate ? (new Date(p.startDate)).toISOString() : '-',
      }))
    );
    
  }

  const handleNavigate = (path: string) => navigate(path);

  return (
    <div className="container-projects mb-5">
      <div className="new-project"></div>

      <div className="list-projects">
        {projects.map((project) => (
          <Project project={project} userRole={userLocalStorage.role} key={project._id} />
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
