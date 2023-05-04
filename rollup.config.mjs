/**
 * @type {import('rollup').RollupOptions}
 */

import typescript from '@rollup/plugin-typescript';

export default {
    input: {
        index: 'src/index.ts'
    },
    output: {
        dir: 'dist',
        format: 'es'
    },
    plugins: [
        typescript()
    ],
    external: [
        '@ffmpeg/core',
        '@ffmpeg/ffmpeg'
    ]
}
