//---------- User -----------
export interface ILoginRequest {
  identifier: string,
  password: string,
}

export interface IRegisterRequest {
  name: string,
  username: string,
  password: string,
  mobile: string,
}
