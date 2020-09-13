import {BasePoseModel, Pose, POSE_LENGTH} from './base.pose-model';
import '@tensorflow/tfjs-backend-webgl'; // Adds the WebGL backend to the global backend registry.
import * as posenet from '@tensorflow-models/posenet';
import {Keypoint, PoseNet} from '@tensorflow-models/posenet';
import {Hand} from '../../../modules/ngxs/store/settings/settings.state';
import {ModelConfig, SinglePersonInterfaceConfig} from '@tensorflow-models/posenet/dist/posenet_model';

const POSE_MAPPING = {
  nose: 0,
  leftEye: 16,
  rightEye: 15,
  leftEar: 18,
  rightEar: 17,
  leftShoulder: 5,
  rightShoulder: 2,
  leftElbow: 6,
  rightElbow: 3,
  leftWrist: 7,
  rightWrist: 4,
  leftHip: 12,
  rightHip: 9,
  leftKnee: 13,
  rightKnee: 10,
  leftAnkle: 14,
  rightAnkle: 11,
};

const POSE_ADITIONAL: [number, [number, number]][] = [
  [1, [2, 5]],
  [8, [9, 12]]
];


export class PoseNetPoseModel extends BasePoseModel {
  net: PoseNet;

  bbox: number[]; // Boundaries of pose estimation

  constructor(private modelConfig: ModelConfig) {
    super();
    // TODO unclear why need to divide by 2
    this.width = (modelConfig.inputResolution as any).width / 2;
    this.height = (modelConfig.inputResolution as any).height / 2;

    this.bbox = [
      this.width * 0.05, // Min X
      this.height * 0.05, // Min Y
      this.width * 0.95, // Max X
      this.height * 0.95, // Max Y
    ];
  }

  async load(): Promise<void> {
    if (this.net) {
      this.unload();
    }

    this.net = await posenet.load(this.modelConfig);
  }

  async unload(): Promise<void> {
    this.net.dispose();
    delete this.net;
  }

  processKeypoints(keypoints: Keypoint[]): Pose {
    const emptyPoint = {x: 0, y: 0};
    const pose: Pose = new Array(POSE_LENGTH).fill(emptyPoint);

    keypoints.forEach(({position, part}) => {
      const i = POSE_MAPPING[part];
      pose[i] = position;
    });

    // Additional calculated poses
    POSE_ADITIONAL.forEach(([i, [a, b]]) => {
      if (pose[a].x > 0 && pose[b].x > 0) {
        pose[i] = {
          x: (pose[a].x + pose[b].x) / 2,
          y: (pose[a].y + pose[b].y) / 2,
        };
      }
    });

    return pose;
  }

  keypointFilter({score, position}): boolean {
    return score > 0.8 &&
      position.x > this.bbox[0] && position.y > this.bbox[1] &&
      position.x < this.bbox[2] && position.y < this.bbox[3];
  }


  async predict(video: HTMLVideoElement, dominantHand: Hand): Promise<Pose> {
    const options: SinglePersonInterfaceConfig = {flipHorizontal: dominantHand === 'left'};
    const {keypoints} = await this.net.estimateSinglePose(video, options);
    const filteredKeypoints = keypoints.filter(this.keypointFilter.bind(this));
    return this.processKeypoints(filteredKeypoints);
  }
}
