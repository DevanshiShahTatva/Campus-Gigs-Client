export interface IApiResponse {
  content: string;
  createdAt: string;
  updatedAt: string;
  id: number;
}
export interface ITCResponse {
  success: boolean;
  data: IApiResponse[];
}
