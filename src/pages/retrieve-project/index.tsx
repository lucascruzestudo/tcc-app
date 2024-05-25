import { TProject } from "@components/project/types";
import { Spinner } from "@components/spinner";
import { validEmail } from "@utils/validators";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "src/hooks/authContextProvider";
import ProjectsService from "src/services/projects";
import "./index.css";

type Student = {
  email: string;
};

export function RetrieveProject() {
  const projectsService = new ProjectsService()
  const { projectId } = useParams();
  const userLocalStorage = useAuth().user!
  const [project, setProject] = useState<TProject>();
  const [canEdit, setCanEdit] = useState<boolean>();
  
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [expectedCompletion, setExpectedCompletion] = useState<string | undefined>();
  const [students, setStudents] = useState<Map<string, Student>>(new Map([]));
  const [studentsIds, setStudentsIds] = useState<string[]>([]);
  const [advisorEmail, setAdvisorEmail] = useState<string>('');
  const [coordinatorEmail, setCoordinatorEmail] = useState<string>('');
  const [approve, setApprove] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false);

  useEffect(() => {
    onInit();
  }, []);

  function formatDate(date: any) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } 
  
  const generateRandomId = () => {
    return Math.random().toString(36).slice(2, 11);
  };

  async function onInit() {
    setloading(true);

    if (projectId) {
      const response = await projectsService.getProject<TProject>(projectId)

      if (response.status !== 200) return

      setProject(response.data);

      setCanEdit(!response.data.creationApproved || userLocalStorage.role === 1);
      
      setName(response.data.projectName);
      setDescription(response.data.description);
      setExpectedCompletion(formatDate(new Date(response.data.expectedCompletion)));
      setApprove(response.data.creationApproved);

      if (response.data.advisor) {
        setAdvisorEmail(response.data.advisor.email);
      }
      
      if (response.data.coordinator) {
        setCoordinatorEmail(response.data.coordinator.email);
      }

      const updatedStudents = new Map();
      const updatedStudentsIds: Array<string> = [];

      response.data.students.forEach(s => {
        updatedStudents.set(s._id, { 
          _id: s._id, email: s.email,
        });
        
        updatedStudentsIds.push(s._id);
      });

      setStudents(updatedStudents);
      setStudentsIds(updatedStudentsIds);
    } else {
      setCanEdit(true);
      const updatedStudents = new Map();
      
      const id = generateRandomId();
      updatedStudents.set(userLocalStorage.id, { 
        _id: userLocalStorage.id, email: userLocalStorage.email
      });
  
      setStudents(updatedStudents);
      setStudentsIds([id]);
    }

    setloading(false);
  }

  const handleEmailChange = (id: string, email: string) => {
    setStudents((prevStudents) => {
      const updatedStudents = new Map(prevStudents);
      const student = updatedStudents.get(id);
      if (student) {
        updatedStudents.set(id, { ...student, email });
      }
      return updatedStudents;
    });
  };

  const addStudent = () => {
    if (studentsIds.length > 4) {
      toast("Limite de membros", { type: "error" });
      return;
    }

    const id = generateRandomId();

    setStudents((prevStudents) => {
      const updatedStudents = new Map(prevStudents);
      updatedStudents.set(id, { email: "" });
      return updatedStudents;
    });
    setStudentsIds((prevIds) => [...prevIds, id]);
  };

  const removeStudent = (id: string) => {
    if (studentsIds.length < 1) return;

    setStudents((prevStudents) => {
      const updatedStudents = new Map(prevStudents);
      updatedStudents.delete(id);
      return updatedStudents;
    });

    setStudentsIds((prevIds) => prevIds.filter((studentId) => studentId !== id));
  };

  const handleSubmit = async () => {
    if (name.trim().length === 0) {
      toast("O campo nome é obrigatório.", { type: "error" });
      return;
    }
    if (!expectedCompletion || expectedCompletion.trim().length === 0) {
      toast("A data de finalização é obrigatório.", { type: "error" });
      return;
    }
    if (description.trim().length === 0) {
      toast("O campo descrição é obrigatório.", { type: "error" });
      return;
    }

    if (!validEmail(coordinatorEmail)) {
      toast("E-mail do Coordenador inválido.", { type: "error" });
      return;
    }

    const formattedDate = format(
      new Date(expectedCompletion),
      "yyyy-MM-dd'T'HH:mm:ssXXX"
    );
    
    const bory = {
      projectName: name,
      description,
      expectedCompletion: formattedDate,
      advisorEmail,
      coordinatorEmail,
      studentEmails: Array.from(students).map((student) => student[1].email)
    }

    if (projectId) {
      const response = await projectsService.updateProject(projectId, bory);
      
      if (response.status !== 200) {
        // @ts-ignore
        toast(response.data.msg_pt_br, { type: "error" });  
        return;
      }

      toast("Projeto Atualizado com sucesso!", { type: "success" });

    } else {
      const response = await projectsService.createProject(bory);
      
      if (response.status !== 201) {
        // @ts-ignore
        toast(response.data.msg_pt_br, { type: "error" });  
        return;
      }
      
      toast("Projeto criado com sucesso!", { type: "success" });
      window.location.href = '/projects'
    }

  };

  async function handleApproveProject (_approve: boolean) {
    if (!projectId) return

    const response = await projectsService.approvalProject(projectId, { approve: _approve });

    if (response.status !== 200) {
        toast("Opss. Não foi possivel concluir a operação!", { type: "error" });  
        return;
    }

    setApprove(_approve);
}

  return (
    <>
      <Spinner loading={loading} />

      <div hidden={loading} className="container-new-project">
        <div className={`row m-0 p-0 ${canEdit ? '' : 'disable-interaction'}`} >
          {userLocalStorage.role === 1 && projectId &&
            <div className="row form-group m-0">
              <div className="offset-8 col-4 mt-2 form-check form-switch">
                <input onChange={(e) => handleApproveProject(e.target.checked)} 
                    className="form-check-input" 
                    type="checkbox" 
                    id="flexSwitchCheckApproveTCC"
                    checked={approve}
                />
                <label className="form-check-label" htmlFor="flexSwitchCheckApproveTCC">
                  {approve ? 'Reprovar' : 'Aprovar'} Ideia
                </label>
              </div>
            </div>
          }

          <div className="row form-group mt-3">
            <div className="col-7">
              <input
                type="email"
                className="form-control"
                id="name"
                placeholder="Nome do projeto"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-5">
              <input
                type="datetime-local"
                className="form-control"
                id="name"
                placeholder="Data de finalização"
                value={expectedCompletion || ""}
                onChange={(e) => setExpectedCompletion(e.target.value)}
              />
            </div>
          </div>

          <div className="row form-group mt-3">
            <div className="col">
              <textarea
                className="form-control"
                id="description"
                placeholder="Descrição do projeto"
                value={description}
                style={{ height: `${Math.max(3, description.length / 30)}em` }}
                maxLength={500}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="row">
            <label className="col-8 mb-1 mt-4" htmlFor={`email`}>
              E-mail:
            </label>

            <label className="col-4 mb-1 mt-4" htmlFor={`select-profile`}>
              Perfil:
            </label>
          </div>

          <div className="row mt-4">
              <div className="col-8">
                <input
                  type="email"
                  className="form-control"
                  placeholder="E-mail"
                  value={coordinatorEmail}
                  onChange={(e) => setCoordinatorEmail(e.target.value)}
                />
              </div>

              <div className="form-group col-3">
                <span>Coordenador</span>
              </div>
          </div>

          <div className="row mt-4">
              <div className="col-8">
                <input
                  type="email"
                  className="form-control"
                  placeholder="E-mail"
                  value={advisorEmail}
                  onChange={(e) => setAdvisorEmail(e.target.value)}
                />
              </div>

              <div className="form-group col-3">
                <span>Orientador</span>
              </div>
          </div>

          {Array.from(students).map(([id, student], index) => (
            <div className="row mt-4" key={id}>
              <div className="col-8">
                <input
                  type="email"
                  className="form-control"
                  placeholder="E-mail"
                  value={student.email}
                  onChange={(e) => handleEmailChange(id, e.target.value)}
                />
              </div>

              <div className="form-group col-3">
                <span>Aluno</span>
              </div>

              {index > 0 && (
                <div className="col-1 d-flex flex-column justify-content-end align-items-center">
                  <button
                    className="btn btn-danger"
                    onClick={() => removeStudent(id)}
                  >
                    <IoTrashOutline />
                  </button>
                </div>
              )}
            </div>
          ))}

          {studentsIds.length < 4 && (
            <div className="row">
              <div className="mt-4 offset-11 col-1 d-flex flex-column justify-content-end align-items-center">
                <button className="btn btn-primary" onClick={addStudent}>
                  <FaPlus />
                </button>
              </div>
            </div>
          )}

          <div className="row mt-5">
            <button
              className="offset-10 col-2 btn btn-primary p-2"
              onClick={handleSubmit}
            >
            {projectId ? "Atualizar" : "Criar"}
            </button>
          </div>

          {!canEdit && 
            <div className="text-center mt-5 text-danger">
              <p>Você não pode atualizar esse projeto após aprovação!</p>
            </div>
          }
        </div>
      </div>
    </>
  );
}
