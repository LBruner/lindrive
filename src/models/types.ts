export interface File {
    name: string;
    size: number;
    extension: string;
    path: string;
    modified?: string;
    parent_folder?: string,
    cloud_id?: string
}

export interface Folder{
    name: string;
    path: string;
    cloud_id?: string,
    filesLocation?: Array<string>
    filesDetails?: Array<File>
}