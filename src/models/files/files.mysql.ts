import query from "../../services/mysql";

export const getFolderID = async (folderPath: string) => {
    const result = await query(`SELECT cloudID
                                FROM folders
                                WHERE path = "${folderPath}"`);
    if (result.length > 0) {
        console.log(`Folder: ${folderPath} already exists with cloudID: ${result[0].cloudID}\n`);
        return result[0].cloudID;
    }
    return null;
};


