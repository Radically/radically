// types for the objects returned from the loadIDS worker

type BaseRadicals = string[];
interface StrokeCount {
  [key: string]: number;
}

interface Readings {
  [key: string]: {
    [key: string]: string;
  };
}
