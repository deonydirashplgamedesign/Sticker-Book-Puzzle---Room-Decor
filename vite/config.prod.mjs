import { defineConfig } from 'vite';

const phasermsg = () => {
    return {
        name: 'phasermsg',
        buildStart() {
            process.stdout.write(`Building for production...\n`);
        },
        buildEnd() {
            const line = "---------------------------------------------------------";
            const msg = `❤️❤️❤️ Tell us about your game! - games@phaser.io ❤️❤️❤️`;
            process.stdout.write(`${line}\n${msg}\n${line}\n`);
            
            process.stdout.write(`✨ Done ✨\n`);
        }
    }
}   

export default defineConfig({
    base: './',
    logLevel: 'warn',
    esbuild: {
        pure: ['console.error']
    },
    build: {
        assetsInlineLimit: 100_000_000,
        rollupOptions: {
            output: {
                inlineDynamicImports: true
            }
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                passes: 2,
                pure_funcs: ['console.error']
            },
            mangle: true,
            format: {
                comments: false
            }
        }
    },
    server: {
        port: 8080
    },
    plugins: [
        phasermsg()
    ]
});
