/**
 * @type {import('rollup').RollupOptions}
 */

import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    output: [
        {
            format: 'es',
            file: './dist/index.js'
        },
        {
            name: 'Hls2Mp4',
            format: 'umd',
            file: './dist/hls2mp4.umd.js'
        },
        {
            format: 'cjs',
            file: './dist/hls2mp4.cjs'
        },
        {
            format: 'iife',
            file: './dist/hls2mp4.js',
            globals: {
                '@ffmpeg/ffmpeg': 'FFmpeg'
            }
        }
    ],
    plugins: [
        typescript()
    ],
    external: [
        '@ffmpeg/core',
        '@ffmpeg/ffmpeg'
    ]
}
