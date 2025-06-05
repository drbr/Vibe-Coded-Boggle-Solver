import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type VariadicFunction<Args extends unknown[], Return> = (
  ...args: Args
) => Return;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function withTiming<Args extends unknown[], Return>(
  label: string,
  fn: VariadicFunction<Args, Return>,
  ...args: Args
): Return {
  console.time(label);
  const result = fn(...args);
  console.timeEnd(label);
  return result;
}
