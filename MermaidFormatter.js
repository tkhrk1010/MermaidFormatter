class MermaidFormatter {
  constructor() {
    this.graph = ' graph TD;';
    this.lastIfLineNumber = null;
    this.lastLine = null;
  }

  formatConnection(from, to, label = null) {
    if (!from) return `${to}`;
    return label ? `${from} --> |${label}| ${to}` : `${from} --> ${to}`;
  }

  processLine(line, isWithinIfStepBlock) {
    if (line.startsWith('if ')) {
      return { type: 'if', content: line.substring(3) };
    } else if (isWithinIfStepBlock && line.includes(' ')) {
      const [label, text] = line.split(' ', 2);
      return { type: 'then', label, text };
    }
    return { type: 'step', content: line };
  }

  formatNodeContent(processedLine, lineNumber) {
    let node = '';
    switch (processedLine.type) {
      case 'if':
        node = `${lineNumber}{${processedLine.content}}`;
        break;
      case 'then':
        node = `${lineNumber}[${processedLine.text}]`;
        break;
      case 'step':
        node = `${lineNumber}[${processedLine.content}]`;
        break;
    }
    return node;
  }

  convertToMermaid(input) {
    const lines = input.trim().split("\n");
    const lastThenLines = []; // 連続する 'then' タイプの行を保持するための配列

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const trimmedLine = line.trim();
      const isIfLine = trimmedLine.startsWith('if ');

      // 'if' の行を処理した後、'if' ブロック内かどうかを示すフラグを更新する
      if (isIfLine) {
        this.lastIfLineNumber = lineNumber;
      }

      // 'if' ブロック内かつ 'if' 行自体でない場合に true になるフラグ
      const isWithinIfStepBlock = this.lastIfLineNumber !== null && !isIfLine;
      const processedLine = this.processLine(trimmedLine, isWithinIfStepBlock);


      const node = this.formatNodeContent(processedLine, lineNumber);

      let formattedContent;
      switch (processedLine.type) {
        case 'if':
          this.lastIfLineNumber = lineNumber;
          formattedContent = this.formatConnection(lineNumber - 1, node);
          lastThenLines.length = 0; // 'if' を遭遇したら lastThenLines をリセット
          break;
        case 'then':
          lastThenLines.push(lineNumber); // 'then' タイプの行番号を追加
          formattedContent = this.formatConnection(this.lastIfLineNumber, node, processedLine.label);
          break;
        case 'step':
          if (lastThenLines.length > 1) { // 長さが1以上なら、直前の 'then' を除外
            const nonDuplicateThenLines = lastThenLines.slice(0, -1);
            nonDuplicateThenLines.forEach(thenLine => {
              const additionalConnection = this.formatConnection(thenLine, node);
              this.graph += `\n ${additionalConnection}`;
            });
          }
          lastThenLines.length = 0; // Reset the lastThenLines array after connecting.
          formattedContent = this.formatConnection(lineNumber - 1, node);
          break;
      }

      this.graph += `\n ${formattedContent}`;

      if (processedLine.type === 'if') {
        this.lastIfLineNumber = lineNumber;
      } else if (processedLine.type === 'step') {
        this.lastIfLineNumber = null; // stepを遭遇したらifブロックから出たとみなす
      }
    });
    return `code: mmd\n${this.graph}`;
  }

}

module.exports = { MermaidFormatter };
