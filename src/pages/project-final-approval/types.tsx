export interface UploadFile {
    id: string;
    extension: string;
}

export interface Comment {
    _id: string;
    user_id: string;
    full_name: string;
    comment: string;
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
    comments: Array<Comment>;
}

