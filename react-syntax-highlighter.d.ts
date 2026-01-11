declare module 'react-syntax-highlighter' {
  import { ReactNode } from 'react';
  
  export const Prism: React.ComponentType<any>;
  export const Light: React.ComponentType<any>;
  export const PrismAsyncLight: React.ComponentType<any>;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const dracula: any;
  export const github: any;
  export const googlecode: any;
  export const atom: any;
  export const monokai: any;
  export const tomorrow: any;
  export const twilight: any;
  export const xcode: any;
}

declare module 'react-syntax-highlighter/dist/cjs/styles/prism' {
  export const dracula: any;
  export const github: any;
  export const googlecode: any;
  export const atom: any;
  export const monokai: any;
  export const tomorrow: any;
  export const twilight: any;
  export const xcode: any;
}
