import {admin} from '../firebase';

export class UsersService {
  static collection = admin.firestore().collection('users');

  /**
   * Get user reference by id
   */
  static userRef(id: string) {
    return UsersService.collection.doc(id);
  }

  /**
   * Update access token
   */
  static async updateToken(id: string, access_token: string, expiry_date: number) {
    const ref = UsersService.userRef(id);
    return ref.update({
      'token.access_token': access_token,
      'token.expiry_date': expiry_date
    });
  }
}
