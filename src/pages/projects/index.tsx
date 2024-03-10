import "./index.css";
import { useEffect, useState } from "react";
import { Project } from "../../components/project";
import { TProject } from "../../components/project/types";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import ProjectsService from "src/services/projects";


export function Projects() {
  const projectsService = new ProjectsService();
  
  const [projects, setProjects] = useState<TProject[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    onInit();
  }, []);

  const onInit = async () => {
    const response = await projectsService.getProjects<{
      projects: Array<TProject>
    }>();
    
    if (response.status !== 200) return;

    setProjects(response.data.projects.map((p, index) => ({
      ...p,
      projecId: String((index + 1)),
      description: "description",

      class: "ADS NOITE",
      dueDate: p.dueDate ? (new Date(p.dueDate)).toISOString() : '-',
      startDate: p.startDate ? (new Date(p.startDate)).toISOString() : '-',
      students: p.students.map((s, index) => ({
        studentId: s.studentId,
        name: (`Fulando ${index + 1}`),
        email: `fulando.${s.studentId}.com.br`,
      }))
    })));
  }

  const handleNavigate = (path: string) => navigate(path);

  return (
    <div className="container-projects">
      <div className="new-project"></div>

      <div className="list-projects">
        {projects.map((project) => (
          <Project project={project} key={project._id} />
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
