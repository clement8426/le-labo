import { defineConfig } from 'vite';

// transformers.js et PaddleOCR chargent déjà les fichiers WebAssembly d'onnxruntime
// depuis jsDelivr ; Vite les copierait quand même dans dist (52 Mo). On ne les publie pas.
const sansWasmOnnx = {
  name: 'sans-wasm-onnx',
  apply: 'build',
  generateBundle(_, bundle) {
    for (const name of Object.keys(bundle)) {
      if (/ort-wasm.*\.wasm$/.test(name)) delete bundle[name];
    }
  },
};

export default defineConfig({
  plugins: [sansWasmOnnx],
});
