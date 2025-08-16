export interface LoginModel {
  action: string;
  payload: { userName: string; password: string; expectedRole: string };
}

export interface UserModel {
  id: number;
  userName: string;
  role: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  status: string;
}
