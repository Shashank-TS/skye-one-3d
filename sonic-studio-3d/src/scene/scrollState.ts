export interface SceneMotionState {
  posX: number;
  posY: number;
  posZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
  explode: number;
  shadowScale: number;
  userRotX: number;
  userRotY: number;
  isDragging: boolean;
}

export const sceneMotionState: SceneMotionState = {
  posX: 0,
  posY: 0,
  posZ: 0,
  rotX: 0.08,
  rotY: -0.45,
  rotZ: 0,
  scale: 1,
  explode: 0,
  shadowScale: 1,
  userRotX: 0,
  userRotY: 0,
  isDragging: false,
};