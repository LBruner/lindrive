export interface File {
    name: string;
    size: number;
    extension: string;
    path?: string;
    modified?: Date;
    parent_folder?: string
}

export interface Folder{
    name: string;
    path: string;
    parent_folder?: string | null
    filesLocation?: Array<string>
    filesDetails?: Array<File>
}