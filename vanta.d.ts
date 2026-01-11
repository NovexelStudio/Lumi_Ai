declare module 'vanta/dist/vanta.birds.min' {
  import * as THREE from 'three';
  
  interface VantaEffect {
    destroy: () => void;
  }

  interface BirdsOptions {
    el: HTMLElement | null;
    THREE: typeof THREE;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    birdSize?: number;
    quantity?: number;
    backgroundColor?: number;
  }

  const BIRDS: {
    (options: BirdsOptions): VantaEffect;
    default?: (options: BirdsOptions) => VantaEffect;
  };

  export default BIRDS;
}

declare module 'three' {
  export * from 'three';
}
