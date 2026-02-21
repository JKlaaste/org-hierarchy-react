declare module 'he' {
  interface DecodeOptions {
    isAttributeValue?: boolean;
    strict?: boolean;
  }

  interface EncodeOptions {
    useNamedReferences?: boolean;
    decimal?: boolean;
    encodeEverything?: boolean;
    strict?: boolean;
    allowUnsafeSymbols?: boolean;
  }

  export function decode(html: string, options?: DecodeOptions): string;
  export function encode(str: string, options?: EncodeOptions): string;
  export function escape(str: string): string;
  export function unescape(str: string): string;
}
