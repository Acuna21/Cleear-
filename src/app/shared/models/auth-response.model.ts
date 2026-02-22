export interface IAuthDTO {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    image: string;
  }
}

export interface UserLogin {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    image: string;
  }
}
