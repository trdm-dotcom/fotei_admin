import dayjs from 'dayjs';

export interface IPost {
  id?: string;
  caption?: string | null;
  source?: string | null;
  disable?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  userId?: number | null;
}

export const defaultValue: Readonly<IPost> = {
  disable: false,
};
