export type TMember = {
    studentId: string;
    email: string;
    name: string;
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

    students: TMember[];
};