import React from "react";
import classNames from "classnames";
import { HueGradient, LightnessGradient } from "./Gradient";
import DragRotate from "../DragRotate";
import useDragRotate from "../useDragRotate";
import styles from "./ColorPicker.module.css";

const SIZE = 1000;
const HUE_MARGIN = 0.124;
const LIGHTNESS_MARGIN = 0.5;

interface Props {
  value: number;
  onChange: (nextValue: number) => void;
}

export const HueArc = ({ value, onChange }: Props) => (
  <DragRotate value={value} onDragEnd={onChange}>
    {({ bind, rotation, hovering, dragging }) => (
      <g
        transform={`rotate(${rotation}, ${SIZE / 2}, ${SIZE / 2})`}
        className={classNames(styles.dragGroup, {
          [styles.hovering]: hovering,
        })}
      >
        <HueGradient />
        <path
          {...bind()}
          fill="none"
          stroke={"rgba(0,0,0,0)"}
          strokeWidth={90}
          d={HUE_D}
          className={classNames(styles.grabbableArc, {
            [styles.active]: dragging,
          })}
        />
        <circle
          cx="500"
          cy="500"
          r="434"
          fill="none"
          strokeWidth="65"
          strokeDasharray="7 7"
          className={styles.hueKnurl}
        />
      </g>
    )}
  </DragRotate>
);

export const LightnessArc = ({ value, onChange }: Props) => {
  const { bind, rotation, hovering, dragging } = useDragRotate<SVGPathElement>(
    value,
    onChange
  );
  return (
    <g
      transform={`rotate(${rotation}, ${SIZE / 2}, ${SIZE / 2})`}
      className={classNames(styles.dragGroup, {
        [styles.hovering]: hovering,
      })}
    >
      <LightnessGradient />
      <path
        fill="none"
        stroke={"url(#lightness-arc-gray-gradient)"}
        strokeWidth={40}
        d={LIGHTNESS_D}
        className={classNames(styles.grabbableArc)}
      />
      <path
        {...bind()}
        fill="none"
        stroke={"rgba(0,0,0,0)"}
        strokeWidth={85}
        d={LIGHTNESS_D}
        className={classNames(styles.grabbableArc, {
          [styles.active]: dragging,
        })}
        style={{
          transform: "scale(1)",
          transformBox: "fill-box",
          transformOrigin: "center",
        }}
      />
      <circle
        cx="500"
        cy="500"
        r="250"
        fill="none"
        strokeWidth="40"
        strokeDasharray="5 5"
        className={styles.lightnessKnurl}
      />
    </g>
  );
};

const HUE_D = arc(SIZE, HUE_MARGIN);
const LIGHTNESS_D = arc(SIZE, LIGHTNESS_MARGIN);

function arc(size: number, margin: number) {
  const radius = (size * (1 - margin)) / 2;

  const topCenter = { x: size / 2, y: size / 2 - radius };
  const bottomCenter = { x: size / 2, y: size / 2 + radius };

  let largeArcFlag = "0";
  let sweepArcFlag = "0";

  return [
    "M",
    topCenter.x,
    topCenter.y,
    ...[
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      sweepArcFlag,
      bottomCenter.x,
      bottomCenter.y,
    ],
    ...[
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      sweepArcFlag,
      topCenter.x,
      topCenter.y,
    ],
  ].join(" ");
}
