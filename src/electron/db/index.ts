import { App } from 'electron';
import Datastore from 'nedb-promises';

interface TypeDB {
  checklist: null | Datastore;
  checktext: null | Datastore;
  postlist: null | Datastore;
  posttext: null | Datastore;
}

export const db: TypeDB = {
  checklist: null,
  checktext: null,
  postlist: null,
  posttext: null,
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
  db.checktext = makeDB('checktext.db');
  db.postlist = makeDB('postlist.db');
  db.posttext = makeDB('posttext.db');
}
