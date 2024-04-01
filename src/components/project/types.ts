export type TMember = {
    _id: string;
    email: string;
    full_name: string;
};

export type TFile = {
    id: number;
    extension: string;
    send: boolean;
    path: string;
}

export type TStages = {
    active: boolean;
    attachments: Array<TFile>;
    comments: [];
    completed: boolean;
    description: string;
    dueDate: string;
    expectedCompletion: string;
    stageId: number;
    stageName: string;
    startDate: string;
}

export type TProject = {
    _id: string;
    projectName: string;
    startDate: string; // Data Formato ISO
    dueDate: string; // Data Formato ISO
    expectedCompletion: string; // Data Formato ISO
    description: string;
    currentStage: number;    
    active: boolean;
    completed: boolean;
    class: string;
    advisor: TMember;
    coordinator: TMember;
    creationApproved: boolean;
    stages: Array<TStages>

    students: TMember[];
};