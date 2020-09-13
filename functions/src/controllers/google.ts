import * as express from 'express';
import * as functions from 'firebase-functions';
import * as cors from 'cors';
import {authMiddleware} from '../middlewares/auth.middleware';
import {errorMiddleware} from '../middlewares/error.middleware';
import {GoogleService, googleService} from '../services/google.service';

export class GoogleController {
  oAuth2Client = googleService.newClient();

  authorizeReq(req: express.Request, res: express.Response) {
    res.set('Cache-Control', 'private, max-age=0, s-maxage=0');

    res.redirect(this.oAuth2Client.generateAuthUrl({
      // Both prompt consent and access type offline needed to get refresh_token
      access_type: 'offline',
      prompt: 'consent',
      scope: googleService.scopes
    }));
  }

  async redirectReq(req: express.Request, res: express.Response): Promise<void> {
    res.set('Cache-Control', 'private, max-age=0, s-maxage=0');

    const code = req.query.code as string;
    if (!code) {
      res.status(400).send('Missing code');
      return;
    }

    try {
      // tokens will contain the refresh token
      const {tokens} = await this.oAuth2Client.getToken(code);
      const message = JSON.stringify({tokens});
      res.status(200).send(`
        <script>
          window.opener.postMessage(${message}, "*");
          window.close();
        </script>
      `);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async calendarRequest(req: express.Request, res: express.Response): Promise<void> {
    const minDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const maxDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const events = await GoogleService.getCalendarEvents(req.authClient, minDate, maxDate);

    res.json(events);
  }

  exportAuth() {
    return {
      authorize: functions.https.onRequest(this.authorizeReq.bind(this)),
      redirect: functions.https.onRequest(this.redirectReq.bind(this)),
    };
  }

  exportCalendarApp() {
    const app = express();
    app.use(cors({origin: true, credentials: true})); // Allow cross-origin requests
    app.use(authMiddleware); // Add authorization
    app.get('/', this.calendarRequest.bind(this));
    app.use(errorMiddleware); // Handle errors

    return app;
  }

  exportService() {
    return {
      calendar: functions.https.onRequest(this.exportCalendarApp()),
    };
  }
}
