import chokidar from 'chokidar';

export class ApiWatcher {
    private readonly watcher: chokidar.FSWatcher;

    constructor(public path: string, watcherConfig:  chokidar.WatchOptions) {
        this.watcher = chokidar.watch(path, watcherConfig);
    }

    onAddFolder = (callback: (nodePath: string) => void): void => {
        this.watcher.on('addDir', callback);
    };

    onAddFile = (callback: (nodePath: string) => void): void => {
        this.watcher.on('add', callback);
    };

    onFileUpdate = (callback: (eventName: string) => void): void => {
        this.watcher.on('change', callback);
    }

    onFileDelete = (callback: (eventName: string) => void): void => {
        this.watcher.on('unlink', callback);
    }

    onFolderDelete = (callback: (eventName: string) => void): void => {
        this.watcher.on('unlinkDir', callback);
    }
}