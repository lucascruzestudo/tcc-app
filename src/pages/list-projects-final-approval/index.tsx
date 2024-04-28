import { ProjectFinalApproval, Spinner } from "@components/index";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/hooks/authContextProvider";
import ProjectsService from "src/services/projects";
import { TProject } from "../../components/project/types";
import "./index.css";


export function ListProjectsFinalApproval() {
  const projectsService = new ProjectsService();
  const navigate = useNavigate();
  const userLocalStorage = useAuth().user!
  
  const [projects, setProjects] = useState<TProject[]>([]);
  const [loading, setloading] = useState<boolean>(false);

  useEffect(() => {
    if (userLocalStorage.role === 3) {
      navigate('/not-found');
    } else {
      onInit();
    }
  }, []);

  const onInit = async () => {
    setloading(true);

    const response = await projectsService.getProjects<Array<TProject>>({
      include_final_stage: true, pending_final_approval: true
    });
    
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

    setloading(false);    
  }

  return (
    <div className="container-projects mb-5">
      <Spinner loading={loading} />

      <div className="list-projects-final">
        {projects.map((project) => (
          <ProjectFinalApproval project={project} key={project._id} />
        ))}
      </div>
    </div>
  );
}
