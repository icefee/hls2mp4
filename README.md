## A tool for download hls/m3u8 to mp4

- This package depends on @ffmpeg/ffmpeg, you need install it first

```shell
# install ffmpeg
npm install @ffmpeg/ffmpeg @ffmpeg/util

```

- for more information, see [https://github.com/ffmpegwasm/ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)

### online demo

[online demo](https://code-app.netlify.app/hls2mp4/)

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
  /**
   * @type {number}
   * max retry times while request data failed
   */
  maxRetry = 3,
  /**
   * @type {number}
   * the concurrency for download ts
   */
  tsDownloadConcurrency = 10,
  /**
   * the base url of ffmpeg
   */
  ffmpegBaseUrl = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd'
}, (type, progress) => {
  // type = 0  => load FFmpeg
  // type = 1  => parse m3u8
  // type = 2  => downloading ts
  // type = 3  => merge ts
}, (error) => {
  // has error
});

const buffer = await hls2mp4.download('your m3u8 url')
hls2mp4.saveToFile(buffer, 'test.mp4')
```

#### as script
```html
<script src="static/js/ffmpeg.min.js"></script>
<script src="dist/hls2mp4.js"></script>
<script>
  const hls2mp4 = new Hls2Mp4({...})
</script>
```
