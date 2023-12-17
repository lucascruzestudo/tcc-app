export type TMember = {
    id: string;
    name: string;
};

export type TProject = {
    id: string;
    name: string;
    members: TMember[];
    class: string;
    created_at: string; // Data Formato ISO
    completion_at: string; // Data Formato ISO
    status: "Ativo" | "Inativo";
};