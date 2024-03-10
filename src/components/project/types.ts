export type TMember = {
    _id: string;
    email: string;
    full_name: string;
};

export type TProject = {
    _id: string;
    projectName: string;
    startDate: string; // Data Formato ISO
    dueDate: string; // Data Formato ISO
    description: string;
    currentStage: number;    
    active: boolean;
    completed: boolean;
    class: string;
    advisor: TMember;

    students: TMember[];
};