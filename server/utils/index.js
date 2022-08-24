const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const createTokenUser = require('./createTokenUser');
const checkPermissions = require('./checkPermissions');
const sendVerificationEmail = require('./sendVerificationEmail');
const createHash = require('./createHash');
const sendResetPasswordEmail = require('./sendResetPasswordEmail');
const sendOrderSuccessEmail = require('./sendOrderSuccessEmail');
const sendMarketingEmail = require('./sendMarketingEmail');

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
  sendVerificationEmail,
  createHash,
  sendResetPasswordEmail,
  sendOrderSuccessEmail,
  sendMarketingEmail,
};
