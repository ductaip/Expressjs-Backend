const USER_MESSAGES = Object.freeze({
  VALIDATION: 'Validation error',
  EMAIL_IS_REQUIRED: 'Invalid email address',
  EMAIL_IS_EXISTS: 'Email already exists',
  USERNAME_IS_STRING: 'Username must be a string',
  USERNAME_IS_REQUIRED: 'Username is required',
  USER_NOT_FOUND: 'Email is not found',
  USERNAME_IS_NOT_VALID: 'Username must be between 4 and 100 characters',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_IS_NOT_VALID: 'Password must be between 4 and 50 characters',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_IS_NOT_VALID: 'Confirm password must be between 4 and 50 characters',
  CONFIRM_PASSWORD_IS_NOT_MATCH: 'Confirm password do not match with password',
  LOGIN_SUCCESS: 'Login success',
  REGISTER_SUCCESS: 'Register success'
})

export default USER_MESSAGES
