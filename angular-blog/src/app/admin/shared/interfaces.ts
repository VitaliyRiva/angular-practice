export  interface User {
  email: string,
  password: string,
  returnSecureToken?: boolean
}

export interface FbAuth {
  idToken?: string,
  expiresIn?: string
}
