export interface User{
  _id: string
  userId: string,
  username: string,
  name:string|undefined,
  email: string,
  profilePictureUrl: string,
  statusReq?:"fail"|"success"|"loading"
}
export type UserRes = Omit<User, "statusReq">;


export interface GoogleIdentityRes{
  aud:string,
  azp:string,
  email:string,
  email_verified:boolean,
  exp:number,
  given_name:string,
  iat:number,
  iss:string,
  jti:string,
  name:string,
  nbf:number,
  picture:string,
  sub:string,
  family_name: string
}

export interface ReqBodyLoginTraditional {
  username: string;
  email: string;
  password: string
}

export interface ReqBodyRegisterUser{
  username: string;
  email: string;
  password: string
}