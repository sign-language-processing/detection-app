import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const projectId = 'sign-language-detector';

admin.initializeApp({projectId: projectId});

const firebaseConfig = functions.config();

if (!firebaseConfig.google) {
  firebaseConfig.google = {
    client_id: '1012541058868-tspcg7ehicri3ketejj8q8leh7ckoimt.apps.googleusercontent.com',
    client_secret: '1wT7kZAQUoHbzwAOXWtTpWIo',
  };
}


const functionsURL = process.env.FIREBASE_CONFIG ?
  `https://us-central1-${projectId}.cloudfunctions.net/` :
  `http://localhost:5000/${projectId}/us-central1/`;

export {admin, firebaseConfig, functionsURL};
