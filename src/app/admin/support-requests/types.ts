export interface ISupportRequest {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  responded?: boolean;
  status?: string;
}

export interface ISupportRequestApiResponse {
  status: number;
  message: string;
  data: ISupportRequest[];
  meta: {
    page: number;
    pageSize: number;
    totalPages: number;
    total: number;
  };
}
