import { useEffect, useRef } from 'react';

type DitherDirection =
  | 'bottom-up'
  | 'top-down'
  | 'left-right'
  | 'right-left'
  | 'bottom-left'
  | 'bottom-right'
  | 'radial';

type DitherPattern = 'noise' | 'bayer' | 'bayer-inverted' | 'checker';

type PixelDitherProps = {
  fillColor?: string;
  direction?: DitherDirection;
  pattern?: DitherPattern;
  seed?: number;
  erosionWeight?: number;
  startWeight?: number;
  inverse?: boolean;
  pixelSize?: number;
  className?: string;
};

const bayer = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function seededNoise(x: number, y: number, seed: number) {
  let value = (0x165667b1 * x + 0x27d4eb2f * y + 0x7fffffff * seed) | 0;
  value = (value ^ (value >>> 13)) * 0x4bf19f61;
  return (((value ^ (value >>> 16)) >>> 0) % 1024) / 1024;
}

function resolveCssColor(color: string, element: HTMLElement | null) {
  if (!color.startsWith('var(') || !element) return color;

  const match = color.match(/var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)/);
  if (!match) return color;

  return getComputedStyle(element).getPropertyValue(match[1]).trim() || match[2]?.trim() || color;
}

function directionWeight(
  direction: DitherDirection,
  col: number,
  row: number,
  cols: number,
  rows: number
) {
  const centerCol = (cols - 1) / 2;
  const centerRow = (rows - 1) / 2;
  const radius = Math.hypot(centerCol, centerRow) || 1;

  switch (direction) {
    case 'top-down':
      return rows > 1 ? row / (rows - 1) : 0;
    case 'left-right':
      return cols > 1 ? 1 - col / (cols - 1) : 0;
    case 'right-left':
      return cols > 1 ? col / (cols - 1) : 0;
    case 'radial':
      return 1 - Math.hypot(col - centerCol, row - centerRow) / radius;
    case 'bottom-right':
      return 1 - ((cols > 1 ? col / (cols - 1) : 0) + (rows > 1 ? row / (rows - 1) : 0)) / 2;
    case 'bottom-left':
      return ((cols > 1 ? col / (cols - 1) : 0) + (1 - (rows > 1 ? row / (rows - 1) : 0))) / 2;
    case 'bottom-up':
    default:
      return rows > 1 ? 1 - row / (rows - 1) : 0;
  }
}

function patternWeight(pattern: DitherPattern, col: number, row: number, seed: number) {
  const seededCol = col + seed;
  const seededRow = row + 3 * seed;

  switch (pattern) {
    case 'bayer-inverted':
      return 1 - bayer[seededRow % 4][seededCol % 4] / 16;
    case 'checker':
      return (seededCol + seededRow) % 2 === 0 ? 0.25 : 0.75;
    case 'noise':
      return seededNoise(col, row, seed);
    case 'bayer':
    default:
      return bayer[seededRow % 4][seededCol % 4] / 16;
  }
}

export function PixelDither({
  fillColor = 'var(--bg-dark)',
  direction = 'bottom-up',
  pattern = 'noise',
  seed = 0,
  erosionWeight = 0.78,
  startWeight = -0.5,
  inverse = false,
  pixelSize = 16,
  className = '',
}: PixelDitherProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const context = canvas?.getContext('2d');
    if (!canvas || !parent || !context) return;

    let thresholds = new Float32Array();
    let metrics = { cols: 0, rows: 0, width: 0, height: 0, dpr: 1 };
    let raf = 0;
    let currentProgress = 0;

    const draw = (scrollProgress: number) => {
      if (!thresholds.length) return;

      const normalized = clamp((scrollProgress - startWeight) / (1 - startWeight));
      const { cols, rows, width, height, dpr } = metrics;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = resolveCssColor(fillColor, parent);

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const threshold = thresholds[row * cols + col];
          const shouldFill = inverse ? normalized <= threshold : normalized > threshold;
          if (shouldFill) {
            context.fillRect(col * pixelSize, row * pixelSize, pixelSize + 1, pixelSize + 1);
          }
        }
      }
    };

    const measure = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.ceil(rect.width));
      const height = Math.max(1, Math.ceil(rect.height));
      const cols = Math.ceil(width / pixelSize);
      const rows = Math.ceil(height / pixelSize);
      const noiseShare = 1 - erosionWeight;
      const nextThresholds = new Float32Array(cols * rows);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const directional = directionWeight(direction, col, row, cols, rows);
          const noisy = patternWeight(pattern, col, row, seed);
          nextThresholds[row * cols + col] = directional * erosionWeight + noisy * noiseShare;
        }
      }

      thresholds = nextThresholds;
      metrics = { cols, rows, width, height, dpr };
      draw(currentProgress);
    };

    const updateProgress = () => {
      const rect = parent.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      currentProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      draw(currentProgress);
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateProgress);
    };

    measure();
    updateProgress();

    const resizeObserver = new ResizeObserver(() => {
      measure();
      updateProgress();
    });

    resizeObserver.observe(parent);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [direction, erosionWeight, fillColor, inverse, pattern, pixelSize, seed, startWeight]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
