import {Request, RequestHandler} from 'express';
import {UsersService} from '../services/users.service';
import {AuthorizationError, NotFoundError} from '../utils/errors';
import {admin} from '../firebase';
import {googleService} from '../services/google.service';

const getAuthToken = (req: Request) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  throw new AuthorizationError('No valid authorization header');
};

/**
 * Authentication middleware when using firebase id tokens
 */
export const authMiddleware: RequestHandler = async (req, res, next) => {
  const token = getAuthToken(req);

  try {
    req.authId = await admin.auth().verifyIdToken(token);
    req.uid = req.authId.uid;
  } catch (e) {
    throw new AuthorizationError('Firebase ID token is invalid');
  }

  try {
    req.userSnapshot = await UsersService.userRef(req.uid).get();


    const dbToken = req.userSnapshot.get('token');
    req.authClient = googleService.newClient();
    req.authClient.setCredentials(dbToken);
    const tokenRes = await req.authClient.getAccessToken();
    if (dbToken.access_token !== tokenRes.token) {
      const newToken = tokenRes.token as string;
      const tokenInfo = await req.authClient.getTokenInfo(newToken);
      await UsersService.updateToken(req.uid, newToken, tokenInfo.expiry_date);
    }

  } catch (e) {
    throw new NotFoundError('user');
  }

  next();
};
