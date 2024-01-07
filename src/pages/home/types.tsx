export interface UploadFile {
    id: number;
    extension: string;
    send: boolean;
}

export interface Comments {
    message: string;
    from: string;
    date: string;
}

export interface StepData {
    step: number;
    label: string;
    status: string;
    start_date: string;
    end_date: string;
    description: string;
    upload_files: Array<UploadFile>;
    comments: Array<Comments>;
}
