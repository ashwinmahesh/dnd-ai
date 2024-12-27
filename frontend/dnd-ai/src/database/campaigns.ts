import { firestore as firestoreClient, firebaseAuth } from '@/FirebaseConfig';
import { collection, addDoc } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';

export type TCreateCampaignParams = {
  name: string;
  overview: string;
  members?: { [key: string]: string };
  major_events?: string[];
};

export type TCampaign = {
  id: string;
  name: string;
  overview: string;
  members: { [key: string]: string };
  major_events: string[];
  owner: string;
  ownerUID: string;
  createdAt: { seconds: number };
  updatedAt: { seconds: number };
};

export const CAMPAIGN_COLLECTION = 'campaigns';

// Returns the ID of newly created document
export const createCampaignDB = async (params: TCreateCampaignParams) => {
  if (params.name.length < 3) {
    throw new Error('Campaign name must be atleast 3 character');
  }
  const user = firebaseAuth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  const docRef = await firestoreClient.collection(CAMPAIGN_COLLECTION).add({
    ...params,
    owner: user.email,
    ownerUID: user.uid,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });

  return docRef.id;
};

export const getCampaignsDB = async (): Promise<TCampaign[]> => {
  const user = firebaseAuth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  const querySnapshot = await firestoreClient.collection(CAMPAIGN_COLLECTION).where('ownerUID', '==', user.uid).get();

  const items = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as TCampaign));
  return items;
};

export const updateCampaignDB = async (id: string, params: Partial<TCreateCampaignParams>): Promise<void> => {
  console.log(`Update campaign ${id}: ${JSON.stringify(params)}`);
  const updates = { updatedAt: firestore.FieldValue.serverTimestamp() };
  if (params.name) {
    updates['name'] = params.name;
  }
  if (params.overview) {
    updates['overview'] = params.overview;
  }
  if (params.major_events) {
    updates['major_events'] = firestore.FieldValue.arrayUnion(...params.major_events);
  }
  return await firestoreClient.collection(CAMPAIGN_COLLECTION).doc(id).update(updates);
};

export const deleteMajorEventDB = async (id: string, event: string): Promise<void> => {
  return await firestoreClient
    .collection(CAMPAIGN_COLLECTION)
    .doc(id)
    .update({
      major_events: firestore.FieldValue.arrayRemove(event),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
};

export const addOrUpdateAdventurerDB = async (campaignId: string, name: string, description: string): Promise<void> => {
  return await firestoreClient
    .collection(CAMPAIGN_COLLECTION)
    .doc(campaignId)
    .set(
      {
        members: { [name]: description },
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
};

export const deleteAdventurerDB = async (campaignId: string, name: string): Promise<void> => {
  const key = `members.${name}`;
  return await firestoreClient
    .collection(CAMPAIGN_COLLECTION)
    .doc(campaignId)
    .update({ [key]: firestore.FieldValue.delete(), updatedAt: firestore.FieldValue.serverTimestamp });
};
