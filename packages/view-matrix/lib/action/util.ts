import { Matrix } from "pixi.js";
import type { ActionStruct, ActionValue, BaseActionValue, StandardAction, StandardActionStruct, StandardActionValue } from ".";
import { a2r } from "../../../core";

export function standardize(struct: ActionStruct): StandardActionStruct {
  const standard: StandardActionStruct = {};
  for (const stateIndex of Object.keys(struct)) {
    const v1 = struct[stateIndex];
    const v1ed = {} as StandardActionStruct[number | string];
    for (const comtIndex of Object.keys(v1)) {
      const v2 = v1[comtIndex];
      const v2ed = {} as StandardAction;
      const len = v2ed.length = v2.frames?.[v2.frames?.length - 1] || v2.value.length;
      const fs: StandardActionValue[] = [];
      if (!v2.frames) {
        for (let i = 1; i <= len; i++) {
          fs.push(standardizeValue(v2.value[i]));
        }
      } else {
        // console.log(v2.frames)
        for (let i = 1; i <= len; i++) {
          let endIndex = v2.frames.findIndex(v => v >= i);
          // console.log(v2.frames)
          if (endIndex === -1) {
            fs.push(new Matrix());
            continue;
          }
          let startIndex = endIndex - 1;
          const progress = (i - v2.frames[startIndex]) / (v2.frames[endIndex] - v2.frames[startIndex]);
          // console.log(i, v2.frames)
          const v = standardizeValueMix(v2.value[startIndex], v2.value[endIndex], progress);
          fs.push(v);
        }
      }
      v1ed[comtIndex] = {
        length: len,
        value: fs
      };
    }
    standard[stateIndex] = v1ed;
  }
  return standard;
}
function standardizeValue(v1: ActionValue): StandardActionValue {
  if (v1 instanceof Function) {
    return v1;
  } else if (typeof v1[0] === 'number') {
    return standardizeOnly(v1 as BaseActionValue);
  }
  console.warn('convert transform error, use default');
  return new Matrix();
}
function standardizeOnly(v: BaseActionValue): Matrix {
  switch (v.length) {
    case 2: {
      return new Matrix(1, 0, 0, 1, v[0], v[1]);
    }
    case 3: {
      return new Matrix().rotate(a2r(v[2])).translate(v[0], v[1]);
    }
    case 4: {
      return new Matrix().rotate(a2r(v[2])).translate(v[0], v[1]).scale(v[3] ? -1 : 1, 1);
    }
    case 5: {
      return new Matrix().scale(v[3], v[4]).rotate(a2r(v[2])).translate(v[0], v[1]);
    }
  }
  console.warn('convert transform error, use default');
  return new Matrix();
}

function standardizeValueMix(v1: ActionValue, v2: ActionValue, delta: number): StandardActionValue {
  // console.log(v1, v2, delta)
  if (v1 instanceof Function) return v1;
  if (v2 instanceof Function) return v2;
  if (delta === 0) return standardizeOnly(v1);
  if (delta === 1) return standardizeOnly(v2);
  let x1 = 0, y1 = 0, angle1 = 0, scaleX1 = 1, scaleY1 = 1;
  let x2 = 0, y2 = 0, angle2 = 0, scaleX2 = 1, scaleY2 = 1;
  x1 = v1[0];
  y1 = v1[1];
  v1.length > 2 && (angle1 = v1[2]!);
  v1.length == 4 && (scaleX1 = v1[3] ? -1 : 1);
  if (v1.length == 5) {
    scaleX1 = v1[3];
    scaleY1 = v1[4];
  }
  x2 = v2[0];
  y2 = v2[1];
  v2.length > 2 && (angle2 = v2[2]!);
  v2.length == 4 && (scaleX2 = v2[3] ? -2 : 2);
  if (v2.length == 5) {
    scaleX2 = v2[3];
    scaleY2 = v2[4];
  }
  const x = mix(x1, x2, delta);
  const y = mix(y1, y2, delta);
  const angle = mix(angle1, angle2, delta);
  const scaleX = mix(scaleX1, scaleX2, delta);
  const scaleY = mix(scaleY1, scaleY2, delta);
  return new Matrix().scale(scaleX, scaleY).rotate(a2r(angle)).translate(x, y);
}
function mix(a: number, b: number, delta: number) {
  return (1 - delta) * a + b * delta;
}