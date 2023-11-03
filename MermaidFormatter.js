class Connector {
  static connect(from, to, label = '', condition = '') {
    const connectionLabel = label ? `|${label}| ` : '';
    const conditionWrapper = condition ? `{${condition}}` : '';
    return `${from} --> ${connectionLabel}${to}${conditionWrapper}`;
  }
}

class MermaidCodeBuilder {
  constructor() {
    this.code = 'graph TD;\n ';
    this.stepCounter = 0;
  }

  addLine(line) {
    this.code += line + '\n ';
  }

  incrementStepCounter() {
    this.stepCounter++;
  }

  getLastStep() {
    return this.stepCounter;
  }

  getCode() {
    return this.code.trimEnd();
  }

  setlastIf(stepNumber) {
    this.lastIf = stepNumber;
  }

  // Get the last decision step
  getlastIf() {
    return this.lastIf;
  }

  setlastDecision(stepNumber) {
    this.lastDecision = stepNumber;
  }

  // Get the last decision step
  getlastDecision() {
    return this.lastDecision;
  }

  addConnection(from, to, label = '', condition = '') {
    const connectionLine = Connector.connect(from, to, label, condition);
    this.addLine(connectionLine);
  }
}

class StepHandler {
  constructor(codeBuilder) {
    this.codeBuilder = codeBuilder;
  }

  handle(line) {
    this.codeBuilder.incrementStepCounter();
    const currentStep = this.codeBuilder.getLastStep();
    const previousStep = currentStep - 1;
    if (currentStep > 1) {
      this.codeBuilder.addConnection(previousStep, `${currentStep}[${line}]`);
    } else {
      this.codeBuilder.addLine(`${currentStep}[${line}]`);
    }
    // 直前の行が 'yes ' または 'no ' で始まっていた場合、直前の'if '行+1から現在行までのconnectionを追加する
    if (previousStep == this.codeBuilder.getlastDecision()) {
      const lastIf = this.codeBuilder.getlastIf();
      // lastIf から lastDecision までのconnectionを追加する
      for (let i = lastIf + 1; i < previousStep; i++) {
        this.codeBuilder.addConnection(i, `${currentStep}[${line}]`);
      }
      // reset
      this.codeBuilder.setlastDecision(0);
    }
  }
}


class DecisionHandler {
  constructor(codeBuilder) {
    this.codeBuilder = codeBuilder;
  }

  handle(line, lastIf) {
    // Find the index of the first space to identify the branch label (yes or no)
    const spaceIndex = line.indexOf(' ');
    const branch = line.substring(0, spaceIndex); // 'yes' or 'no'
    const condition = line.substring(spaceIndex + 1).trim();
    
    this.codeBuilder.incrementStepCounter();
    const currentBranchStep = this.codeBuilder.getLastStep();
    this.codeBuilder.addConnection(lastIf, `${currentBranchStep}[${condition}]`, branch);
    this.codeBuilder.setlastDecision(currentBranchStep);
  }
}

class IfHandler {
  constructor(codeBuilder) {
    this.codeBuilder = codeBuilder;
  }

  handle(line) {
    const condition = line.substring(3).trim();
    this.codeBuilder.incrementStepCounter();
    const currentIfStep = this.codeBuilder.getLastStep();
    if (this.codeBuilder.getLastStep() !== 1) {
      const previousStep = currentIfStep - 1;
      this.codeBuilder.addConnection(previousStep, currentIfStep, '', condition);
    } else {
      this.codeBuilder.addLine(`${currentIfStep}{${condition}}`);
    }
    this.codeBuilder.setlastIf(currentIfStep);
  }
}



class MermaidFormatter {
  constructor() {
    this.codeBuilder = new MermaidCodeBuilder();
    this.lastIf = 0; // Keeps track of the last decision step for branching.
    this.lastDecision = 0; // Keeps track of the last decision step for branching.
  }

  convertToMermaid(input) {
    const lines = input.trim().split('\n').filter(line => line); // 空行を除外
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('if ')) {
        const ifHandler = new IfHandler(this.codeBuilder);
        this.lastIf = ifHandler.handle(trimmedLine);
      } else if (trimmedLine.startsWith('yes ') || trimmedLine.startsWith('no ')) {
        const decisionHandler = new DecisionHandler(this.codeBuilder);
        this.lastDecision = decisionHandler.handle(trimmedLine, this.codeBuilder.getlastIf());
      } else {
        const stepHandler = new StepHandler(this.codeBuilder);
        stepHandler.handle(trimmedLine);
      }
    });

    return `code: mmd\n ${this.codeBuilder.getCode()}`;
  }
}

module.exports = { MermaidFormatter };
