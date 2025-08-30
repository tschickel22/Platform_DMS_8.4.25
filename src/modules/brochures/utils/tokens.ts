export function generateToken(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function generatePublicId(): string {
  return `pub_${Date.now()}_${generateToken()}`
}

export function validateToken(token: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(token) && token.length >= 6
}