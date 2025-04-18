const USER_MESSAGES = Object.freeze({
  VALIDATION: 'Validation error',
  EMAIL_IS_REQUIRED: 'Invalid email address',
  EMAIL_IS_EXISTS: 'Email already exists',
  NAME_IS_STRING: 'Name must be a string',
  NAME_IS_REQUIRED: 'Name is required',
  USER_NOT_FOUND: 'User is not found',
  NAME_IS_NOT_VALID: 'Name must be between 4 and 100 characters',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_IS_NOT_VALID: 'Password must be between 4 and 50 characters',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_IS_NOT_VALID: 'Confirm password must be between 4 and 50 characters',
  CONFIRM_PASSWORD_IS_NOT_MATCH: 'Confirm password do not match with password',
  LOGIN_SUCCESS: 'Login success',
  LOGOUT_SUCCESS: 'Logout success',
  REGISTER_SUCCESS: 'Register success',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Refresh token is used or isn`t exist',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  EMAIL_VERIFY_SUCCESS: 'Email have verified successfully',
  USER_ALREADY_VERIFIED: 'Email have verified',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  FORGOT_PASSWORD_TOKEN_IS_NOT_FOUND: 'Forgot password token isn`t found',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password successfully, please create new password',
  GET_PROFILE_SUCCESS: 'Get personal profile successfully',
  USER_NOT_VERIFIED: 'User is not verified',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be ISO8601',
  BIO_MUST_BE_STRING: 'Bio must be string',
  BIO_LENGTH_IS_INVALID: 'Bio length must be between 4 to 100 characters',
  LOCATION_MUST_BE_STRING: 'Location must be string',
  LOCATION_LENGTH_IS_INVALID: 'Location length must be between 4 to 50 characters',
  WEBSITE_MUST_BE_STRING: 'Website must be string',
  WEBSITE_LENGTH_IS_INVALID: 'Website length must be between 4 to 200 characters',
  USERNAME_MUST_BE_STRING: 'Username must be string',
  USERNAME_LENGTH_IS_INVALID: 'Username length must be between 4 to 50 characters',
  IMAGE_MUST_BE_STRING: 'Image must be string',
  IMAGE_LENGTH_IS_INVALID: 'Image length must be between 4 to 50 characters',
  UPDATE_PROFILE_SUCCESS: 'Update profile successfully',
  GET_USER_SUCCESS: 'Get user by id successfully',
  FOLLOW_SUCCESS: 'You have followed this user successfully'
})

export default USER_MESSAGES
