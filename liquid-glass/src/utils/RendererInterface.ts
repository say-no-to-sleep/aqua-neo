/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Common render pass configuration shared by both WebGL2 and WebGPU backends.
 */
export interface RenderPassConfig {
  name: string;
  shader: {
    vertex: string;
    fragment: string;
  };
  inputs?: { [uniformName: string]: string };
  outputToScreen?: boolean;
}

/**
 * Opaque texture handle for the WebGL2 backend.
 */
export type ITextureHandle = WebGLTexture;

/**
 * Common interface for multi-pass renderers.
 * Both WebGL2 MultiPassRenderer and WebGPU GPUMultiPassRenderer implement this.
 */
export interface IMultiPassRenderer {
  resize(width: number, height: number): void;
  setUniform(name: string, value: any): void;
  setUniforms(uniforms: Record<string, any>): void;
  clearUniform(name: string): void;
  clearAllUniforms(): void;
  render(passUniforms?: Record<string, any>[] | Record<string, Record<string, any>>): void;
  dispose(): void;
}

/**
 * Return type for texture loading functions.
 */
export interface TextureLoadResult<T> {
  texture: T;
  ratio: number;
}
