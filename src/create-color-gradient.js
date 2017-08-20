import { range } from 'lodash';

export default function makeColorGradient({
  frequencies = [],
  phases = [],
  center = 128,
  width = 127,
  length = 50,
}) {
  console.log(frequencies)

  return range(length).map((_, index) => {
    const [r, g, b] = [
      Math.round(Math.sin((frequencies[0] * index) + phases[0]) * width + center),
      Math.round(Math.sin((frequencies[1] * index) + phases[1]) * width + center),
      Math.round(Math.sin((frequencies[2] * index) + phases[2]) * width + center),
    ];

    return `rgb(${r},${g},${b})`;
  });
}
