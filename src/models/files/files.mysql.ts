import query from "../../services/mysql";
import {TableIdentifier} from "../../services/types";

export const getRegisteredItem = async (path: string, tableIdentifier: TableIdentifier): Promise<{
    cloudID: string | undefined
}> => {

    console.log(`SELECT cloudID
                 from ${tableIdentifier}
                 WHERE path = "${path}"`)
    const [results] = await query(`SELECT cloudID
                                   from ${tableIdentifier}
                                   WHERE path = "${path}"`);

    return results;
}
