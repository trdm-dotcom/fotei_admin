import dayjs from 'dayjs';
import { IPost } from 'app/shared/model/post.model';

export interface IReport {
  id?: string;
  reason?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  status?: string | null;
  post?: IPost | null;
}

export const defaultValue: Readonly<IReport> = {};
