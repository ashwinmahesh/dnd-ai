import axios from 'axios';

import http, { encodeGetParams } from './http';
import { ApiResponse, TMonsterStatblock } from './types';

export type TGetRandomNamesAPI = string[];
export type TGetRandomEncountersAPI = { encounter: string; context: string }[];
export type TGenLootTableAPI = string[];
export type TGenRumorsAPI = { rumor: string; quest_hook: string; quest_objective: string }[];

export const getRandomNamesAPI = async (params: { descriptor: string }) => {
  try {
    const resp = await http.get<ApiResponse<TGetRandomNamesAPI>>(`/names?` + encodeGetParams(params));
    return resp.data.data;
  } catch (err: any) {
    console.error('Received error: ', err?.response?.data?.error);
    console.error('Axios error: ', err);
    return [];
  }
};

export const getRandomEncounters = async (params: {
  party_level: number;
  scenario: string;
  num_encounters?: number;
}) => {
  return await http.get<ApiResponse<TGetRandomEncountersAPI>>('/encounters?' + encodeGetParams(params));
};

export const generateMonsterStatblockAPI = async (description: string, challenge_rating: number) => {
  return await http.get<ApiResponse<TMonsterStatblock>>(
    '/monster?' + encodeGetParams({ description, challenge_rating })
  );
};

export const generateLootTableAPI = async (params: {
  loot_cr_min: number;
  loot_cr_max?: number;
  loot_val_min: number;
  loot_val_max?: number;
  magic_item_rarites?: string[];
  context?: string;
  include_magic_items?: boolean;
}) => {
  return await http.get<ApiResponse<TGenLootTableAPI>>('/loot_table?' + encodeGetParams(params));
};

export const generateRumors = async (params: {
  party_level: number;
  location: string;
  quest_giver: string;
  num_rumors?: number;
}) => {
  return await http.get<ApiResponse<TGenRumorsAPI>>('/rumors?' + encodeGetParams(params));
};
