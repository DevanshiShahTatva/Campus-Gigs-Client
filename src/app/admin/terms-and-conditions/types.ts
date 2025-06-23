export interface IApiResponse {
    content: string;
    createdAt: string;
    updatedAt: string;
    _id: string;
}
export interface ITCResponse {
    success: boolean
    data: IApiResponse[]
}