import {Hand} from '../../../modules/ngxs/store/settings/settings.state';

export type Pose = { x: number, y: number }[];
export const POSE_LENGTH = 25;

export abstract class BasePoseModel {
  width: number;
  height: number;

  async load(): Promise<void> {
    /***
     * Load model to memory
     */
  }

  async unload(): Promise<void> {
    /***
     * Free GPU memory and other resources
     */
  }

  abstract async predict(video: HTMLVideoElement, dominantHand: Hand): Promise<Pose>;
}
