export interface UserModel {
  success: boolean;
  data: UserList[];
  total: number;
  page: number;
  pageSize: number;
  statusCode: number;
}

export interface UserList {
  id: number;
  userName: string;
  password: string;
  role: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  status: string;
}
