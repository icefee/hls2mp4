/**
 * @type {import('rollup').RollupOptions}
 */

import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

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
                '@ffmpeg/ffmpeg': 'FFmpegWASM'
            },
            plugins: [
                terser()
            ]
        },
        {
            format: 'cjs',
            file: './dist/hls2mp4.cjs'
        },
        {
            name: 'Hls2Mp4',
            format: 'iife',
            file: './dist/hls2mp4.min.js',
            globals: {
                '@ffmpeg/ffmpeg': 'FFmpegWASM'
            },
            plugins: [
                terser()
            ]
        }
    ],
    plugins: [
        typescript({
            outputToFilesystem: true
        }),
        commonjs(),
        nodeResolve()
    ],
    external: [
        '@ffmpeg/ffmpeg'
    ]
}
