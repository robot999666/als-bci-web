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
  return {
    x: Math.sin(yaw) * distance,
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

  const turnProgress = easeInOut(Math.min(1, progress / 0.58));
  const moveProgress = easeInOut(Math.max(0, (progress - 0.32) / 0.68));
  return {
    x: start.x + (target.x - start.x) * moveProgress,
    z: start.z + (target.z - start.z) * moveProgress,
    yaw: start.yaw + (target.yaw - start.yaw) * turnProgress,
  };
}
