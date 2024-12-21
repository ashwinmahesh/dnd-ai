import axios from "axios"

import http from './http'
import { ApiResponse } from "./types"

type TGetRandomNamesAPI = string[]

export const getRandomNamesAPI = async (descriptor: string = '') => {
  try {
    const resp = await http.get<ApiResponse<TGetRandomNamesAPI>>(`/names?descriptor=${descriptor}`)
    return resp.data.data
  } catch (err: any) {
    console.error("Received error: ", err?.response?.data?.error)
    console.error("Axios error: ", err)
    return []
  }
}