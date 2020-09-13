import './firebase';
import {GoogleController} from './controllers/google';

const google = new GoogleController();

module.exports = {
  auth: google.exportAuth(),
  google: google.exportService(),
};
