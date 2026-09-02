"use client";

import { useMemo, useRef } from "react";
import { Html, Line, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type {
  DemoCommand,
  DemoPhase,
  TimelineRef,
  WheelchairPose,
} from "./types";

interface SignalAndModelProps {
  timelineRef: TimelineRef;
  phase: DemoPhase;
  command: DemoCommand | null;
  pose: WheelchairPose;
  reducedMotion: boolean;
}

const PROCESSOR_X = 3.35;

function EegWave({ origin }: { origin: THREE.Vector3 }) {
  const points = useMemo(() => {
    return Array.from({ length: 42 }, (_, index) => {
      const t = index / 41;
      return new THREE.Vector3(
        origin.x + t * 1.65,
        origin.y + Math.sin(t * Math.PI * 8) * 0.12 * (1 - t * 0.3),
        origin.z - 0.52 - t * 0.18,
      );
    });
  }, [origin]);

  return (
    <Line
      points={points}
      color="#67e8f9"
      lineWidth={2}
      transparent
      opacity={0.85}
    />
  );
}

function SignalFlow({
  timelineRef,
  phase,
  pose,
  reducedMotion,
}: Omit<SignalAndModelProps, "command">) {
  const particlesRef = useRef<Array<THREE.Mesh | null>>([]);
  const origin = useMemo(
    () => new THREE.Vector3(-2.8 + pose.x, 2.96, pose.z + 0.2),
    [pose.x, pose.z],
  );
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        origin,
        new THREE.Vector3(origin.x + 1.15, 3.3, origin.z - 0.45),
        new THREE.Vector3(0.25, 2.65, -0.9),
        new THREE.Vector3(1.85, 2.15, -0.45),
        new THREE.Vector3(PROCESSOR_X - 0.78, 1.85, 0),
      ]),
    [origin],
  );

  useFrame(({ clock }) => {
    const active = timelineRef.current.phase === "transmitting";
    particlesRef.current.forEach((particle, index) => {
      if (!particle) return;
      particle.visible = active;
      if (!active) return;
      const speed = reducedMotion ? 0.2 : 0.34;
      const progress = (clock.elapsedTime * speed + index / particlesRef.current.length) % 1;
      particle.position.copy(curve.getPointAt(progress));
    });
  });

  const signalVisible =
    phase === "acquiring" || phase === "transmitting" || phase === "processing";

  return (
    <group>
      {phase === "acquiring" ? <EegWave origin={origin} /> : null}
      <mesh visible={signalVisible}>
        <tubeGeometry args={[curve, 48, 0.022, 6, false]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={phase === "transmitting" ? 0.72 : 0.2}
        />
      </mesh>
      {Array.from({ length: reducedMotion ? 5 : 9 }, (_, index) => (
        <mesh
          key={index}
          ref={(node) => {
            particlesRef.current[index] = node;
          }}
          visible={false}
        >
          <sphereGeometry args={[0.055, 8, 6]} />
          <meshBasicMaterial color="#a5f3fc" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

const MODEL_STEPS = ["EEG", "FBCSP", "LDA", "四分类意图"];

function ModelProcessor({ phase }: { phase: DemoPhase }) {
  const scanRef = useRef<THREE.Mesh>(null);
  const processing = phase === "processing";

  useFrame(({ clock }) => {
    if (!scanRef.current) return;
    scanRef.current.visible = processing;
    if (processing) {
      scanRef.current.position.y = 0.95 - ((clock.elapsedTime * 0.85) % 1) * 2;
    }
  });

  return (
    <group position={[PROCESSOR_X, 1.72, 0]} rotation={[0, Math.PI, 0]}>
      <RoundedBox args={[1.82, 3.25, 0.72]} radius={0.12} smoothness={4}>
        <meshStandardMaterial
          color="#071827"
          emissive="#0e7490"
          emissiveIntensity={processing ? 0.72 : 0.18}
          metalness={0.58}
          roughness={0.35}
          transparent
          opacity={0.94}
        />
      </RoundedBox>
      <mesh ref={scanRef} position={[0, 0.9, 0.39]} visible={false}>
        <planeGeometry args={[1.55, 0.055]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.92} toneMapped={false} />
      </mesh>
      {MODEL_STEPS.map((label, index) => {
        const y = 1.03 - index * 0.69;
        const outputActive =
          index === MODEL_STEPS.length - 1 &&
          (phase === "classified" || phase === "executing" || phase === "complete");
        return (
          <group key={label} position={[0, y, 0.47]}>
            <RoundedBox args={[1.38, 0.46, 0.13]} radius={0.06} smoothness={3}>
              <meshStandardMaterial
                color={outputActive ? "#0e7490" : "#10253b"}
                emissive={outputActive || processing ? "#0891b2" : "#0f172a"}
                emissiveIntensity={outputActive ? 1.4 : processing ? 0.62 : 0.16}
                metalness={0.42}
                roughness={0.44}
              />
            </RoundedBox>
            <Html center transform distanceFactor={7.2} position={[0, 0, 0.09]}>
              <span className="pointer-events-none whitespace-nowrap text-[11px] font-semibold tracking-[0.08em] text-cyan-50">
                {label}
              </span>
            </Html>
          </group>
        );
      })}
      <Html center position={[0, 1.93, 0]}>
        <div className="pointer-events-none whitespace-nowrap rounded-full border border-cyan-400/25 bg-slate-950/85 px-3 py-1 text-[10px] font-semibold tracking-[0.12em] text-cyan-200">
          意图识别模型
        </div>
      </Html>
    </group>
  );
}

function InstructionOutput({
  phase,
  command,
}: Pick<SignalAndModelProps, "phase" | "command">) {
  const visible =
    command &&
    (phase === "classified" || phase === "executing" || phase === "complete");
  if (!visible || !command) return null;

  const stop = command.id === "stop";
  return (
    <group position={[3.35, 4.05, 0]}>
      <mesh>
        <boxGeometry args={[2.25, 0.75, 0.16]} />
        <meshStandardMaterial
          color={stop ? "#3f1020" : "#083344"}
          emissive={stop ? "#e11d48" : "#06b6d4"}
          emissiveIntensity={1.15}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>
      <Html center position={[0, 0, 0.12]}>
        <div className="pointer-events-none min-w-36 whitespace-nowrap text-center">
          <p className={stop ? "text-rose-200" : "text-cyan-100"}>
            <span className="text-[10px] font-semibold tracking-[0.16em]">{command.intentEn}</span>
            <span className="mx-2 text-slate-500">/</span>
            <span className="text-sm font-bold">{command.intent}</span>
          </p>
        </div>
      </Html>
    </group>
  );
}

export default function SignalAndModel(props: SignalAndModelProps) {
  return (
    <group name="bci-signal-and-model">
      <SignalFlow
        timelineRef={props.timelineRef}
        phase={props.phase}
        pose={props.pose}
        reducedMotion={props.reducedMotion}
      />
      <ModelProcessor phase={props.phase} />
      <InstructionOutput phase={props.phase} command={props.command} />
    </group>
  );
}
