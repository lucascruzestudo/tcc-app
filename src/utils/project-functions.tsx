import { TProject } from "@components/project/types"

export const getProjectStatus = (_project: TProject) => {
    if (_project.completed) return "Completo"
    else if(!_project.creationApproved) return "Aprovação pendente"
    else if (_project.active) return "Em andamento"
    else return "Pausado"
}

export const formatFileName = (fileName: string, maxLength: number) => {
    if (!(typeof fileName === 'string')) return ''
    
    if (fileName.length <= maxLength) {
        return fileName;
    } else {
        const extension = fileName.split('.').pop() || '';
        const fileNameWithoutExtension = fileName.slice(0, - (extension.length + 1));
        const truncatedFileName = fileNameWithoutExtension.slice(0, maxLength - 3);
        return truncatedFileName + '...' + extension;
    }
}