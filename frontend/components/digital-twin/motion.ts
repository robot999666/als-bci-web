import type { CommandId, WheelchairPose } from "./types";

const TURN_ANGLE = Math.PI / 4;
const TURN_DISTANCE = 1.45;
const FORWARD_DISTANCE = 2.1;

function easeInOut(value: number) {
  const clamped = Math.min(1, Math.max(0, value));
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
}

function forwardOffset(yaw: number, distance: number) {
  // 轮椅模型的局部车头朝向为 -Z。Three.js 绕 Y 轴旋转后，
  // 对应的世界坐标前向量是 (-sin(yaw), 0, -cos(yaw))。
  return {
    x: -Math.sin(yaw) * distance,
    z: -Math.cos(yaw) * distance,
  };
}

export function getTargetPose(
  start: WheelchairPose,
  command: CommandId,
): WheelchairPose {
  if (command === "stop") {
    return { ...start };
  }

  const targetYaw =
    command === "left"
      ? start.yaw + TURN_ANGLE
      : command === "right"
        ? start.yaw - TURN_ANGLE
        : start.yaw;
  const distance = command === "forward" ? FORWARD_DISTANCE : TURN_DISTANCE;
  const offset = forwardOffset(targetYaw, distance);

  return {
    x: start.x + offset.x,
    z: start.z + offset.z,
    yaw: targetYaw,
  };
}

export function getAnimatedPose(
  start: WheelchairPose,
  command: CommandId,
  progress: number,
): WheelchairPose {
  if (command === "stop") {
    return { ...start };
  }

  const target = getTargetPose(start, command);
  if (command === "forward") {
    const movement = easeInOut(progress);
    return {
      x: start.x + (target.x - start.x) * movement,
      z: start.z + (target.z - start.z) * movement,
      yaw: start.yaw,
    };
  }

  // 转弯动作分成两个连续阶段：先原地完成 45° 转向，再沿车头方向前进。
  // 避免旋转和位移大幅重叠时产生视觉上的侧滑。
  const turnProgress = easeInOut(Math.min(1, progress / 0.45));
  const moveProgress = easeInOut(Math.max(0, (progress - 0.45) / 0.55));
  return {
    x: start.x + (target.x - start.x) * moveProgress,
    z: start.z + (target.z - start.z) * moveProgress,
    yaw: start.yaw + (target.yaw - start.yaw) * turnProgress,
  };
}
