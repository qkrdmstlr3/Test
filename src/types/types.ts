import { CheckPostStatusType } from './enum';

export interface CheckPostSummaryType {
  id: string;
  title: string;
  dday: string;
  status: CheckPostStatusType;
}

export interface CheckPostSummaryCalendarType {
  id: string;
  listId: string;
  startDate: string;
  status: CheckPostStatusType;
  title: string;
  endDate: string;
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
