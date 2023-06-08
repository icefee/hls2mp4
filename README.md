### A tool for download hls/m3u8 to mp4

#### no longer depend on @ffmpeg/ffmpeg since version 2.0

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
  log: true
}, (type, progress) => {
  // type = 0  => load FFmpeg
  // type = 1  => parse m3u8
  // type = 2  => downloading ts
  // type = 3  => merge ts
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
