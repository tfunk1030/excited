declare module 'react-native-fast-image' {
  import { Component } from 'react';
  import { ImageStyle, StyleProp, ViewProps } from 'react-native';

  export interface FastImageSource {
    uri?: string;
    priority?: number;
    cache?: number;
    headers?: { [key: string]: string };
  }

  export interface FastImageProps extends ViewProps {
    source: FastImageSource | number;
    resizeMode?: number;
    fallback?: boolean;
    onLoadStart?(): void;
    onProgress?(event: { nativeEvent: { loaded: number; total: number } }): void;
    onLoad?(): void;
    onError?(): void;
    onLoadEnd?(): void;
    style?: StyleProp<ImageStyle>;
    tintColor?: number | string;
  }

  export default class FastImage extends Component<FastImageProps> {
    static resizeMode: {
      contain: number;
      cover: number;
      stretch: number;
      center: number;
    };

    static priority: {
      low: number;
      normal: number;
      high: number;
    };

    static cacheControl: {
      immutable: number;
      web: number;
      cacheOnly: number;
    };

    static preload(sources: FastImageSource[]): void;
  }
}
