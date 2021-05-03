export interface PostType {
  title: string;
}

export interface CheckListType {
  id: string;
  name: string;
  posts: PostType[];
}
