import { TMonsterStatblock } from '@/api/types';
import { firestore as firestoreClient, firebaseAuth } from '@/FirebaseConfig';
import firestore from '@react-native-firebase/firestore';

export type TSaveStatblockParams = TMonsterStatblock & { cr: number };

export type TStatblock = TMonsterStatblock & {
  id: string;
  cr: number;
  owner: string;
  ownerUID: string;
  createdAt: { seconds: number };
  updatedAt: { seconds: number };
};

export const STATBLOCK_COLLECTION = 'statblocks';

export const saveStatblockDB = async (params: TSaveStatblockParams) => {
  const user = firebaseAuth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const docRef = await firestoreClient.collection(STATBLOCK_COLLECTION).add({
    ...params,
    owner: user.email,
    ownerUID: user.uid,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });

  return docRef.id;
};

export const getSavedStatblocksDB = async (): Promise<TStatblock[]> => {
  const user = firebaseAuth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  const querySnapshot = await firestoreClient.collection(STATBLOCK_COLLECTION).where('ownerUID', '==', user.uid).get();

  const items = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as TStatblock));
  return items;
};

export const deleteSavedStatblockDB = async (statblockID: string) => {
  const user = firebaseAuth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  await firestoreClient.collection(STATBLOCK_COLLECTION).doc(statblockID).delete();
};
