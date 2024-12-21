export type ApiResponse<T = null> = {
  data: T;
  error: string | null;
};

export const ActionStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  REJECTED: 'REJECTED',
  FULFILLED: 'FULFILLED',
} as const;

const actionValues = Object.values(ActionStatus);

export type TActionState = {
  status: (typeof actionValues)[number];
  error?: string;
};
