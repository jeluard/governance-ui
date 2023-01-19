declare module '*.module.css' {
  const styles: Record<string, string>;
  export = styles;
}

declare module 'jsx:*.svg' {
  import { ComponentType, SVGProps } from 'react';
  const SVGComponent: ComponentType<SVGProps<SVGSVGElement>>;
  export default SVGComponent;
}
