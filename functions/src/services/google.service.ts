import {OAuth2Client} from 'google-auth-library';
import {firebaseConfig, functionsURL} from '../firebase';

export class GoogleService {
  config = firebaseConfig.google;
  scopes: string[] = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/calendar.readonly'
  ];

  newClient() { // Creates a new client
    return new OAuth2Client(this.config.client_id, this.config.client_secret, functionsURL + 'auth-redirect');
  }

  static extractConferenceData({conferenceData, description}: { conferenceData: any, description: string }) {
    if (conferenceData) {
      return {
        type: conferenceData.conferenceSolution.key.type,
        id: conferenceData.conferenceId,
        url: conferenceData.entryPoints[0].uri
      };
    }

    if (description) {
      // Zoom
      const zoomMatch = description.match(/https:\/\/zoom\.us\/j\/(\d*)/);
      if (zoomMatch) {
        return {
          type: 'zoom',
          id: zoomMatch[1],
          url: zoomMatch[0]
        };
      }
    }

    return null;
  }

  static async getCalendarEvents(client: OAuth2Client, minDate: Date, maxDate: Date) {
    let url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    url += `?timeMin=${minDate.toISOString()}`;
    url += `&timeMax=${maxDate.toISOString()}`;
    const res: any = await client.request({url});
    const events = res.data.items;

    return events.map((event: any) => ({
      summary: event.summary,
      status: event.status,
      start: event.start.dateTime,
      end: event.end.dateTime,
      conference: GoogleService.extractConferenceData(event)
    }));
  }
}

export const googleService = new GoogleService();
