import Store from "electron-store";
import {NodeLog} from './NodeLog'
import {EventEmitter} from "events";
import {UserManager} from "../user/UserManager";
import {ServerEvents} from "../../events";

interface INodeLogger {
    logs: NodeLog[],
    date: string
}

export class NodeLogger {
    store: Store<INodeLogger>
    nodeEmitter: EventEmitter;

    constructor() {
        this.store = new Store<INodeLogger>({
            defaults: {
                logs: [],
                date: new Date().toISOString().slice(0, 19)
            }
        })
        this.deleteOldLogs();

        this.nodeEmitter = UserManager.getInstance().nodesManager.getNodesEmitter();
        this.nodeEmitter.on(ServerEvents.getLogs, this.getDayLogs)
    }

    /**
     *  App deletes every node log older than the current day
     */

    deleteOldLogs = () => {
        const allLogs = this.store.get('logs');
        const today = new Date().toISOString().slice(0, 10);

        const filteredLogs = allLogs.filter(log => {
            return log.date.slice(0, 10) === today
        });

        this.store.set('logs', filteredLogs);
    }
    getDayLogs = () => {
        this.nodeEmitter.emit(ServerEvents.sendLogs, this.store.get('logs'))
    }

    setStore(logs: NodeLog[]): void {
        this.store.set('logs', logs);
    }


    createLog(log: NodeLog): void {
        const storedLogs = this.store.get('logs');

        storedLogs.push(log);
        this.setStore(storedLogs);
        this.nodeEmitter.emit(ServerEvents.sendNodeChange, log);
    }
}