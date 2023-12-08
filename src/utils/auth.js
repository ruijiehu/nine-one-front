import Cookies from 'js-cookie'

/** headers中token的键值 */
export const TokenKey = 'nineone-token'
/** storag中储存token的键值 */
const TokenStorageKey = 'Admin-Token'

const storage = localStorage
export function getToken() {
  return storage.getItem(TokenStorageKey)
}

export function setToken(token) {
  return storage.setItem(TokenStorageKey, token)
}

export function removeToken() {
  return storage.removeItem(TokenStorageKey)
}
