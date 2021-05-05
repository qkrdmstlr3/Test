import { CheckPostStatusType } from './enum';

export interface PostType {
  id: string;
  title: string;
  dday: string;
}

export interface CheckListType {
  id: string;
  name: string;
  posts: PostType[];
}

export interface CheckPostType {
  id: string;
  title: string;
  status: CheckPostStatusType;
  startDate: string;
  endDate: string;
  content: string;
}
