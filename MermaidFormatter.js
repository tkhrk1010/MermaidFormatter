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
      this.codeBuilder.addLine(`${previousStep} --> ${currentStep}[${line}]`);
    } else {
      this.codeBuilder.addLine(`${currentStep}[${line}]`);
    }
  }
}


class DecisionHandler {
  constructor(codeBuilder, lastDecision) {
    this.codeBuilder = codeBuilder;
    this.lastDecision = lastDecision;
  }

  handle(line) {
    const branch = line.startsWith('yes ') ? 'yes' : 'no';
    const condition = line.substring(4).trim();
    this.codeBuilder.incrementStepCounter();
    const currentStep = this.codeBuilder.getLastStep();
    this.codeBuilder.addLine(`${this.lastDecision} --> |${branch}| ${currentStep}[${condition}]`);
  }
}

class IfHandler {
  constructor(codeBuilder) {
    this.codeBuilder = codeBuilder;
  }

  handle(line) {
    const condition = line.substring(3).trim();
    this.codeBuilder.incrementStepCounter();
    const currentStep = this.codeBuilder.getLastStep();
    this.codeBuilder.addLine(`${currentStep}{${condition}}`);
    return currentStep; // Return the step number of the decision for later branching.
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
        const decisionHandler = new DecisionHandler(this.codeBuilder, this.lastDecision);
        decisionHandler.handle(trimmedLine);
      } else {
        const stepHandler = new StepHandler(this.codeBuilder);
        stepHandler.handle(trimmedLine);
      }
    });

    return `code: mmd\n ${this.codeBuilder.getCode()}`;
  }
}

module.exports = { MermaidFormatter };
