import { TProject } from "@components/project/types"

export const getProjectStatus = (_project: TProject) => {
    if (_project.completed) return "Completo"
    else if(!_project.creationApproved) return "Aprovação pendente"
    else if (_project.active) return "Em andamento"
    else return "Pausado"
}