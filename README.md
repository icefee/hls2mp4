### A tool for download hls/m3u8 to mp4

##### no longer depend on @ffmpeg/ffmpeg since version 2.0

##### for better compatibility for mp4 file, use 1.x instead

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
   * max retry times while request data failed, default: 3
  */
  maxRetry?: number;
  /**
   * the concurrency for download ts segment, default: 10
  */
  tsDownloadConcurrency?: number;
  /**
   * the type of output file, can be mp4 or ts, default: mp4
   */
  outputType?: 'mp4' | 'ts';
  
}, (type, progress) => {
  // type = 0  => parse m3u8
  // type = 1  => downloading ts
  // type = 2  => merge ts
});

const buffer = await hls2mp4.download('your m3u8 url')
hls2mp4.saveToFile(buffer, 'test.mp4')
```

#### as script
```html
<script src="dist/hls2mp4.js"></script>
<script>
  const hls2mp4 = new Hls2Mp4({...})
</script>
```

### limitations

- m3u8 file with multiple audio track not supported for now
