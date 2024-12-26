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
  name: string;
  overview: string;
  members?: { [key: string]: string };
  major_events?: string[];
  owner: string;
  ownerUID: string;
  created_at: string;
  updated_at: string;
};

export const createCampaignDB = async (params: TCreateCampaignParams) => {
  if (params.name.length < 3) {
    throw new Error('Campaign name must be atleast 3 character');
  }
  const user = firebaseAuth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  await firestoreClient.collection('campaigns').add({
    ...params,
    owner: user.email,
    ownerUID: user.uid,
    createdAt: firestore.Timestamp,
    updatedAt: firestore.Timestamp,
  });
};

export const getCampaignsDB = async (): Promise<TCampaign[]> => {
  const user = firebaseAuth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  const querySnapshot = await firestoreClient.collection('campaigns').where('ownerUID', '==', user.uid).get();

  const items = querySnapshot.docs.map((doc) => ({ ...doc.data() } as TCampaign));
  return items;
};
