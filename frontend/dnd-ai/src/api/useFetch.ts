import { useCallback, useState } from 'react';

import { AxiosError } from 'axios';

import { ActionStatus, TActionState } from './types';

export type TUseFetchOptions<T = any, K extends any[] = any[]> = {
  toastOnLoading?: string | ((...params: K) => string);
  toastOnError?: boolean;
  toastOnSuccess?: string | ((...params: K) => string);
  onSuccess?: (data: T, ...params: K) => void;
  onError?: (data: T) => void;
  onTimeout?: (message: string) => void;
};

export type TApiCall<T = any> = {
  data: T;
  [key: string]: any;
};

export type TFetchFunction<T, K extends any[]> = {
  status: TActionState['status'];
  isLoading: boolean;
  isRejected: boolean;
  data: T | undefined;
  error: string;
  reset: () => void;
  execute: (...args: K) => Promise<T | undefined>;
  setData: (fn: (prev: T) => T) => void;
  setError: (fn: ((prev: string) => string) | string) => void;
};

const useFetch = <T extends any = any, K extends any[] = any[]>(
  api: (...params: K) => Promise<TApiCall<T>>,
  options: TUseFetchOptions<T, K> = {}
): TFetchFunction<T, K> => {
  const [status, setStatus] = useState<TActionState['status']>(ActionStatus.NOT_STARTED);
  const [data, setData] = useState<T>();
  const [error, setError] = useState('');

  const execute = useCallback(
    async (...args: K) => {
      setError('');
      setStatus(ActionStatus.IN_PROGRESS);
      if (options.toastOnLoading) {
        if (typeof options.toastOnLoading === 'string') {
        } else {
          const message = options.toastOnLoading(...args);
        }
      }
      try {
        const res = await api.call(this, ...args);
        setData(res.data);
        setStatus(ActionStatus.FULFILLED);
        options.onSuccess?.(res.data, ...args);
        if (options.toastOnSuccess) {
          if (typeof options.toastOnSuccess === 'string') {
          } else {
            const message = options.toastOnSuccess(...args);
          }
        }
        return res.data;
      } catch (err: any) {
        // const errorMsg = sanitizeAxiosError(err);
        let errorMsg: string = err?.response?.data?.error || err?.response?.data || err || 'API call failed';

        if (typeof errorMsg !== 'string') {
          errorMsg = JSON.stringify(errorMsg);
        }

        setError(errorMsg);
        setStatus(ActionStatus.REJECTED);
        const castErr = err as AxiosError<T>;
        if (castErr.response?.data != null) {
          options.onError?.(castErr.response.data);
        } else if (castErr.message?.includes('timeout')) {
          options.onTimeout?.(castErr.message);
        }
        if (options.toastOnError) {
          // toast.error(String(errorMsg), { id: toastId });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api]
  );

  const reset = useCallback(() => {
    setStatus(ActionStatus.NOT_STARTED);
    setError('');
    setData(undefined);
  }, []);

  return {
    status,
    data,
    error,
    execute,
    reset,
    isLoading: status === 'IN_PROGRESS',
    isRejected: status === 'REJECTED',
    setData,
    setError,
  };
};

export default useFetch;
