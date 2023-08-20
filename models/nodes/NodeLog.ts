export interface NodeLog {
    name: string,
    path: string,
    operation: 'ADD' | 'UPDATE'| 'DELETE',
    type: 'FOLDER' | 'FILE'
}