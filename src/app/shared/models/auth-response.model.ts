import { Role } from "@enums/role";

export interface IAuthDTO {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: Role;
    image: string;
  }
}

export interface UserLogin {
  accessToken: string;
  refreshToken: string;
  user: UserAuth
}

export interface UserAuth {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  image: string;
}
