export interface IApiResponse {
  content: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
}
export interface IPrivacyPolicyResponse {
  success: boolean;
  data: IApiResponse[];
}
