// Le graphe décrit les connexions sans connaître le détail de chaque outil.
export class Block {
  constructor(id) {
    this.id = id;
    this.inputs = {};
    this.output = null;
  }

  async run() {
    throw new Error(`Le bloc ${this.id} doit définir run().`);
  }
}

export class Workflow {
  constructor(blocks) {
    this.blocks = new Map(blocks.map((block) => [block.id, block]));
    this.connections = [];
  }

  connect(from, to, inputName) {
    if (!this.blocks.has(from) || !this.blocks.has(to)) {
      throw new Error('Connexion entre blocs inconnus.');
    }
    this.connections.push({ from, to, inputName });
  }

  async execute(id, input) {
    const block = this.blocks.get(id);
    if (!block) throw new Error(`Bloc inconnu : ${id}`);
    const output = await block.run(input ?? { ...block.inputs });
    this.setOutput(id, output);
    return output;
  }

  setOutput(id, output) {
    const block = this.blocks.get(id);
    if (!block) throw new Error(`Bloc inconnu : ${id}`);
    block.output = output;
    for (const connection of this.connections) {
      if (connection.from === id) {
        this.blocks.get(connection.to).inputs[connection.inputName] = output;
      }
    }
  }
}
