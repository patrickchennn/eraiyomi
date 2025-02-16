export interface User{
  _id: string
  username: string,
  name:string,
  email: string,
  profilePictureUrl: string,
  articleIdRef: string[]
}


export interface UserLoginRequestBody {
  username: string;
  email: string;
  password: string
}

export interface UserRegisterRequestBody{
  username: string;
  email: string;
  password: string
}