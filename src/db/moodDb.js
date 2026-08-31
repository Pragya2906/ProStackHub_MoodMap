const DB_NAME = "moodmap";
const DB_VERSION = 1;
export const STORE = "entries";

let dbPromise = null;

export class DbError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "DbError";
    this.cause = cause;
  }
}

/** Opens (and upgrades, if needed) the database. Cached per page session. */
export function openDb() {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new DbError("IndexedDB is not available in this browser."));
  }
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    let request;
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (err) {
      reject(new DbError("Could not open the local database.", err));
      return;
    }

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "date" });
        store.createIndex("by-date", "date");
        store.createIndex("by-mood", "mood");
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      // If another tab requests a version upgrade, close so it isn't blocked.
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };

    request.onerror = () =>
      reject(new DbError("The local database could not be opened.", request.error));
    request.onblocked = () =>
      reject(new DbError("The database is blocked by another open tab. Close it and retry."));
  }).catch((err) => {
    dbPromise = null; // allow retry after a failure
    throw err;
  });

  return dbPromise;
}

/**
 * Runs `fn(store)` inside a transaction and resolves with `fn`'s request result
 * once the transaction commits, so callers never read stale data.
 */
export async function withStore(mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    let tx;
    try {
      tx = db.transaction(STORE, mode);
    } catch (err) {
      reject(new DbError("Could not start a database transaction.", err));
      return;
    }
    let result;
    try {
      result = fn(tx.objectStore(STORE));
    } catch (err) {
      tx.abort();
      reject(new DbError("Database operation failed.", err));
      return;
    }
    tx.oncomplete = () =>
      resolve(result && typeof result === "object" && "result" in result ? result.result : result);
    tx.onerror = () => reject(new DbError("Database write failed.", tx.error));
    tx.onabort = () => reject(new DbError("Database transaction was aborted.", tx.error));
  });
}
