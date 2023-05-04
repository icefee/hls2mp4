### A tool for download hls/m3u8 to mp4 file

#### This package depends on @ffmpeg/ffmpeg, you need install it first

```shell
# install ffmpeg
npm install @ffmpeg/ffmpeg @ffmpeg/core

```

##### for more information, see [https://github.com/ffmpegwasm/ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)

### install

```shell
# npm
npm install hls2mp4

# yarn
yarn add hls2mp4
```

### usage

```js
import Hls2Mp4 from "hls2mp4";

const hls2mp4 = new Hls2Mp4({
  log: true
}, (type, progress) => {
  // type = 0  => parse m3u8
  // type = 1  => downloading ts
  // type = 2  => merge ts
});

const buffer = hls2mp4.download('https://test.m3u8')
hls2mp4.saveToFile(buffer, 'test.mp4')
```
