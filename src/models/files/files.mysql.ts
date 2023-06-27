import query from "../../services/mysql";
import {TableIdentifier} from "../../services/types";

export async function getRegisteredItem(path: string, tableIdentifier: TableIdentifier): Promise<{
    cloudID: string | undefined
}> {
    const [results] = await query(`SELECT cloudID
                                   from ${tableIdentifier}
                                   WHERE path = "${path}"`);

    return results;
}
