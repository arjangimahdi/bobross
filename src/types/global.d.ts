export interface BobRossConfig {
  animate: boolean,
  disablePan: boolean,
  disableZoom: boolean,
  disableX: boolean,
  disableY: boolean,
  maxScale: number,
  minScale: number,
  overflow: 'hidden' | 'scroll',
  startX: number,
  startY: number,
  startScale: number,
}

export interface TriangleValues {
  x: number
  y: number
  scale: number
}