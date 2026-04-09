export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password && password.length >= 6
}

export const validateQuery = (query) => {
  return query && query.trim().length > 0
}

export const validateLimit = (limit) => {
  const num = parseInt(limit)
  return !isNaN(num) && num >= 1 && num <= 500
}