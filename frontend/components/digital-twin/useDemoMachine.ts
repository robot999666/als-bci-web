"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getTargetPose } from "./motion";
import {
  INITIAL_POSE,
  type DemoCommand,
  type DemoPhase,
  type RuntimeTimeline,
  type WheelchairPose,
} from "./types";

const PHASE_SEQUENCE: DemoPhase[] = [
  "imagining",
  "acquiring",
  "transmitting",
  "processing",
  "classified",
  "executing",
];

const PHASE_DURATION: Record<DemoPhase, number> = {
  idle: 0,
  imagining: 1050,
  acquiring: 1050,
  transmitting: 1250,
  processing: 1400,
  classified: 850,
  executing: 1650,
  complete: 0,
};

const EMPTY_RUNTIME: RuntimeTimeline = {
  phase: "idle",
  command: null,
  progress: 0,
  startedAt: 0,
  duration: 0,
  runId: 0,
};

export function useDemoMachine() {
  const timelineRef = useRef<RuntimeTimeline>({ ...EMPTY_RUNTIME });
  const frameRef = useRef<number | null>(null);
  const busyRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const poseRef = useRef<WheelchairPose>({ ...INITIAL_POSE });
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [command, setCommand] = useState<DemoCommand | null>(null);
  const [pose, setPose] = useState<WheelchairPose>({ ...INITIAL_POSE });
  const [resetToken, setResetToken] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const cancelFrame = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotionRef.current = media.matches;
      setReducedMotion(media.matches);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => cancelFrame, [cancelFrame]);

  const start = useCallback(
    (nextCommand: DemoCommand) => {
      if (busyRef.current) return;

      cancelFrame();
      busyRef.current = true;
      const runId = timelineRef.current.runId + 1;
      const durationScale = reducedMotionRef.current ? 0.38 : 1;

      const enterPhase = (nextPhase: DemoPhase, now: number) => {
        const duration = PHASE_DURATION[nextPhase] * durationScale;
        timelineRef.current = {
          phase: nextPhase,
          command: nextCommand,
          progress: 0,
          startedAt: now,
          duration,
          runId,
        };
        setPhase(nextPhase);
      };

      const tick = (now: number) => {
        const runtime = timelineRef.current;
        if (runtime.runId !== runId || !busyRef.current) return;

        runtime.progress = Math.min(
          1,
          (now - runtime.startedAt) / Math.max(1, runtime.duration),
        );

        if (runtime.progress >= 1) {
          const index = PHASE_SEQUENCE.indexOf(runtime.phase);
          if (index === PHASE_SEQUENCE.length - 1) {
            const nextPose = getTargetPose(poseRef.current, nextCommand.id);
            poseRef.current = nextPose;
            setPose(nextPose);
            timelineRef.current = {
              phase: "complete",
              command: nextCommand,
              progress: 1,
              startedAt: now,
              duration: 0,
              runId,
            };
            busyRef.current = false;
            setPhase("complete");
            setCompletedCount((value) => value + 1);
            frameRef.current = null;
            return;
          }

          enterPhase(PHASE_SEQUENCE[index + 1], now);
        }

        frameRef.current = requestAnimationFrame(tick);
      };

      setCommand(nextCommand);
      enterPhase("imagining", performance.now());
      frameRef.current = requestAnimationFrame(tick);
    },
    [cancelFrame],
  );

  const reset = useCallback(() => {
    cancelFrame();
    busyRef.current = false;
    poseRef.current = { ...INITIAL_POSE };
    timelineRef.current = {
      ...EMPTY_RUNTIME,
      runId: timelineRef.current.runId + 1,
    };
    setPose({ ...INITIAL_POSE });
    setPhase("idle");
    setCommand(null);
    setCompletedCount(0);
    setResetToken((value) => value + 1);
  }, [cancelFrame]);

  const isRunning = phase !== "idle" && phase !== "complete";

  return {
    phase,
    command,
    pose,
    resetToken,
    completedCount,
    reducedMotion,
    timelineRef,
    isRunning,
    start,
    reset,
  };
}
