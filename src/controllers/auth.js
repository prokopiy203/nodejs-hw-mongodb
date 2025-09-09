import { ONE_MOUTH } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
  resetPassword,
} from '../services/auth.js';
import { requestResetToken } from '../services/auth.js';
import createHttpError from 'http-errors';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res, next) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MOUTH),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MOUTH),
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully login!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MOUTH),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MOUTH),
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUserSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const requestResetEmailController = async (req, res, next) => {
  const email = req.body.email;

  if (email === null) {
    next(
      createHttpError(500, 'Failed to send the email, please try again later'),
    );
    return;
  }

  await requestResetToken(email);

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res, next) => {
  const user = await resetPassword(req.body);

  await SessionsCollection.deleteMany({
    userId: user._id,
  });

  res.json({
    status: 200,
    message: 'Password was successfully reset.',
    data: {},
  });
};
