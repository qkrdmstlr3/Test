import { App } from 'electron';
import Datastore from 'nedb-promises';

interface TypeDB {
  checklist: null | Datastore;
  checkpost: null | Datastore;
  notelist: null | Datastore;
  notepost: null | Datastore;
}

export const db: TypeDB = {
  checklist: null,
  checkpost: null,
  notelist: null,
  notepost: null,
};

export function executeDB(app: App, isDev: boolean): void {
  function makeDB(filename: string) {
    return new Datastore({
      filename: isDev
        ? `./data/${filename}`
        : `${app.getPath('userData')}/data/${filename}`,
      timestampData: true,
      autoload: true,
    });
  }

  db.checklist = makeDB('checklist.db');
  db.checkpost = makeDB('checkpost.db');
  db.notelist = makeDB('notelist.db');
  db.notepost = makeDB('notepost.db');
}
