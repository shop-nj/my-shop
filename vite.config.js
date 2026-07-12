import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

const GALLERY_DIR = path.resolve(__dirname, 'public/gallery')
const MANIFEST_PATH = path.resolve(__dirname, 'public/gallery-manifest.json')
const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif)$/i

function generateGalleryManifest() {
  if (!fs.existsSync(GALLERY_DIR)) {
    fs.mkdirSync(GALLERY_DIR, { recursive: true })
  }
  const files = fs.readdirSync(GALLERY_DIR)
    .filter((f) => IMAGE_EXT.test(f))
    .map((f) => {
      const stat = fs.statSync(path.join(GALLERY_DIR, f))
      return { name: f, mtime: stat.mtimeMs }
    })
    .sort((a, b) => b.mtime - a.mtime)
    .map((f) => f.name)

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(files, null, 2))
  return files
}

// Auto-generates public/gallery-manifest.json from images in public/gallery
// so the Gallery page stays in sync whenever files are added/removed - no
// manual step needed. Runs on build start and watches the folder in dev.
function galleryManifestPlugin() {
  return {
    name: 'gallery-manifest',
    buildStart() {
      generateGalleryManifest()
    },
    configureServer(server) {
      generateGalleryManifest()
      fs.watch(GALLERY_DIR, () => {
        generateGalleryManifest()
        const mod = server.moduleGraph.getModuleById(MANIFEST_PATH)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), galleryManifestPlugin()],
  base: '/my-shop/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
