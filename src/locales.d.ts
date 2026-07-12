declare module '*.po' {
  export const messages: Record<string, string>;
  const value: { messages: Record<string, string> };
  export default value;
}
