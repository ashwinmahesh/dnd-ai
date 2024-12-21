import axios from 'axios';

import http, { encodeGetParams } from './http';
import { ApiResponse } from './types';

type TGetRandomNamesAPI = string[];
type TGetRandomEncountersAPI = { encounter: string; context: string }[];

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
