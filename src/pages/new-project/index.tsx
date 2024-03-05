import "./index.css";
import { useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ProjectsService from "src/services/projects";

type Member = {
  email: string;
  profile: number;
};

export function NewProject() {
  const projectsService = new ProjectsService()

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [completion_at, setCompletion_at] = useState<string | undefined>();
  const [members, setMembers] = useState<Map<string, Member>>(new Map([]));
  const [membersIds, setMembersIds] = useState<string[]>([]);

  const generateRandomId = () => {
    return Math.random().toString(36).slice(2, 11);
  };

  useEffect(() => {
    const updatedMembers = new Map();

    const id = generateRandomId();
    updatedMembers.set(id, { email: "", profile: 2 });

    setMembers(updatedMembers);
    setMembersIds([id]);
  }, []);

  const handleEmailChange = (id: string, email: string) => {
    setMembers((prevMembers) => {
      const updatedMembers = new Map(prevMembers);
      const member = updatedMembers.get(id);
      if (member) {
        updatedMembers.set(id, { ...member, email });
      }
      return updatedMembers;
    });
  };

  const handleProfileChange = (id: string, profile: number) => {
    setMembers((prevMembers) => {
      const updatedMembers = new Map(prevMembers);
      const member = updatedMembers.get(id);
      if (member) {
        updatedMembers.set(id, { ...member, profile });
      }
      return updatedMembers;
    });
  };

  const addMember = () => {
    if (membersIds.length > 5) {
      toast("Limite de membros", { type: "error" });
      return;
    }

    const id = generateRandomId();

    setMembers((prevMembers) => {
      const updatedMembers = new Map(prevMembers);
      updatedMembers.set(id, { email: "", profile: 1 });
      return updatedMembers;
    });
    setMembersIds((prevIds) => [...prevIds, id]);
  };

  const removeMember = (id: string) => {
    if (membersIds.length < 2) return;

    setMembers((prevMembers) => {
      const updatedMembers = new Map(prevMembers);
      updatedMembers.delete(id);
      return updatedMembers;
    });

    setMembersIds((prevIds) => prevIds.filter((memberId) => memberId !== id));
  };

  const handleSubmit = async () => {
    if (name.trim().length === 0) {
      toast("O campo nome é obrigatório.", { type: "error" });
      return;
    }
    if (!completion_at || completion_at.trim().length === 0) {
      toast("A data de finalização é obrigatório.", { type: "error" });
      return;
    }
    if (description.trim().length === 0) {
      toast("O campo descrição é obrigatório.", { type: "error" });
      return;
    }

    const formattedDate = format(
      new Date(completion_at),
      "yyyy-MM-dd'T'HH:mm:ssXXX"
    );

    const body = {
      projectName: name,
      description,
      completion_at: formattedDate,
      studentEmails: Array.from(members).map((member) => member[1].email),
    };

    const response = await projectsService.createProject(body);
    console.log(response);
  };

  return (
    <div className="container-new-project">
      <div className="row m-0 p-0">
        <div className="row form-group mt-3">
          <div className="col-8">
            <input
              type="email"
              className="form-control"
              id="name"
              placeholder="Nome do projeto"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-4">
            <input
              type="datetime-local"
              className="form-control"
              id="name"
              placeholder="Data de finalização"
              value={completion_at || ""}
              onChange={(e) => setCompletion_at(e.target.value)}
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
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="row">
          <label className="col-7 mb-1 mt-4" htmlFor={`email`}>
            E-mail:
          </label>

          <label className="col-5 mb-1 mt-4" htmlFor={`select-profile`}>
            Selecione um Perfil:
          </label>
        </div>

        {Array.from(members).map(([id, member], index) => (
          <div className="row mt-4" key={id}>
            <div className="col-7">
              <input
                type="email"
                className="form-control"
                placeholder="E-mail"
                value={member.email}
                onChange={(e) => handleEmailChange(id, e.target.value)}
              />
            </div>

            <div className="form-group col-4">
              <select
                className="form-control"
                id={`select-profile-${id}`}
                value={member.profile}
                onChange={(e) =>
                  handleProfileChange(id, parseInt(e.target.value))
                }
              >
                <option value={3}>Aluno</option>
                <option value={2}>Orientador</option>
                <option value={1}>Administrador</option>
              </select>
            </div>

            {index > 0 && (
              <div className="col-1 d-flex flex-column justify-content-end align-items-center">
                <button
                  className="btn btn-danger"
                  onClick={() => removeMember(id)}
                >
                  <IoTrashOutline />
                </button>
              </div>
            )}
          </div>
        ))}

        {membersIds.length < 6 && (
          <div className="row">
            <div className="mt-4 offset-11 col-1 d-flex flex-column justify-content-end align-items-center">
              <button className="btn btn-primary" onClick={addMember}>
                <FaPlus />
              </button>
            </div>
          </div>
        )}

        <div className="row mt-5">
          <button
            className="offset-10 col-2 btn btn-primary"
            onClick={handleSubmit}
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
}
