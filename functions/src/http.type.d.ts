// tslint:disable-next-line:no-namespace

declare namespace Express {
  export interface Request {
    authId: import('firebase-admin').auth.DecodedIdToken;
    uid: string;
    userSnapshot: FirebaseFirestore.DocumentSnapshot;
    authClient: import('google-auth-library').OAuth2Client;
  }
}
