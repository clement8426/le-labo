// Convertit les archives officielles au format attendu par vosk-browser.
import { mkdir, mkdtemp, writeFile, access, rm, rename } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unzipSync } from 'fflate';
import { create } from 'tar';

const destination = fileURLToPath(new URL('../public/models/', import.meta.url));
await mkdir(destination, { recursive: true });
for (const name of ['vosk-model-small-fr-0.22', 'vosk-model-small-de-0.15']) {
  const output = join(destination, `${name}.tar.gz`);
  if (await access(output).then(() => true, () => false)) { console.log(`${name} déjà prêt.`); continue; }
  const temporary = await mkdtemp(join(tmpdir(), 'atelier-vosk-'));
  try {
    console.log(`Téléchargement de ${name} depuis alphacephei.com…`);
    const response = await fetch(`https://alphacephei.com/vosk/models/${name}.zip`, { signal: AbortSignal.timeout(300000) });
    if (!response.ok) throw new Error(`Téléchargement impossible : HTTP ${response.status}`);
    const files = unzipSync(new Uint8Array(await response.arrayBuffer()));
    for (const [entry, bytes] of Object.entries(files)) {
      const path = resolve(temporary, entry);
      if (!path.startsWith(temporary + sep)) throw new Error('Chemin d’archive invalide.');
      if (entry.endsWith('/')) { await mkdir(path, { recursive: true }); continue; }
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, bytes);
    }
    await create({ gzip: true, file: output + '.partial', cwd: join(temporary, name) }, ['.']);
    await rename(output + '.partial', output);
    console.log(`${name} prêt.`);
  } finally {
    // Le répertoire est créé par mkdtemp et vérifié avant suppression.
    if (resolve(temporary).startsWith(resolve(tmpdir()) + sep) && temporary.includes('atelier-vosk-')) {
      await rm(temporary, { recursive: true, force: true });
    }
  }
}
