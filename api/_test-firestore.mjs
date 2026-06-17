// Minimal in-memory Firestore fake for deterministic webhook/sync tests.
// Supports the exact surface the handlers use: collection/doc, subcollections,
// where().limit().get(), get/set(merge)/update(dotted paths), runTransaction,
// collectionGroup().where().limit().get(), and FieldValue.serverTimestamp().

const SERVER_TS = { __sentinel: 'serverTimestamp' };

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) && value !== SERVER_TS;
}

function deepMerge(target, source) {
  const out = isPlainObject(target) ? { ...target } : {};
  for (const [key, value] of Object.entries(source)) {
    out[key] = isPlainObject(value) ? deepMerge(out[key], value) : value;
  }
  return out;
}

function setDottedPath(target, dotted, value) {
  const parts = dotted.split('.');
  let node = target;
  for (let i = 0; i < parts.length - 1; i += 1) {
    if (!isPlainObject(node[parts[i]])) node[parts[i]] = {};
    node = node[parts[i]];
  }
  node[parts[parts.length - 1]] = value;
}

export function createFakeFirestore() {
  const store = new Map(); // docPath -> data object

  const snap = (path) => ({
    get exists() { return store.has(path); },
    data: () => (store.has(path) ? structuredCloneSafe(store.get(path)) : undefined),
    ref: docRef(path),
  });

  function structuredCloneSafe(value) {
    return JSON.parse(JSON.stringify(value, (_k, v) => (v === SERVER_TS ? '<ts>' : v)));
  }

  function applySet(path, data, options) {
    const existing = store.get(path);
    if (options?.merge && isPlainObject(existing)) {
      store.set(path, deepMerge(existing, data));
    } else {
      store.set(path, deepMerge({}, data));
    }
  }

  function applyUpdate(path, data) {
    const existing = isPlainObject(store.get(path)) ? { ...store.get(path) } : {};
    for (const [key, value] of Object.entries(data)) {
      if (key.includes('.')) setDottedPath(existing, key, value);
      else existing[key] = value;
    }
    store.set(path, existing);
  }

  function collectionRef(prefix) {
    return {
      doc: (id) => docRef(`${prefix}/${id}`),
      where: (field, _op, val) => ({
        limit: () => ({
          get: async () => {
            const docs = [];
            for (const [path, data] of store.entries()) {
              if (!path.startsWith(`${prefix}/`)) continue;
              if (path.slice(prefix.length + 1).includes('/')) continue; // direct children only
              if (getField(data, field) === val) docs.push(snap(path));
            }
            return { empty: docs.length === 0, docs };
          },
        }),
      }),
    };
  }

  function docRef(path) {
    return {
      path,
      collection: (name) => collectionRef(`${path}/${name}`),
      get parent() { return { parent: { id: path.split('/')[path.split('/').length - 3] } }; },
      get: async () => snap(path),
      set: async (data, options) => applySet(path, data, options),
      update: async (data) => applyUpdate(path, data),
    };
  }

  function getField(data, dotted) {
    return dotted.split('.').reduce((node, key) => (node == null ? undefined : node[key]), data);
  }

  const db = {
    collection: (name) => collectionRef(name),
    collectionGroup: (name) => ({
      where: (field, _op, val) => ({
        limit: () => ({
          get: async () => {
            const docs = [];
            for (const [path, data] of store.entries()) {
              const segs = path.split('/');
              if (segs[segs.length - 2] !== name) continue;
              if (getField(data, field) === val) {
                const ref = docRef(path);
                ref.parent = { parent: { id: segs[segs.length - 3] } };
                docs.push(snap(path));
              }
            }
            return { docs };
          },
        }),
      }),
    }),
    runTransaction: async (fn) => fn({
      get: async (ref) => snap(ref.path),
      set: (ref, data, options) => applySet(ref.path, data, options),
      update: (ref, data) => applyUpdate(ref.path, data),
    }),
  };

  return { db, store };
}

export const fakeAdmin = {
  firestore: { FieldValue: { serverTimestamp: () => SERVER_TS } },
};
