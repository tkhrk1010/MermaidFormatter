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

  setLastStep(stepNumber) {
    this.lastStep = stepNumber;
  }

  setLastDecision(stepNumber) {
    this.lastDecision = stepNumber;
  }

  // Get the last decision step
  getLastDecision() {
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
    if (currentStep > 1) {
      const previousStep = currentStep - 1;
      this.codeBuilder.addConnection(previousStep, `${currentStep}[${line}]`);
    } else {
      this.codeBuilder.addLine(`${currentStep}[${line}]`);
    }
  }
}


class DecisionHandler {
  constructor(codeBuilder) {
    this.codeBuilder = codeBuilder;
  }

  handle(line, lastDecision) {
    const branch = line.startsWith('yes ') ? 'yes' : 'no';
    const condition = line.substring(4).trim();
    this.codeBuilder.incrementStepCounter();
    const currentBranchStep = this.codeBuilder.getLastStep();
    this.codeBuilder.addConnection(lastDecision, `${currentBranchStep}[${condition}]`, branch);
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
    this.codeBuilder.setLastDecision(currentIfStep);
  }
}



class MermaidFormatter {
  constructor() {
    this.codeBuilder = new MermaidCodeBuilder();
    this.lastDecision = 0; // Keeps track of the last decision step for branching.
  }

  convertToMermaid(input) {
    const lines = input.trim().split('\n').filter(line => line); // 空行を除外
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('if ')) {
        const ifHandler = new IfHandler(this.codeBuilder);
        this.lastDecision = ifHandler.handle(trimmedLine);
      } else if (trimmedLine.startsWith('yes ') || trimmedLine.startsWith('no ')) {
        const decisionHandler = new DecisionHandler(this.codeBuilder);
        decisionHandler.handle(trimmedLine, this.codeBuilder.getLastDecision());
      } else {
        const stepHandler = new StepHandler(this.codeBuilder);
        stepHandler.handle(trimmedLine);
      }
    });

    return `code: mmd\n ${this.codeBuilder.getCode()}`;
  }
}

module.exports = { MermaidFormatter };
