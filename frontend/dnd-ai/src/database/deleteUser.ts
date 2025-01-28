import { firestore as firestoreClient, firebaseAuth } from '@/FirebaseConfig';

const collections = ['campaigns', 'statblocks'];

export const deleteAllRecordsForUser = async () => {
  const user = firebaseAuth.currentUser;

  const deletionPromises = collections.map(async (collection: string) => {
    try {
      let batch = firestoreClient.batch();
      let batchCount = 0;

      const snapshot = await firestoreClient.collection(collection).where('owner', '==', user.email).get();

      for (const doc of snapshot.docs) {
        batch.delete(doc.ref);
        batchCount++;

        if (batchCount >= 500) {
          await batch.commit();
          batch = firestoreClient.batch();
          batchCount = 0;
        }
      }

      if (batchCount > 0) {
        await batch.commit();
      }
      console.log(`Deleted ${snapshot.docs.length} documents from ${collection}`);
    } catch (err) {
      console.error(`Error cleaning up collection ${collection}:`, err);
    }
  });

  await Promise.all(deletionPromises);
};
