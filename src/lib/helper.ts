interface Point {
  x: number;
  y: number;
}

export const randomNum = (arr: Array<number>, isInt: boolean) => {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const num = Math.random() * (max - min) + min;
  return isInt ? Math.round(num) : num;
}

export const randomColor = ()  => {
  return `rgb(${randomNum([0, 255], true)}, ${randomNum([0, 255], true)}, ${randomNum([0, 255], true)})`;
}

export const getDist = (p1: Point, p2: Point) => {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

export const getPosition = (element: HTMLElement): Point => {
  const mouse = {
    x: 0,
    y: 0,
  };
  element.addEventListener('mousemove', ({ pageX, pageY, target }) => {
    const { left, top } = (target as Element).getBoundingClientRect();
    mouse.x = pageX - left;
    mouse.y = pageY - top;
  });
  return mouse;
}

export const angle2Radian = (angle: number) => {
  return (angle * Math.PI) / 180;
}

export const radian2Angle = (radian: number) => {
  return (radian * 180) / Math.PI;
}
