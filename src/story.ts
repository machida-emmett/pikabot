// import { testScenes } from './storys/testStory';
import { txt1 } from './storys/txt1';
import { txt2 } from './storys/txt2';
import { pikaBot } from './storys/pikaBot';

export type Scene<T extends string = string> = {
  text: string;
  choices: {
    label: string;
    nextId: T;
  }[];
  next?: T;
};

export const scenes = {
  // ...testScenes,
  ...pikaBot
} as const;


export type SceneId = keyof typeof scenes;
