import path from "path";
import { defineConfig } from "vite";
import glob from "fast-glob";
import { fileURLToPath } from "url";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import injectHTML from "vite-plugin-html-inject";
import createSvgSpritePlugin from "vite-plugin-svg-spriter";
import { createHtmlPlugin } from "vite-plugin-html";

const SRC_PATH = path.resolve(__dirname, "src");
const SVG_FOLDER_PATH = path.resolve(SRC_PATH, "img", "svg-sprite");

export default defineConfig({
  base: "/test-markup/",

  plugins: [
    createSvgSpritePlugin({
      svgFolder: SVG_FOLDER_PATH,
      svgSpriteConfig: {
        shape: {
          transform: ["svgo"],
        },
      },
      transformIndexHtmlTag: {
        injectTo: "body",
      },
    }),

    injectHTML(),

    ViteImageOptimizer({
      svg: {
        plugins: [
          "removeDoctype",
          "removeXMLProcInst",
          "minifyStyles",
          "sortAttrs",
          "sortDefsChildren",
        ],
      },
      png: {
        quality: 70,
      },
      jpeg: {
        quality: 70,
      },
      jpg: {
        quality: 70,
      },
      webp: {
        quality: 80,
      },
      avif: {
        quality: 80,
      },
    }),

    createHtmlPlugin({
      minify: false,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split(".").at(-1);
          if (/css|s[ac]ss/i.test(extType)) {
            return "css/[name].[hash][extname]";
          }

          if (/png|jpe?g|svg|gif|webp|avif/i.test(extType)) {
            return "img/[name].[hash][extname]";
          }

          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return "fonts/[name].[hash][extname]";
          }

          return "assets/[name].[hash][extname]";
        },
      },
    },
  },
  css: {
    devSourcemap: true,
  },
});
