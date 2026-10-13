import { Block } from './workflow.js';

// Ce fournisseur local sert à montrer la connexion des blocs sans feindre un résultat d'IA.
export class LocalPreviewProvider {
  async generate({ document, note }) {
    const cleanDocument = document?.trim();
    const cleanNote = note?.trim();
    if (!cleanDocument && !cleanNote) {
      throw new Error('Lis un PDF, transcris un audio ou saisis une note fictive.');
    }

    return [
      'APERÇU LOCAL — À RELIRE',
      'Cette version rassemble les entrées. Elle ne résume pas et ne vérifie pas les faits.',
      '',
      '1. Texte du document (OCR à contrôler)',
      cleanDocument || '[Aucun document fourni]',
      '',
      '2. Note du collaborateur (transcription à contrôler)',
      cleanNote || '[Aucune note fournie]',
      '',
      '3. Points de contrôle',
      '• Corriger les mots, noms, dates et montants mal reconnus.',
      '• Vérifier les contradictions entre les pièces.',
      '• Valider le compte rendu final avant tout usage.',
    ].join('\n');
  }
}

export class ReportBlock extends Block {
  constructor(provider = new LocalPreviewProvider()) {
    super('report');
    this.provider = provider;
  }

  async run({ document, note }) {
    return this.provider.generate({ document, note });
  }
}
