export const BASE_URL = 'http://localhost:3333';
export const GRAPHQL_API = `${BASE_URL}/graphql`;

export enum ENDPOINTS {
  HOME = '/',
  REGISTER = '/register',
  LOGIN = '/login',
  FEED = '/feed',
  NOTIFICATIONS = '/notifications',
  CHATS = '/chats',
  MORE = '/more',
  EXPLORE = '/explore',
  PROFILE = '/profile',
  USER = '/user/:name',
  ORG = '/org/:name',
  EVENT = '/ev/:id',
  MYORG = '/organization',
  EVENTS = '/events',
}

export type EventType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  sportId: string;
  maxPpl: Number;
  time: String;
  date: String;

  isOpen: boolean;
  isPaid: boolean;
  usersRequestingToJoin?: UserType[];
  orgUserId: String;
  organizationId: String;
  User?: UserType[];
  createdBy?: UserType;
  EventAdditions?: EventAdditions;
  location?: Location;
  distance?: number;
};

export type Sport = {
  id: string;
  name: string;
};

export type Location = {
  id: string;
  name: string;
  longitude: string;
  latitude: string;
};

export type EventAdditions = {
  description: string;
  nameOfTheEvent: string;
  eventCoverPhoto: string;
};

export type UserType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: Boolean;
  email: string;
  name: string;
  bio: string;
  profileName: string;
  hash: string;
  hashedRt: string;
  userPhoto: string;
  role: string;
  organizationId: string;
  eventId?: string;
  Event?: EventType[];
  socketId?: string;
  achievments?: Achievment[];
  interests?: Sport[];
};

export type OrganizationType = {
  email: string;
  name: string;
  bio: string;
  profileName: string;
  organization: string;
  hash: string;
  hashedRt: string;
  userPhoto: string;
  role: Role;
  orgCreatedEvent: EventType[];
  orgSubmitedEvents: EventType[];
  Users: UserType[];
  socketId?: string;
};

export type Achievment = {
  achievmentPhoto: string;
  achievmentDescription: string;
  achievmentName: string;
};

export enum Role {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export type EventType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  sportId: string;
  maxPpl: Number;
  time: String;
  date: String;

  isOpen: boolean;
  isPaid: boolean;
  usersRequestingToJoin?: UserType[];
  orgUserId: String;
  organizationId: String;
  User?: UserType[];
  createdBy?: UserType;
  EventAdditions?: EventAdditions;
  location?: Location;
  distance?: number;
};

export type Sport = {
  id: string;
  name: string;
};

export type Location = {
  id: string;
  name: string;
  longitude: string;
  latitude: string;
};

export type EventAdditions = {
  description: string;
  nameOfTheEvent: string;
  eventCoverPhoto: string;
};

export type UserType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: Boolean;
  email: string;
  name: string;
  bio: string;
  profileName: string;
  hash: string;
  hashedRt: string;
  userPhoto: string;
  role: string;
  organizationId: string;
  eventId?: string;
  Event?: EventType[];
  socketId?: string;
  achievments?: Achievment[];
  interests?: Sport[];
};

export type OrganizationType = {
  email: string;
  name: string;
  bio: string;
  profileName: string;
  organization: string;
  hash: string;
  hashedRt: string;
  userPhoto: string;
  role: Role;
  orgCreatedEvent: EventType[];
  orgSubmitedEvents: EventType[];
  Users: UserType[];
  socketId?: string;
};

export type Achievment = {
  achievmentPhoto: string;
  achievmentDescription: string;
  achievmentName: string;
};

export enum Role {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}
