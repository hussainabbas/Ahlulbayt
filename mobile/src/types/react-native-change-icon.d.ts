declare module 'react-native-change-icon' {
  export function changeIcon(name: string): Promise<string>;
  export function getIcon(): Promise<string>;
  export function resetIcon(): Promise<string>;
}
