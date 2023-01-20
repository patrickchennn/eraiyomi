export interface Account{
  id: string,
  name: string,
  email: string,
  picture: string,
  isLoggedIn: boolean,
  token?: string,
}

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