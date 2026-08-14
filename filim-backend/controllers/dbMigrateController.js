// TEMPORARY - copies the whole database into a cluster the client owns.
//
// The site's database currently lives in the previous developer's MongoDB
// account. This moves it into Francois's own, which is the only way to stop
// depending on someone who no longer answers - and it also cuts off the stale
// deployment that still holds the old connection string, without needing that
// account's cooperation.
//
// It runs here, inside the backend, rather than from a laptop, because the
// source connection string is stored as a "sensitive" value in Vercel and can
// never be read back out. The server already holds the connection; the
// credential never has to travel anywhere.
//
// DELETE THIS FILE, its route, and MONGODB_TARGET_URI once the move is done.

import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

// Written as replace-with-upsert keyed on _id, so running it twice is safe and
// a second run doubles as a reconciliation pass for anything saved while the
// first was in flight.
const copyCollection = async (source, target, name) => {
  const docs = await source.collection(name).find({}).toArray();
  const before = await target.collection(name).countDocuments();

  if (docs.length) {
    await target.collection(name).bulkWrite(
      docs.map((doc) => ({
        replaceOne: { filter: { _id: doc._id }, replacement: doc, upsert: true },
      })),
      { ordered: false },
    );
  }

  const after = await target.collection(name).countDocuments();
  return { collection: name, source: docs.length, targetBefore: before, targetAfter: after };
};

export const migrateDatabase = async (req, res) => {
  // Both conditions, deliberately: a GET can never write, whatever it carries.
  const apply = req.method === 'POST' && req.query.apply === '1';
  let client;

  try {
    const targetUri = process.env.MONGODB_TARGET_URI;
    // A dry run is still worth having before the destination exists: it is how
    // you find out what the move actually involves - including collections
    // nobody remembered - while there is still time to plan around it.
    if (!targetUri && apply) {
      return res
        .status(500)
        .json({ success: false, message: 'MONGODB_TARGET_URI is not set' });
    }

    const source = mongoose.connection.db;
    if (!source) {
      return res
        .status(503)
        .json({ success: false, message: 'Source database not connected yet' });
    }

    const collections = (await source.listCollections().toArray())
      .map((c) => c.name)
      .filter((name) => !name.startsWith('system.'))
      .sort();

    let target = null;
    if (targetUri) {
      client = new MongoClient(targetUri, { serverSelectionTimeoutMS: 15000 });
      await client.connect();
      target = client.db();
    }

    const report = [];
    for (const name of collections) {
      if (apply) {
        report.push(await copyCollection(source, target, name));
      } else {
        report.push({
          collection: name,
          source: await source.collection(name).countDocuments(),
          targetBefore: target ? await target.collection(name).countDocuments() : null,
          targetAfter: null,
        });
      }
    }

    return res.status(200).json({
      success: true,
      mode: apply ? 'applied' : 'dry run - nothing written',
      sourceDatabase: source.databaseName,
      targetDatabase: target ? target.databaseName : '(no target configured yet)',
      totals: {
        collections: report.length,
        sourceDocuments: report.reduce((sum, r) => sum + r.source, 0),
        targetDocuments: target
          ? report.reduce((sum, r) => sum + (r.targetAfter ?? r.targetBefore ?? 0), 0)
          : null,
      },
      report,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    await client?.close().catch(() => {});
  }
};

/** Read-only: confirms which database the backend is actually talking to. */
export const whichDatabase = async (req, res) => {
  const connection = mongoose.connection;
  const collections = connection.db
    ? (await connection.db.listCollections().toArray()).map((c) => c.name).sort()
    : [];
  return res.status(200).json({
    success: true,
    // Host and database name only - never the credentials.
    host: connection.host,
    database: connection.name,
    readyState: connection.readyState,
    collections,
  });
};
