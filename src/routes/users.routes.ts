import { Router } from 'express'
import {
  emailVerifyValidatorController,
  forgotPasswordController,
  loginController,
  logoutController,
  registerController
} from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import rateLimit from 'express-rate-limit'

const usersRouter = Router()

/**
 * Middleware giới hạn số lần gọi API để chống brute-force attack
 */
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 15, // Tối đa 15 request trong 15 phút
  message: { error: 'Too many login attempts, please try again later.' }
})

/**
 * @module routes/users
 */

/**
 * Đăng nhập người dùng
 * @route POST /users/login
 * @group Users - Quản lý xác thực người dùng
 * @param {string} req.body.email - Email của người dùng
 * @param {string} req.body.password - Mật khẩu của người dùng
 * @returns {Object} 200 - Đăng nhập thành công, trả về token
 * @returns {Error}  400 - Dữ liệu không hợp lệ
 * @returns {Error}  401 - Sai email hoặc mật khẩu
 * @returns {Error}  429 - Quá nhiều lần thử đăng nhập, hãy thử lại sau
 */
usersRouter.post('/login', loginRateLimiter, loginValidator, wrapRequestHandler(loginController))

/**
 * Đăng ký tài khoản mới
 * @route POST /users/register
 * @group Users - Quản lý xác thực người dùng
 * @param {string} req.body.email - Email của người dùng
 * @param {string} req.body.password - Mật khẩu của người dùng
 * @param {string} req.body.username - Tên hiển thị của người dùng
 * @returns {Object} 201 - Đăng ký thành công, trả về thông tin user
 * @returns {Error}  400 - Dữ liệu không hợp lệ
 * @returns {Error}  409 - Email đã tồn tại
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: {refresh_token: string}
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: Verify email when user client click on the link in email
 * Path: /verify-email
 * Method: POST
 * Body: {email_verify_token: string}
 *
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(emailVerifyValidatorController))

/**
 * Description: forgot password when user click
 * Path: /forgot-password
 * Method: POST
 * Body: {email: string}
 *
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

export default usersRouter
