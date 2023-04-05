import BallDropSimulation from './eg/ball-drop-simulation';
import GravitationalSimulation from './eg/gravitational-simulation';

const DEMOS: {
  text: string;
  class: any;
  instance: null | BallDropSimulation | GravitationalSimulation;
}[] = [
  {
    text: '小球掉落模拟',
    class: BallDropSimulation,
    instance: null,
  },
  {
    text: '引力模拟',
    class: GravitationalSimulation,
    instance: null,
  },
];

let currentSelectedIndex = 0;

const selectChange = (e: any) => {
  const selectedIndex = e.target.selectedIndex;
  removeCanvas(currentSelectedIndex);
  currentSelectedIndex = selectedIndex;
  const canvas = createCanvas(selectedIndex);
  const demo = DEMOS[selectedIndex];
  const demoInstance = new demo.class({
    canvas,
  });
  demo.instance = demoInstance;
  demoInstance.run();
  currentSelectedIndex = selectedIndex;
};

const createCanvas = (selectedIndex: number) => {
  const canvas = document.createElement('canvas');
  canvas.id = `canvas${selectedIndex}`;
  const select = document.getElementById('select');
  document.body.insertBefore(canvas, select);
  return canvas;
};

const removeCanvas = (index: number) => {
  const demo = DEMOS[index];
  if (demo.instance) {
    demo.instance.destroy();
    demo.instance = null;
  }
  const canvas = document.getElementById(`canvas${index}`);
  canvas && document.body.removeChild(canvas);
};

(() => {
  const select = document.createElement('select');
  select.id = 'select';
  select.onchange = selectChange;
  DEMOS.forEach((demo, i) => {
    select.options[i] = new Option(demo.text, demo.text);
  });
  document.body.appendChild(select);
  const canvas = createCanvas(currentSelectedIndex);
  const demo = DEMOS[currentSelectedIndex];
  const demoInstance = new demo.class({
    canvas,
  });
  demo.instance = demoInstance;
  demoInstance.run();
})();
