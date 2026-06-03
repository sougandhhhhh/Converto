declare module "libheif-js/wasm-bundle" {
  interface HeifImage {
    get_width(): number;
    get_height(): number;
    is_primary(): boolean;
    display(
      imageData: { data: Uint8ClampedArray; width: number; height: number },
      callback: (displayData: unknown) => void
    ): void;
    free(): void;
  }

  interface HeifDecoder {
    decode(buffer: Uint8Array): HeifImage[];
  }

  interface HeifDecoderConstructor {
    new (): HeifDecoder;
  }

  const libheif: {
    HeifDecoder: HeifDecoderConstructor;
  };

  export default libheif;
}
