import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Achievement = {
  __typename?: 'Achievement';
  _id: Scalars['ID']['output'];
  description: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  threshold: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type AdminCreateSpecializationInput = {
  categoryName: Scalars['String']['input'];
};

export type AdminSpecialization = {
  __typename?: 'AdminSpecialization';
  categoryName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export enum AllowedMediaEnum {
  Audio = 'AUDIO',
  Image = 'IMAGE',
  Text = 'TEXT',
  Video = 'VIDEO'
}

export type Appointment = {
  __typename?: 'Appointment';
  chatRoomId?: Maybe<Scalars['String']['output']>;
  clientId: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  endedAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lawyerId: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Int']['output']>;
  slot: AvailableDay;
  specialization?: Maybe<Specialization>;
  specializationId: Scalars['ID']['output'];
  status: AppointmentStatus;
  subscription: Scalars['Boolean']['output'];
};

export enum AppointmentStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Confirmed = 'CONFIRMED',
  Pending = 'PENDING'
}

export type Availability = {
  __typename?: 'Availability';
  availableDays: Array<AvailableDay>;
  lawyerId: Scalars['String']['output'];
};

export type AvailabilitySchedule = {
  __typename?: 'AvailabilitySchedule';
  _id: Scalars['ID']['output'];
  availableDays: Array<AvailableDay>;
  lawyerId: Scalars['String']['output'];
};

export type AvailableDay = {
  __typename?: 'AvailableDay';
  booked: Scalars['Boolean']['output'];
  day: Scalars['String']['output'];
  endTime: Scalars['String']['output'];
  startTime: Scalars['String']['output'];
};

export type AvailableDayInput = {
  day: Scalars['String']['input'];
  endTime: Scalars['String']['input'];
  startTime: Scalars['String']['input'];
};

export type ChatHistory = {
  __typename?: 'ChatHistory';
  _id: Scalars['ID']['output'];
  botResponse: Scalars['JSON']['output'];
  createdAt: Scalars['String']['output'];
  sessionId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  userMessage: Scalars['String']['output'];
};

export type ChatHistoryInput = {
  botResponse?: InputMaybe<Scalars['JSON']['input']>;
  sessionId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  userMessage: Scalars['String']['input'];
};

export type ChatRoom = {
  __typename?: 'ChatRoom';
  _id: Scalars['String']['output'];
  allowedMedia?: Maybe<AllowedMediaEnum>;
  appointmentId: Scalars['String']['output'];
  lastMessage?: Maybe<Message>;
  participants: Array<Scalars['String']['output']>;
};

export type ChatRoomsMessages = {
  __typename?: 'ChatRoomsMessages';
  _id: Scalars['ID']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  type: MediaType;
  userId: Scalars['String']['output'];
};

export type Comment = {
  __typename?: 'Comment';
  _id: Scalars['ID']['output'];
  author: Scalars['String']['output'];
  authorInfo: CommentAuthorInfo;
  content: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  post: Scalars['ID']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type CommentAuthorInfo = {
  __typename?: 'CommentAuthorInfo';
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CreateAchievementInput = {
  description: Scalars['String']['input'];
  icon?: InputMaybe<Scalars['String']['input']>;
  threshold: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type CreateAppointmentInput = {
  clientId: Scalars['String']['input'];
  lawyerId: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  slot: AvailableDayInput;
  specializationId: Scalars['ID']['input'];
};

export type CreateChatRoomInput = {
  allowedMedia?: InputMaybe<AllowedMediaEnum>;
  appointmentId: Scalars['String']['input'];
  participants: Array<Scalars['String']['input']>;
};

export type CreateCommentInput = {
  content: Scalars['String']['input'];
  postId: Scalars['ID']['input'];
};

export type CreateDocumentInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  images: Array<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  type?: InputMaybe<MediaType>;
};

export type CreateLawyerInput = {
  achievements?: InputMaybe<Array<Scalars['ID']['input']>>;
  bio?: InputMaybe<Scalars['String']['input']>;
  document?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  lawyerId: Scalars['ID']['input'];
  licenseNumber: Scalars['String']['input'];
  profilePicture: Scalars['String']['input'];
  rating?: InputMaybe<Scalars['Int']['input']>;
  university?: InputMaybe<Scalars['String']['input']>;
};

export type CreateNotificationInput = {
  content: Scalars['String']['input'];
  recipientId: Scalars['ID']['input'];
  type: NotificationType;
};

export type CreatePostInput = {
  content: PostContentInput;
  specialization: Array<Scalars['ID']['input']>;
  title: Scalars['String']['input'];
};

export type CreateReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  rating: Scalars['Int']['input'];
};

export type CreateSpecializationInput = {
  lawyerId?: InputMaybe<Scalars['ID']['input']>;
  pricePerHour: Scalars['Int']['input'];
  specializationId: Scalars['ID']['input'];
  subscription: Scalars['Boolean']['input'];
};

export type DeleteCommentInput = {
  commentId: Scalars['ID']['input'];
};

export type Document = {
  __typename?: 'Document';
  _id: Scalars['ID']['output'];
  clientId: Scalars['String']['output'];
  content?: Maybe<Scalars['String']['output']>;
  images: Array<Scalars['String']['output']>;
  lawyerId?: Maybe<Scalars['ID']['output']>;
  reviewComment?: Maybe<Scalars['String']['output']>;
  status?: Maybe<ReviewStatus>;
  title: Scalars['String']['output'];
  type?: Maybe<DocumentMediaType>;
};

export enum DocumentMediaType {
  File = 'FILE',
  Image = 'IMAGE',
  Text = 'TEXT'
}

export type Lawyer = {
  __typename?: 'Lawyer';
  _id: Scalars['ID']['output'];
  achievements: Array<Achievement>;
  bio?: Maybe<Scalars['String']['output']>;
  clerkUserId?: Maybe<Scalars['String']['output']>;
  clientId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  document?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  lawyerId: Scalars['ID']['output'];
  licenseNumber: Scalars['String']['output'];
  profilePicture: Scalars['String']['output'];
  rating?: Maybe<Scalars['Int']['output']>;
  specialization: Array<Specialization>;
  status?: Maybe<LawyerRequestStatus>;
  university?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export enum LawyerRequestStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Verified = 'VERIFIED'
}

export type LawyerSpecializationInput = {
  categoryId: Scalars['ID']['input'];
  pricePerHour?: InputMaybe<Scalars['Int']['input']>;
  subscription?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ManageLawyerRequestInput = {
  lawyerId: Scalars['ID']['input'];
  status: LawyerRequestStatus;
};

export type MediaInput = {
  audio?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  video?: InputMaybe<Scalars['String']['input']>;
};

export enum MediaType {
  Audio = 'AUDIO',
  File = 'FILE',
  Image = 'IMAGE',
  Text = 'TEXT',
  Video = 'VIDEO'
}

export type Message = {
  __typename?: 'Message';
  ChatRoomsMessages: Array<ChatRoomsMessages>;
  chatRoomId: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  adminCreateSpecialization: AdminSpecialization;
  clearChatHistory: Scalars['Boolean']['output'];
  createAchievement: Achievement;
  createAppointment?: Maybe<Appointment>;
  createChatRoom?: Maybe<Scalars['String']['output']>;
  createChatRoomAfterAppointment: ChatRoom;
  createComment: Comment;
  createDocument: Document;
  createLawyer: Lawyer;
  createMessage?: Maybe<Message>;
  createNotification: Notification;
  createPost: Post;
  createReview: Review;
  createSpecialization: Array<Maybe<Specialization>>;
  deleteAchievement: Scalars['Boolean']['output'];
  deleteComment: Scalars['Boolean']['output'];
  deleteLawyer: Scalars['Boolean']['output'];
  deletePost: Scalars['Boolean']['output'];
  deleteReview: Scalars['Boolean']['output'];
  deleteSpecialization: Scalars['Boolean']['output'];
  manageLawyerRequest: Lawyer;
  markAllNotificationsAsRead: Scalars['Boolean']['output'];
  markNotificationAsRead: Notification;
  reviewDocument: Document;
  saveChatHistory: ChatHistory;
  setAvailability: AvailabilitySchedule;
  updateAchievement: Achievement;
  updateAvailabilityDate: AvailabilitySchedule;
  updateChatRoom: ChatRoom;
  updateComment: Comment;
  updateLawyer: Lawyer;
  updatePost: Post;
  updateReview: Review;
  updateSpecialization: Specialization;
};


export type MutationAdminCreateSpecializationArgs = {
  input: AdminCreateSpecializationInput;
};


export type MutationClearChatHistoryArgs = {
  userId: Scalars['String']['input'];
};


export type MutationCreateAchievementArgs = {
  input: CreateAchievementInput;
};


export type MutationCreateAppointmentArgs = {
  input: CreateAppointmentInput;
};


export type MutationCreateChatRoomArgs = {
  appointmentId: Scalars['String']['input'];
};


export type MutationCreateChatRoomAfterAppointmentArgs = {
  input: CreateChatRoomInput;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreateDocumentArgs = {
  input: CreateDocumentInput;
};


export type MutationCreateLawyerArgs = {
  input: CreateLawyerInput;
};


export type MutationCreateMessageArgs = {
  chatRoomId: Scalars['ID']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  type: MediaType;
  userId: Scalars['String']['input'];
};


export type MutationCreateNotificationArgs = {
  input: CreateNotificationInput;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationCreateReviewArgs = {
  clientId: Scalars['ID']['input'];
  input: CreateReviewInput;
  lawyerId: Scalars['ID']['input'];
};


export type MutationCreateSpecializationArgs = {
  input?: InputMaybe<SpecializationInput>;
};


export type MutationDeleteAchievementArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCommentArgs = {
  input: DeleteCommentInput;
};


export type MutationDeleteLawyerArgs = {
  lawyerId: Scalars['ID']['input'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationDeleteReviewArgs = {
  reviewId: Scalars['ID']['input'];
};


export type MutationDeleteSpecializationArgs = {
  specializationId: Scalars['ID']['input'];
};


export type MutationManageLawyerRequestArgs = {
  input: ManageLawyerRequestInput;
};


export type MutationMarkNotificationAsReadArgs = {
  notificationId: Scalars['ID']['input'];
};


export type MutationReviewDocumentArgs = {
  input: ReviewDocumentInput;
};


export type MutationSaveChatHistoryArgs = {
  input: ChatHistoryInput;
};


export type MutationSetAvailabilityArgs = {
  input: SetAvailabilityInput;
};


export type MutationUpdateAchievementArgs = {
  input: UpdateAchievementInput;
};


export type MutationUpdateAvailabilityDateArgs = {
  input: UpdateAvailabilityDateInput;
};


export type MutationUpdateChatRoomArgs = {
  input: UpdateChatRoomInput;
};


export type MutationUpdateCommentArgs = {
  input: UpdateCommentInput;
};


export type MutationUpdateLawyerArgs = {
  input: UpdateLawyerInput;
  lawyerId: Scalars['ID']['input'];
};


export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
  postId: Scalars['ID']['input'];
};


export type MutationUpdateReviewArgs = {
  input: UpdateReviewInput;
  reviewId: Scalars['ID']['input'];
};


export type MutationUpdateSpecializationArgs = {
  input: UpdateSpecializationInput;
  specializationId: Scalars['ID']['input'];
};

export type Notification = {
  __typename?: 'Notification';
  content: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  read: Scalars['Boolean']['output'];
  recipientId: Scalars['ID']['output'];
  type: NotificationType;
};

export enum NotificationType {
  AppointmentCreated = 'APPOINTMENT_CREATED',
  AppointmentReminder = 'APPOINTMENT_REMINDER',
  AppointmentStarted = 'APPOINTMENT_STARTED',
  LawyerApproved = 'LAWYER_APPROVED',
  ReviewReceived = 'REVIEW_RECEIVED'
}

export type NotificationsFilterInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  read?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<NotificationType>;
};

export type Post = {
  __typename?: 'Post';
  _id: Scalars['ID']['output'];
  author?: Maybe<PostAuthor>;
  comments: Array<Comment>;
  content: PostContent;
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  lawyerId: Scalars['ID']['output'];
  specialization: Array<AdminSpecialization>;
  title: Scalars['String']['output'];
  type: MediaType;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type PostAuthor = {
  __typename?: 'PostAuthor';
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  profilePicture?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type PostContent = {
  __typename?: 'PostContent';
  audio?: Maybe<Scalars['String']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  video?: Maybe<Scalars['String']['output']>;
};

export type PostContentInput = {
  audio?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  video?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  getAchievements?: Maybe<Array<Maybe<Achievement>>>;
  getAdminSpecializations: Array<AdminSpecialization>;
  getAppointmentById?: Maybe<Appointment>;
  getAppointments?: Maybe<Array<Maybe<Appointment>>>;
  getAppointmentsByLawyer?: Maybe<Array<Maybe<Appointment>>>;
  getAppointmentsByUser?: Maybe<Array<Maybe<Appointment>>>;
  getAvailability?: Maybe<Array<Maybe<Availability>>>;
  getChatHistoryByUser: Array<ChatHistory>;
  getChatRoomById?: Maybe<ChatRoom>;
  getChatRoomByUser: Array<ChatRoom>;
  getChatRoomsByAppointment: Array<ChatRoom>;
  getCommentsByPost: Array<Comment>;
  getDocumentsByStatus: Array<Document>;
  getDocumentsByUser: Array<Document>;
  getLawyerById?: Maybe<Lawyer>;
  getLawyers: Array<Lawyer>;
  getLawyersByAchievement: Array<Lawyer>;
  getLawyersBySpecialization: Array<Lawyer>;
  getLawyersByStatus: Array<Lawyer>;
  getMessages: Array<Message>;
  getPostById?: Maybe<Post>;
  getPosts: Array<Post>;
  getPostsByLawyer: Array<Post>;
  getPostsBySpecializationId: Array<Post>;
  getReviewsByLawyer: Array<Review>;
  getReviewsByUser: Array<Review>;
  getSpecializationsByLawyer: Array<Specialization>;
  myNotifications: Array<Notification>;
  notificationCount: Scalars['Int']['output'];
  searchPosts: Array<Post>;
};


export type QueryGetAchievementsArgs = {
  lawyerId: Scalars['ID']['input'];
};


export type QueryGetAppointmentByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetAppointmentsByLawyerArgs = {
  lawyerId: Scalars['String']['input'];
};


export type QueryGetAppointmentsByUserArgs = {
  clientId: Scalars['String']['input'];
};


export type QueryGetAvailabilityArgs = {
  day?: InputMaybe<Scalars['String']['input']>;
  lawyerId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetChatHistoryByUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetChatRoomByIdArgs = {
  _id: Scalars['String']['input'];
};


export type QueryGetChatRoomByUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetChatRoomsByAppointmentArgs = {
  appointmentId: Scalars['String']['input'];
};


export type QueryGetCommentsByPostArgs = {
  postId: Scalars['ID']['input'];
};


export type QueryGetDocumentsByStatusArgs = {
  status: ReviewStatus;
};


export type QueryGetDocumentsByUserArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetLawyerByIdArgs = {
  lawyerId: Scalars['ID']['input'];
};


export type QueryGetLawyersByAchievementArgs = {
  achievementId: Scalars['ID']['input'];
};


export type QueryGetLawyersBySpecializationArgs = {
  specializationId: Scalars['ID']['input'];
};


export type QueryGetLawyersByStatusArgs = {
  status: LawyerRequestStatus;
};


export type QueryGetMessagesArgs = {
  chatRoomId: Scalars['ID']['input'];
};


export type QueryGetPostByIdArgs = {
  postId: Scalars['ID']['input'];
};


export type QueryGetPostsByLawyerArgs = {
  lawyerId: Scalars['ID']['input'];
};


export type QueryGetPostsBySpecializationIdArgs = {
  specializationId: Scalars['ID']['input'];
};


export type QueryGetReviewsByLawyerArgs = {
  lawyerId: Scalars['ID']['input'];
};


export type QueryGetReviewsByUserArgs = {
  clientId: Scalars['ID']['input'];
};


export type QueryGetSpecializationsByLawyerArgs = {
  lawyerId: Scalars['ID']['input'];
};


export type QueryMyNotificationsArgs = {
  filter?: InputMaybe<NotificationsFilterInput>;
};


export type QueryNotificationCountArgs = {
  unreadOnly?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QuerySearchPostsArgs = {
  query: Scalars['String']['input'];
};

export type Review = {
  __typename?: 'Review';
  clientId: Scalars['ID']['output'];
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  lawyerId: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type ReviewDocumentInput = {
  documentId: Scalars['ID']['input'];
  reviewComment?: InputMaybe<Scalars['String']['input']>;
  status: ReviewStatus;
};

export enum ReviewStatus {
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Reviewed = 'REVIEWED'
}

export type SetAvailabilityInput = {
  availableDays: Array<AvailableDayInput>;
};

export type Specialization = {
  __typename?: 'Specialization';
  _id: Scalars['ID']['output'];
  categoryName?: Maybe<Scalars['String']['output']>;
  lawyerId: Scalars['ID']['output'];
  pricePerHour?: Maybe<Scalars['Int']['output']>;
  specializationId: Scalars['ID']['output'];
  subscription: Scalars['Boolean']['output'];
};

export type SpecializationInput = {
  specializations: Array<CreateSpecializationInput>;
};

export type UpdateAchievementInput = {
  _id: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  threshold?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAvailabilityDateInput = {
  lawyerId: Scalars['String']['input'];
  newDay: Scalars['String']['input'];
  newEndTime: Scalars['String']['input'];
  newStartTime: Scalars['String']['input'];
  oldDay: Scalars['String']['input'];
  oldEndTime: Scalars['String']['input'];
  oldStartTime: Scalars['String']['input'];
};

export type UpdateChatRoomInput = {
  _id: Scalars['String']['input'];
  allowedMedia?: InputMaybe<AllowedMediaEnum>;
  appointmentId?: InputMaybe<Scalars['String']['input']>;
  participants?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateCommentInput = {
  commentId: Scalars['ID']['input'];
  content: Scalars['String']['input'];
};

export type UpdateLawyerInput = {
  achievements?: InputMaybe<Array<Scalars['ID']['input']>>;
  bio?: InputMaybe<Scalars['String']['input']>;
  document?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  licenseNumber?: InputMaybe<Scalars['String']['input']>;
  profilePicture?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
  specialization?: InputMaybe<Array<LawyerSpecializationInput>>;
  university?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePostInput = {
  content?: InputMaybe<PostContentInput>;
  specialization?: InputMaybe<Array<Scalars['ID']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateSpecializationInput = {
  pricePerHour?: InputMaybe<Scalars['Int']['input']>;
  subscription: Scalars['Boolean']['input'];
};

export type GetAdminSpecializationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAdminSpecializationsQuery = { __typename?: 'Query', getAdminSpecializations: Array<{ __typename?: 'AdminSpecialization', id: string, categoryName: string }> };

export type CreateAppointmentMutationVariables = Exact<{
  input: CreateAppointmentInput;
}>;


export type CreateAppointmentMutation = { __typename?: 'Mutation', createAppointment?: { __typename?: 'Appointment', id: string, clientId: string, lawyerId: string, status: AppointmentStatus, chatRoomId?: string | null, subscription: boolean, notes?: string | null, specializationId: string, slot: { __typename?: 'AvailableDay', day: string, startTime: string, endTime: string, booked: boolean }, specialization?: { __typename?: 'Specialization', _id: string, lawyerId: string, specializationId: string, categoryName?: string | null, subscription: boolean, pricePerHour?: number | null } | null } | null };

export type GetAppointmentsByLawyerQueryVariables = Exact<{
  lawyerId: Scalars['String']['input'];
}>;


export type GetAppointmentsByLawyerQuery = { __typename?: 'Query', getAppointmentsByLawyer?: Array<{ __typename?: 'Appointment', id: string, clientId: string, lawyerId: string, status: AppointmentStatus, chatRoomId?: string | null, price?: number | null, subscription: boolean, specializationId: string, createdAt?: string | null, endedAt?: string | null, notes?: string | null, slot: { __typename?: 'AvailableDay', day: string, startTime: string, endTime: string, booked: boolean }, specialization?: { __typename?: 'Specialization', _id: string, lawyerId: string, specializationId: string, categoryName?: string | null, subscription: boolean, pricePerHour?: number | null } | null } | null> | null };

export type GetAppointmentsByUserQueryVariables = Exact<{
  clientId: Scalars['String']['input'];
}>;


export type GetAppointmentsByUserQuery = { __typename?: 'Query', getAppointmentsByUser?: Array<{ __typename?: 'Appointment', id: string, clientId: string, lawyerId: string, status: AppointmentStatus, chatRoomId?: string | null, price?: number | null, subscription: boolean, specializationId: string, createdAt?: string | null, endedAt?: string | null, notes?: string | null, slot: { __typename?: 'AvailableDay', day: string, startTime: string, endTime: string, booked: boolean }, specialization?: { __typename?: 'Specialization', _id: string, lawyerId: string, specializationId: string, categoryName?: string | null, subscription: boolean, pricePerHour?: number | null } | null } | null> | null };

export type SaveChatHistoryMutationVariables = Exact<{
  input: ChatHistoryInput;
}>;


export type SaveChatHistoryMutation = { __typename?: 'Mutation', saveChatHistory: { __typename?: 'ChatHistory', _id: string, userId: string, sessionId: string, userMessage: string, botResponse: any, createdAt: string } };

export type GetChatHistoryByUserQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetChatHistoryByUserQuery = { __typename?: 'Query', getChatHistoryByUser: Array<{ __typename?: 'ChatHistory', _id: string, userId: string, sessionId: string, userMessage: string, botResponse: any, createdAt: string }> };

export type GetLawyerByIdQueryVariables = Exact<{
  lawyerId: Scalars['ID']['input'];
}>;


export type GetLawyerByIdQuery = { __typename?: 'Query', getLawyerById?: { __typename?: 'Lawyer', _id: string, lawyerId: string, clerkUserId?: string | null, clientId?: string | null, firstName: string, lastName: string, email: string, licenseNumber: string, bio?: string | null, university?: string | null, status?: LawyerRequestStatus | null, document?: string | null, rating?: number | null, profilePicture: string, createdAt: any, updatedAt?: any | null, specialization: Array<{ __typename?: 'Specialization', _id: string, lawyerId: string, specializationId: string, categoryName?: string | null, subscription: boolean, pricePerHour?: number | null }>, achievements: Array<{ __typename?: 'Achievement', _id: string, title: string, description: string, threshold: number, icon?: string | null }> } | null };

export type GetReviewsByLawyerQueryVariables = Exact<{
  lawyerId: Scalars['ID']['input'];
}>;


export type GetReviewsByLawyerQuery = { __typename?: 'Query', getReviewsByLawyer: Array<{ __typename?: 'Review', id: string, clientId: string, lawyerId: string, rating: number, comment?: string | null, createdAt: any, updatedAt: any }> };

export type GetReviewsByUserQueryVariables = Exact<{
  clientId: Scalars['ID']['input'];
}>;


export type GetReviewsByUserQuery = { __typename?: 'Query', getReviewsByUser: Array<{ __typename?: 'Review', id: string, clientId: string, lawyerId: string, rating: number, comment?: string | null, createdAt: any, updatedAt: any }> };

export type CreateReviewMutationVariables = Exact<{
  clientId: Scalars['ID']['input'];
  lawyerId: Scalars['ID']['input'];
  input: CreateReviewInput;
}>;


export type CreateReviewMutation = { __typename?: 'Mutation', createReview: { __typename?: 'Review', id: string, clientId: string, lawyerId: string, rating: number, comment?: string | null, createdAt: any, updatedAt: any } };

export type UpdateReviewMutationVariables = Exact<{
  reviewId: Scalars['ID']['input'];
  input: UpdateReviewInput;
}>;


export type UpdateReviewMutation = { __typename?: 'Mutation', updateReview: { __typename?: 'Review', id: string, clientId: string, lawyerId: string, rating: number, comment?: string | null, createdAt: any, updatedAt: any } };

export type DeleteReviewMutationVariables = Exact<{
  reviewId: Scalars['ID']['input'];
}>;


export type DeleteReviewMutation = { __typename?: 'Mutation', deleteReview: boolean };

export type CreateSpecializationMutationVariables = Exact<{
  input?: InputMaybe<SpecializationInput>;
}>;


export type CreateSpecializationMutation = { __typename?: 'Mutation', createSpecialization: Array<{ __typename?: 'Specialization', _id: string, lawyerId: string, specializationId: string, subscription: boolean, pricePerHour?: number | null } | null> };


export const GetAdminSpecializationsDocument = gql`
    query GetAdminSpecializations {
  getAdminSpecializations {
    id
    categoryName
  }
}
    `;

/**
 * __useGetAdminSpecializationsQuery__
 *
 * To run a query within a React component, call `useGetAdminSpecializationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminSpecializationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminSpecializationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAdminSpecializationsQuery(baseOptions?: Apollo.QueryHookOptions<GetAdminSpecializationsQuery, GetAdminSpecializationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAdminSpecializationsQuery, GetAdminSpecializationsQueryVariables>(GetAdminSpecializationsDocument, options);
      }
export function useGetAdminSpecializationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAdminSpecializationsQuery, GetAdminSpecializationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAdminSpecializationsQuery, GetAdminSpecializationsQueryVariables>(GetAdminSpecializationsDocument, options);
        }
export function useGetAdminSpecializationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAdminSpecializationsQuery, GetAdminSpecializationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAdminSpecializationsQuery, GetAdminSpecializationsQueryVariables>(GetAdminSpecializationsDocument, options);
        }
export type GetAdminSpecializationsQueryHookResult = ReturnType<typeof useGetAdminSpecializationsQuery>;
export type GetAdminSpecializationsLazyQueryHookResult = ReturnType<typeof useGetAdminSpecializationsLazyQuery>;
export type GetAdminSpecializationsSuspenseQueryHookResult = ReturnType<typeof useGetAdminSpecializationsSuspenseQuery>;
export type GetAdminSpecializationsQueryResult = Apollo.QueryResult<GetAdminSpecializationsQuery, GetAdminSpecializationsQueryVariables>;
export const CreateAppointmentDocument = gql`
    mutation CreateAppointment($input: CreateAppointmentInput!) {
  createAppointment(input: $input) {
    id
    clientId
    lawyerId
    status
    chatRoomId
    subscription
    slot {
      day
      startTime
      endTime
      booked
    }
    specialization {
      _id
      lawyerId
      specializationId
      categoryName
      subscription
      pricePerHour
    }
    notes
    specializationId
  }
}
    `;
export type CreateAppointmentMutationFn = Apollo.MutationFunction<CreateAppointmentMutation, CreateAppointmentMutationVariables>;

/**
 * __useCreateAppointmentMutation__
 *
 * To run a mutation, you first call `useCreateAppointmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAppointmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAppointmentMutation, { data, loading, error }] = useCreateAppointmentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAppointmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateAppointmentMutation, CreateAppointmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAppointmentMutation, CreateAppointmentMutationVariables>(CreateAppointmentDocument, options);
      }
export type CreateAppointmentMutationHookResult = ReturnType<typeof useCreateAppointmentMutation>;
export type CreateAppointmentMutationResult = Apollo.MutationResult<CreateAppointmentMutation>;
export type CreateAppointmentMutationOptions = Apollo.BaseMutationOptions<CreateAppointmentMutation, CreateAppointmentMutationVariables>;
export const GetAppointmentsByLawyerDocument = gql`
    query GetAppointmentsByLawyer($lawyerId: String!) {
  getAppointmentsByLawyer(lawyerId: $lawyerId) {
    id
    clientId
    lawyerId
    status
    chatRoomId
    price
    subscription
    specializationId
    slot {
      day
      startTime
      endTime
      booked
    }
    specialization {
      _id
      lawyerId
      specializationId
      categoryName
      subscription
      pricePerHour
    }
    createdAt
    endedAt
    notes
  }
}
    `;

/**
 * __useGetAppointmentsByLawyerQuery__
 *
 * To run a query within a React component, call `useGetAppointmentsByLawyerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppointmentsByLawyerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppointmentsByLawyerQuery({
 *   variables: {
 *      lawyerId: // value for 'lawyerId'
 *   },
 * });
 */
export function useGetAppointmentsByLawyerQuery(baseOptions: Apollo.QueryHookOptions<GetAppointmentsByLawyerQuery, GetAppointmentsByLawyerQueryVariables> & ({ variables: GetAppointmentsByLawyerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAppointmentsByLawyerQuery, GetAppointmentsByLawyerQueryVariables>(GetAppointmentsByLawyerDocument, options);
      }
export function useGetAppointmentsByLawyerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAppointmentsByLawyerQuery, GetAppointmentsByLawyerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAppointmentsByLawyerQuery, GetAppointmentsByLawyerQueryVariables>(GetAppointmentsByLawyerDocument, options);
        }
export function useGetAppointmentsByLawyerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAppointmentsByLawyerQuery, GetAppointmentsByLawyerQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAppointmentsByLawyerQuery, GetAppointmentsByLawyerQueryVariables>(GetAppointmentsByLawyerDocument, options);
        }
export type GetAppointmentsByLawyerQueryHookResult = ReturnType<typeof useGetAppointmentsByLawyerQuery>;
export type GetAppointmentsByLawyerLazyQueryHookResult = ReturnType<typeof useGetAppointmentsByLawyerLazyQuery>;
export type GetAppointmentsByLawyerSuspenseQueryHookResult = ReturnType<typeof useGetAppointmentsByLawyerSuspenseQuery>;
export type GetAppointmentsByLawyerQueryResult = Apollo.QueryResult<GetAppointmentsByLawyerQuery, GetAppointmentsByLawyerQueryVariables>;
export const GetAppointmentsByUserDocument = gql`
    query GetAppointmentsByUser($clientId: String!) {
  getAppointmentsByUser(clientId: $clientId) {
    id
    clientId
    lawyerId
    status
    chatRoomId
    price
    subscription
    specializationId
    slot {
      day
      startTime
      endTime
      booked
    }
    specialization {
      _id
      lawyerId
      specializationId
      categoryName
      subscription
      pricePerHour
    }
    createdAt
    endedAt
    notes
  }
}
    `;

/**
 * __useGetAppointmentsByUserQuery__
 *
 * To run a query within a React component, call `useGetAppointmentsByUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppointmentsByUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppointmentsByUserQuery({
 *   variables: {
 *      clientId: // value for 'clientId'
 *   },
 * });
 */
export function useGetAppointmentsByUserQuery(baseOptions: Apollo.QueryHookOptions<GetAppointmentsByUserQuery, GetAppointmentsByUserQueryVariables> & ({ variables: GetAppointmentsByUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAppointmentsByUserQuery, GetAppointmentsByUserQueryVariables>(GetAppointmentsByUserDocument, options);
      }
export function useGetAppointmentsByUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAppointmentsByUserQuery, GetAppointmentsByUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAppointmentsByUserQuery, GetAppointmentsByUserQueryVariables>(GetAppointmentsByUserDocument, options);
        }
export function useGetAppointmentsByUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAppointmentsByUserQuery, GetAppointmentsByUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAppointmentsByUserQuery, GetAppointmentsByUserQueryVariables>(GetAppointmentsByUserDocument, options);
        }
export type GetAppointmentsByUserQueryHookResult = ReturnType<typeof useGetAppointmentsByUserQuery>;
export type GetAppointmentsByUserLazyQueryHookResult = ReturnType<typeof useGetAppointmentsByUserLazyQuery>;
export type GetAppointmentsByUserSuspenseQueryHookResult = ReturnType<typeof useGetAppointmentsByUserSuspenseQuery>;
export type GetAppointmentsByUserQueryResult = Apollo.QueryResult<GetAppointmentsByUserQuery, GetAppointmentsByUserQueryVariables>;
export const SaveChatHistoryDocument = gql`
    mutation SaveChatHistory($input: ChatHistoryInput!) {
  saveChatHistory(input: $input) {
    _id
    userId
    sessionId
    userMessage
    botResponse
    createdAt
  }
}
    `;
export type SaveChatHistoryMutationFn = Apollo.MutationFunction<SaveChatHistoryMutation, SaveChatHistoryMutationVariables>;

/**
 * __useSaveChatHistoryMutation__
 *
 * To run a mutation, you first call `useSaveChatHistoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveChatHistoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveChatHistoryMutation, { data, loading, error }] = useSaveChatHistoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSaveChatHistoryMutation(baseOptions?: Apollo.MutationHookOptions<SaveChatHistoryMutation, SaveChatHistoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveChatHistoryMutation, SaveChatHistoryMutationVariables>(SaveChatHistoryDocument, options);
      }
export type SaveChatHistoryMutationHookResult = ReturnType<typeof useSaveChatHistoryMutation>;
export type SaveChatHistoryMutationResult = Apollo.MutationResult<SaveChatHistoryMutation>;
export type SaveChatHistoryMutationOptions = Apollo.BaseMutationOptions<SaveChatHistoryMutation, SaveChatHistoryMutationVariables>;
export const GetChatHistoryByUserDocument = gql`
    query GetChatHistoryByUser($userId: String!) {
  getChatHistoryByUser(userId: $userId) {
    _id
    userId
    sessionId
    userMessage
    botResponse
    createdAt
  }
}
    `;

/**
 * __useGetChatHistoryByUserQuery__
 *
 * To run a query within a React component, call `useGetChatHistoryByUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChatHistoryByUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChatHistoryByUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetChatHistoryByUserQuery(baseOptions: Apollo.QueryHookOptions<GetChatHistoryByUserQuery, GetChatHistoryByUserQueryVariables> & ({ variables: GetChatHistoryByUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChatHistoryByUserQuery, GetChatHistoryByUserQueryVariables>(GetChatHistoryByUserDocument, options);
      }
export function useGetChatHistoryByUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChatHistoryByUserQuery, GetChatHistoryByUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChatHistoryByUserQuery, GetChatHistoryByUserQueryVariables>(GetChatHistoryByUserDocument, options);
        }
export function useGetChatHistoryByUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetChatHistoryByUserQuery, GetChatHistoryByUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetChatHistoryByUserQuery, GetChatHistoryByUserQueryVariables>(GetChatHistoryByUserDocument, options);
        }
export type GetChatHistoryByUserQueryHookResult = ReturnType<typeof useGetChatHistoryByUserQuery>;
export type GetChatHistoryByUserLazyQueryHookResult = ReturnType<typeof useGetChatHistoryByUserLazyQuery>;
export type GetChatHistoryByUserSuspenseQueryHookResult = ReturnType<typeof useGetChatHistoryByUserSuspenseQuery>;
export type GetChatHistoryByUserQueryResult = Apollo.QueryResult<GetChatHistoryByUserQuery, GetChatHistoryByUserQueryVariables>;
export const GetLawyerByIdDocument = gql`
    query GetLawyerById($lawyerId: ID!) {
  getLawyerById(lawyerId: $lawyerId) {
    _id
    lawyerId
    clerkUserId
    clientId
    firstName
    lastName
    email
    licenseNumber
    bio
    university
    specialization {
      _id
      lawyerId
      specializationId
      categoryName
      subscription
      pricePerHour
    }
    achievements {
      _id
      title
      description
      threshold
      icon
    }
    status
    document
    rating
    profilePicture
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetLawyerByIdQuery__
 *
 * To run a query within a React component, call `useGetLawyerByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLawyerByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLawyerByIdQuery({
 *   variables: {
 *      lawyerId: // value for 'lawyerId'
 *   },
 * });
 */
export function useGetLawyerByIdQuery(baseOptions: Apollo.QueryHookOptions<GetLawyerByIdQuery, GetLawyerByIdQueryVariables> & ({ variables: GetLawyerByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLawyerByIdQuery, GetLawyerByIdQueryVariables>(GetLawyerByIdDocument, options);
      }
export function useGetLawyerByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLawyerByIdQuery, GetLawyerByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLawyerByIdQuery, GetLawyerByIdQueryVariables>(GetLawyerByIdDocument, options);
        }
export function useGetLawyerByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLawyerByIdQuery, GetLawyerByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLawyerByIdQuery, GetLawyerByIdQueryVariables>(GetLawyerByIdDocument, options);
        }
export type GetLawyerByIdQueryHookResult = ReturnType<typeof useGetLawyerByIdQuery>;
export type GetLawyerByIdLazyQueryHookResult = ReturnType<typeof useGetLawyerByIdLazyQuery>;
export type GetLawyerByIdSuspenseQueryHookResult = ReturnType<typeof useGetLawyerByIdSuspenseQuery>;
export type GetLawyerByIdQueryResult = Apollo.QueryResult<GetLawyerByIdQuery, GetLawyerByIdQueryVariables>;
export const GetReviewsByLawyerDocument = gql`
    query GetReviewsByLawyer($lawyerId: ID!) {
  getReviewsByLawyer(lawyerId: $lawyerId) {
    id
    clientId
    lawyerId
    rating
    comment
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetReviewsByLawyerQuery__
 *
 * To run a query within a React component, call `useGetReviewsByLawyerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReviewsByLawyerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReviewsByLawyerQuery({
 *   variables: {
 *      lawyerId: // value for 'lawyerId'
 *   },
 * });
 */
export function useGetReviewsByLawyerQuery(baseOptions: Apollo.QueryHookOptions<GetReviewsByLawyerQuery, GetReviewsByLawyerQueryVariables> & ({ variables: GetReviewsByLawyerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReviewsByLawyerQuery, GetReviewsByLawyerQueryVariables>(GetReviewsByLawyerDocument, options);
      }
export function useGetReviewsByLawyerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReviewsByLawyerQuery, GetReviewsByLawyerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReviewsByLawyerQuery, GetReviewsByLawyerQueryVariables>(GetReviewsByLawyerDocument, options);
        }
export function useGetReviewsByLawyerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetReviewsByLawyerQuery, GetReviewsByLawyerQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetReviewsByLawyerQuery, GetReviewsByLawyerQueryVariables>(GetReviewsByLawyerDocument, options);
        }
export type GetReviewsByLawyerQueryHookResult = ReturnType<typeof useGetReviewsByLawyerQuery>;
export type GetReviewsByLawyerLazyQueryHookResult = ReturnType<typeof useGetReviewsByLawyerLazyQuery>;
export type GetReviewsByLawyerSuspenseQueryHookResult = ReturnType<typeof useGetReviewsByLawyerSuspenseQuery>;
export type GetReviewsByLawyerQueryResult = Apollo.QueryResult<GetReviewsByLawyerQuery, GetReviewsByLawyerQueryVariables>;
export const GetReviewsByUserDocument = gql`
    query GetReviewsByUser($clientId: ID!) {
  getReviewsByUser(clientId: $clientId) {
    id
    clientId
    lawyerId
    rating
    comment
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetReviewsByUserQuery__
 *
 * To run a query within a React component, call `useGetReviewsByUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReviewsByUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReviewsByUserQuery({
 *   variables: {
 *      clientId: // value for 'clientId'
 *   },
 * });
 */
export function useGetReviewsByUserQuery(baseOptions: Apollo.QueryHookOptions<GetReviewsByUserQuery, GetReviewsByUserQueryVariables> & ({ variables: GetReviewsByUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReviewsByUserQuery, GetReviewsByUserQueryVariables>(GetReviewsByUserDocument, options);
      }
export function useGetReviewsByUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReviewsByUserQuery, GetReviewsByUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReviewsByUserQuery, GetReviewsByUserQueryVariables>(GetReviewsByUserDocument, options);
        }
export function useGetReviewsByUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetReviewsByUserQuery, GetReviewsByUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetReviewsByUserQuery, GetReviewsByUserQueryVariables>(GetReviewsByUserDocument, options);
        }
export type GetReviewsByUserQueryHookResult = ReturnType<typeof useGetReviewsByUserQuery>;
export type GetReviewsByUserLazyQueryHookResult = ReturnType<typeof useGetReviewsByUserLazyQuery>;
export type GetReviewsByUserSuspenseQueryHookResult = ReturnType<typeof useGetReviewsByUserSuspenseQuery>;
export type GetReviewsByUserQueryResult = Apollo.QueryResult<GetReviewsByUserQuery, GetReviewsByUserQueryVariables>;
export const CreateReviewDocument = gql`
    mutation CreateReview($clientId: ID!, $lawyerId: ID!, $input: CreateReviewInput!) {
  createReview(clientId: $clientId, lawyerId: $lawyerId, input: $input) {
    id
    clientId
    lawyerId
    rating
    comment
    createdAt
    updatedAt
  }
}
    `;
export type CreateReviewMutationFn = Apollo.MutationFunction<CreateReviewMutation, CreateReviewMutationVariables>;

/**
 * __useCreateReviewMutation__
 *
 * To run a mutation, you first call `useCreateReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReviewMutation, { data, loading, error }] = useCreateReviewMutation({
 *   variables: {
 *      clientId: // value for 'clientId'
 *      lawyerId: // value for 'lawyerId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateReviewMutation(baseOptions?: Apollo.MutationHookOptions<CreateReviewMutation, CreateReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateReviewMutation, CreateReviewMutationVariables>(CreateReviewDocument, options);
      }
export type CreateReviewMutationHookResult = ReturnType<typeof useCreateReviewMutation>;
export type CreateReviewMutationResult = Apollo.MutationResult<CreateReviewMutation>;
export type CreateReviewMutationOptions = Apollo.BaseMutationOptions<CreateReviewMutation, CreateReviewMutationVariables>;
export const UpdateReviewDocument = gql`
    mutation UpdateReview($reviewId: ID!, $input: UpdateReviewInput!) {
  updateReview(reviewId: $reviewId, input: $input) {
    id
    clientId
    lawyerId
    rating
    comment
    createdAt
    updatedAt
  }
}
    `;
export type UpdateReviewMutationFn = Apollo.MutationFunction<UpdateReviewMutation, UpdateReviewMutationVariables>;

/**
 * __useUpdateReviewMutation__
 *
 * To run a mutation, you first call `useUpdateReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReviewMutation, { data, loading, error }] = useUpdateReviewMutation({
 *   variables: {
 *      reviewId: // value for 'reviewId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateReviewMutation(baseOptions?: Apollo.MutationHookOptions<UpdateReviewMutation, UpdateReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateReviewMutation, UpdateReviewMutationVariables>(UpdateReviewDocument, options);
      }
export type UpdateReviewMutationHookResult = ReturnType<typeof useUpdateReviewMutation>;
export type UpdateReviewMutationResult = Apollo.MutationResult<UpdateReviewMutation>;
export type UpdateReviewMutationOptions = Apollo.BaseMutationOptions<UpdateReviewMutation, UpdateReviewMutationVariables>;
export const DeleteReviewDocument = gql`
    mutation DeleteReview($reviewId: ID!) {
  deleteReview(reviewId: $reviewId)
}
    `;
export type DeleteReviewMutationFn = Apollo.MutationFunction<DeleteReviewMutation, DeleteReviewMutationVariables>;

/**
 * __useDeleteReviewMutation__
 *
 * To run a mutation, you first call `useDeleteReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReviewMutation, { data, loading, error }] = useDeleteReviewMutation({
 *   variables: {
 *      reviewId: // value for 'reviewId'
 *   },
 * });
 */
export function useDeleteReviewMutation(baseOptions?: Apollo.MutationHookOptions<DeleteReviewMutation, DeleteReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteReviewMutation, DeleteReviewMutationVariables>(DeleteReviewDocument, options);
      }
export type DeleteReviewMutationHookResult = ReturnType<typeof useDeleteReviewMutation>;
export type DeleteReviewMutationResult = Apollo.MutationResult<DeleteReviewMutation>;
export type DeleteReviewMutationOptions = Apollo.BaseMutationOptions<DeleteReviewMutation, DeleteReviewMutationVariables>;
export const CreateSpecializationDocument = gql`
    mutation CreateSpecialization($input: SpecializationInput) {
  createSpecialization(input: $input) {
    _id
    lawyerId
    specializationId
    subscription
    pricePerHour
  }
}
    `;
export type CreateSpecializationMutationFn = Apollo.MutationFunction<CreateSpecializationMutation, CreateSpecializationMutationVariables>;

/**
 * __useCreateSpecializationMutation__
 *
 * To run a mutation, you first call `useCreateSpecializationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSpecializationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSpecializationMutation, { data, loading, error }] = useCreateSpecializationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSpecializationMutation(baseOptions?: Apollo.MutationHookOptions<CreateSpecializationMutation, CreateSpecializationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSpecializationMutation, CreateSpecializationMutationVariables>(CreateSpecializationDocument, options);
      }
export type CreateSpecializationMutationHookResult = ReturnType<typeof useCreateSpecializationMutation>;
export type CreateSpecializationMutationResult = Apollo.MutationResult<CreateSpecializationMutation>;
export type CreateSpecializationMutationOptions = Apollo.BaseMutationOptions<CreateSpecializationMutation, CreateSpecializationMutationVariables>;