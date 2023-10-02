export interface NodeLog {
    name: string,
    path: string,
    date: string,
    operation: 'ADD' | 'UPDATE'| 'DELETE',
}