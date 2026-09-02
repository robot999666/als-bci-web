"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import type {
  DemoCommand,
  DemoPhase,
  TimelineRef,
  WheelchairPose,
} from "./types";
import SignalAndModel from "./SignalAndModel";
import WheelchairRig from "./WheelchairRig";

interface BciSceneProps {
  timelineRef: TimelineRef;
  phase: DemoPhase;
  command: DemoCommand | null;
  pose: WheelchairPose;
  resetToken: number;
  reducedMotion: boolean;
  compact: boolean;
  isRunning: boolean;
}

function DirectionReferences() {
  return (
    <group position={[0, 0.012, 0]}>
      <Line
        points={[
          [-5.1, 0, 0],
          [1.7, 0, 0],
        ]}
        color="#155e75"
        transparent
        opacity={0.6}
        lineWidth={1}
      />
      {[-4.2, -2.2, -0.2].map((x) => (
        <group key={x} position={[x, 0, -1.55]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[0.18, 0.25, 3]} />
            <meshBasicMaterial color="#0e7490" transparent opacity={0.55} />
          </mesh>
        </group>
      ))}
      <Html position={[-4.55, 0.08, -2.05]} center>
        <span className="pointer-events-none whitespace-nowrap text-[9px] font-medium tracking-[0.12em] text-cyan-300/55">
          辅助终端运动区域
        </span>
      </Html>
    </group>
  );
}

function SceneContents(props: BciSceneProps) {
  const helmetActive = props.phase === "imagining" || props.phase === "acquiring";

  return (
    <>
      <color attach="background" args={["#030817"]} />
      <fog attach="fog" args={["#030817", 12, 24]} />
      <ambientLight intensity={0.9} color="#b9e6ff" />
      <hemisphereLight args={["#67e8f9", "#07111f", 0.65]} />
      <directionalLight position={[5, 9, 6]} intensity={2.2} color="#d8f3ff" />
      <pointLight position={[-2.8, 4.2, 1.5]} intensity={helmetActive ? 10 : 3.2} color="#22d3ee" distance={6} />
      <pointLight position={[3.35, 3.2, 1.8]} intensity={5} color="#0ea5e9" distance={7} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <planeGeometry args={[18, 14]} />
        <meshStandardMaterial color="#050d1a" metalness={0.25} roughness={0.84} />
      </mesh>
      <gridHelper args={[16, 32, "#155e75", "#0f2438"]} position={[0, 0, 0]} />
      <DirectionReferences />

      <WheelchairRig
        timelineRef={props.timelineRef}
        pose={props.pose}
        phase={props.phase}
        resetToken={props.resetToken}
        reducedMotion={props.reducedMotion}
        commandId={props.command?.id}
      />
      <SignalAndModel
        timelineRef={props.timelineRef}
        phase={props.phase}
        command={props.command}
        pose={props.pose}
        reducedMotion={props.reducedMotion}
      />

      {props.phase === "acquiring" ? (
        <Html position={[-2.8 + props.pose.x, 3.72, props.pose.z]} center>
          <div className="pointer-events-none whitespace-nowrap rounded-lg border border-cyan-400/30 bg-slate-950/88 px-3 py-1.5 text-center shadow-[0_0_30px_rgba(34,211,238,0.18)]">
            <p className="text-[10px] font-semibold tracking-[0.12em] text-cyan-200">EEG 脑电采集</p>
            <p className="text-[9px] text-slate-400">250 Hz · 流程示意</p>
          </div>
        </Html>
      ) : null}

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.075}
        minDistance={props.compact ? 8.4 : 7.4}
        maxDistance={15.5}
        minPolarAngle={0.52}
        maxPolarAngle={1.42}
        target={[0, 1.55, 0]}
      />
    </>
  );
}

export default function BciScene(props: BciSceneProps) {
  return (
    <Canvas
      camera={{ position: props.compact ? [9.7, 6.5, -12.2] : [8.7, 5.7, -10.2], fov: 42 }}
      dpr={props.compact ? [1, 1.2] : [1, 1.5]}
      frameloop={props.isRunning ? "always" : "demand"}
      gl={{ antialias: !props.compact, alpha: false, powerPreference: "high-performance" }}
      fallback={
        <div className="flex h-full items-center justify-center bg-slate-950 px-6 text-center text-sm text-slate-400">
          当前浏览器无法创建 WebGL 场景，请启用硬件加速后重试。
        </div>
      }
    >
      <Suspense fallback={null}>
        <SceneContents {...props} />
      </Suspense>
    </Canvas>
  );
}
