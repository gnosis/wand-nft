const CONFIG = {
  SEGMENT: {
    percBorder: 0.91,
    percThickness: 0.05,
    angleGap: 2,
  },
  FILLER: {
    percBorder: 0.9,
    percThickness: 0.07,
    angleGap: 0.7,
  },
};

export const VIEWBOX_WIDTH = 1000;
export const VIEWBOX_HEIGHT = 1000;
export const SEGMENTS_WIDE = segments(12);
export const SEGMENTS_NARROW = segments(24);
export const FILLERS_WIDE = fillers(12);
export const FILLERS_NARROW = fillers(24);

function segments(count: number) {
  let result: string[] = [];

  const arcSize = 360 / count;
  const { percBorder, percThickness, angleGap } = CONFIG.SEGMENT;
  const [outerRadius, innerRadius] = radius(percBorder, percThickness);

  for (let i = 0; i < count; i++) {
    const midway = i * arcSize;
    const left = midway - arcSize / 2 + angleGap;
    const right = midway + arcSize / 2 - angleGap;
    result = [...result, path(left, right, outerRadius, innerRadius)];
  }
  return result;
}

function fillers(count: number) {
  let result: string[] = [];

  const arcSize = 360 / count;
  const { percBorder, percThickness, angleGap } = CONFIG.FILLER;
  const [outerRadius, innerRadius] = radius(percBorder, percThickness);

  for (let i = 0; i < count; i++) {
    const midway = i * arcSize + arcSize / 2;
    const left = midway - angleGap;
    const right = midway + angleGap;
    result = [...result, path(left, right, outerRadius, innerRadius)];
  }

  return result;
}

function path(
  startAngle: number,
  endAngle: number,
  radiusOuter: number,
  radiusInner: number
): string {
  const upperLeft = coordinates(radiusOuter, startAngle);
  const lowerRight = coordinates(radiusInner, endAngle);

  return [
    "M",
    upperLeft.x,
    upperLeft.y,
    ...arc(radiusOuter, endAngle, true),
    "L",
    lowerRight.x,
    lowerRight.y,
    ...arc(radiusInner, startAngle, false),
    "L",
    upperLeft.x,
    upperLeft.y,
  ].join(" ");
}

function arc(radius: number, angle: number, direction: boolean) {
  const end = coordinates(radius, angle);

  const largeArcFlag = "0";
  const sweepArcFlag = direction ? "1" : "0";

  return ["A", radius, radius, 0, largeArcFlag, sweepArcFlag, end.x, end.y];
}

function radius(percBorder: number, percThickness: number) {
  const outer = (VIEWBOX_WIDTH - VIEWBOX_WIDTH * percBorder * 2) / 2;
  const inner =
    (VIEWBOX_WIDTH -
      VIEWBOX_WIDTH * percBorder * 2 -
      VIEWBOX_WIDTH * percThickness * 2) /
    2;

  return [outer, inner];
}

function coordinates(radius: number, degrees: number) {
  const radians = ((degrees - 90) * Math.PI) / 180.0;

  const center = { x: VIEWBOX_WIDTH / 2, y: VIEWBOX_HEIGHT / 2 };

  return {
    x: center.x + radius * Math.cos(radians),
    y: center.y + radius * Math.sin(radians),
  };
}
