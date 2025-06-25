
export interface ISupportRequest {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    responded?: boolean;
    status?:string;
    _id: string;
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