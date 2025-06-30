export interface IApiResponse {
  content: string;
  createdAt: string;
  updatedAt: string;
  id: number;
}
export interface IPrivacyPolicyResponse {
  success: boolean;
  data: IApiResponse[];
}
