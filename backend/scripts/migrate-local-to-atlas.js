const mongoose = require('mongoose');

const SOURCE_URI = process.env.SOURCE_URI || 'mongodb://127.0.0.1:27017/professional-network';
const TARGET_URI = process.env.TARGET_URI;
const TARGET_DB = process.env.TARGET_DB || 'professional-network';

if (!TARGET_URI) {
  console.error('Missing TARGET_URI environment variable.');
  process.exit(1);
}

async function main() {
  const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
  const targetRootConn = await mongoose.createConnection(TARGET_URI).asPromise();
  const targetConn = targetRootConn.useDb(TARGET_DB, { useCache: true });

  try {
    const collections = await sourceConn.db.listCollections({}, { nameOnly: true }).toArray();

    for (const { name } of collections) {
      if (name.startsWith('system.')) {
        continue;
      }

      const sourceCollection = sourceConn.db.collection(name);
      const targetCollection = targetConn.db.collection(name);

      const docs = await sourceCollection.find({}).toArray();

      await targetCollection.deleteMany({});
      if (docs.length > 0) {
        await targetCollection.insertMany(docs, { ordered: false });
      }

      console.log(`Migrated collection '${name}' with ${docs.length} document(s).`);
    }

    console.log('Migration complete.');
  } finally {
    await sourceConn.close();
    await targetRootConn.close();
  }
}

main().catch((error) => {
  console.error('Migration failed:', error.message);
  process.exit(1);
});
