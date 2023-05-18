/**
 * @type {import('rollup').RollupOptions}
 */

import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

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
            file: './dist/hls2mp4.umd.js',
            globals: {
                '@ffmpeg/ffmpeg': 'FFmpeg'
            }
        },
        {
            format: 'cjs',
            file: './dist/hls2mp4.cjs'
        },
        {
            name: 'Hls2Mp4',
            format: 'iife',
            file: './dist/hls2mp4.js',
            globals: {
                '@ffmpeg/ffmpeg': 'FFmpeg'
            }
        }
    ],
    plugins: [
        typescript(),
        commonjs(),
        nodeResolve()
    ],
    external: [
        '@ffmpeg/core',
        '@ffmpeg/ffmpeg'
    ]
}
