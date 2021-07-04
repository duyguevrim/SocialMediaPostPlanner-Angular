export interface IUser {
  id: string;
  username: string;
  email: string;
  name: string;
  surname: string;
  gsmNumber: string;
  jwt?: string;
  plan: any;
  identityNumber?: string;
  city?: string;
  country?: string;
  zipcode?: string;
  adress?: string;
  blocked: boolean;
  confirmed: boolean;
}

export interface Account {
  title: string;
  user: IUser;
  active?: boolean;
  accessToken?: string;
  account_key?: string;
  access_secret?: string;
  provider: string;
  id?: number;
}

export interface Post {
  id?: number;
  message?: string;
  status?: number;
  date?: string;
  link?: string;
  account?: Account;
  account_object?: Account;
  user?: number;
  provider?: number;
  posted?: boolean;
  files?: FormData;
  totalLikes?: number;
  totalComments?: number;
  comments?: [];
  likes?: [];
  subComments?: [];
}

export interface Checkout {
  name: string;
  paymentPageUrl?: string;
  status: string;
  token: string;
  created_at: string;
  price: number;
}

export interface HashTag {
  id?: number;
  name: string;
  content: string;
  user: IUser;
  post?: Post;
}

export interface Provider {
  id: number;
  title: string;
}

export interface Date {
  id: number;
  title: string;
}

export interface Status {
  id: number;
  title: string;
}

export interface PostFilter {
  posted?: boolean;
  provider?: number;
  account?: number;
  date?: number;
}

export interface IAuthResponse {
  jwt: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface IlinkPreview {
  description: string;
  image: string;
  title: string;
  url: string;
}
