import { CheckPostStatusType } from './enum';

export interface CheckPostSummaryType {
  id: string;
  title: string;
  dday: string;
  status: string;
}

export interface CheckListItemType {
  id: string;
  name: string;
  posts: CheckPostSummaryType[];
}

export interface CheckPostType {
  id: string;
  title: string;
  status: CheckPostStatusType;
  startDate: string;
  endDate: string;
  content: string;
}
