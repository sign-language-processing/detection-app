import {Injectable} from '@angular/core';
import {BasePoseModel, Pose} from './models/base.pose-model';
import {PoseNetPoseModel} from './models/posenet.pose-model';
import {Hand} from '../../modules/ngxs/store/settings/settings.state';

@Injectable({
  providedIn: 'root'
})
export class PoseService {

  models: { [key: string]: BasePoseModel } = {
    fastPoseNet: new PoseNetPoseModel({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: {width: 266, height: 200},
      multiplier: 0.75
    }),
    slowPoseNet: new PoseNetPoseModel({
      architecture: 'ResNet50',
      outputStride: 32,
      inputResolution: {width: 266, height: 200},
      quantBytes: 2
    }),
  };

  model: BasePoseModel;

  constructor() {
    this.setModel('fastPoseNet');
  }

  async setModel(modelId: string): Promise<void> {
    if (this.model) {
      await this.model.unload();
    }
    if (!(modelId in this.models)) {
      throw new Error(`Specified model "${modelId}" is not configured`);
    }
    const model = this.models[modelId];
    await model.load();
    this.model = model;
  }

  predict(video: HTMLVideoElement, dominantHand: Hand): Promise<Pose> {
    if (!this.model) {
      return Promise.resolve(null);
    }
    return this.model.predict(video, dominantHand);
  }

}
