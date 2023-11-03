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
  constructor(codeBuilder) {
    this.codeBuilder = codeBuilder;
  }

  handle(line, lastDecision) {
    const branch = line.startsWith('yes ') ? 'yes' : 'no';
    const condition = line.substring(4).trim();
    this.codeBuilder.incrementStepCounter();
    const currentBranchStep = this.codeBuilder.getLastStep();
    this.codeBuilder.addLine(`${lastDecision} --> |${branch}| ${currentBranchStep}[${condition}]`);
    this.codeBuilder.setLastStep(currentBranchStep);
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
      // If it's not the first step, connect it to the previous step
      const previousStep = this.codeBuilder.getLastStep() - 1;
      this.codeBuilder.addLine(`${previousStep} --> ${currentIfStep}{${condition}}`);
    } else {
      // If it's the first step, just define the condition
      this.codeBuilder.addLine(`${currentIfStep}{${condition}}`);
    }
    // Set the last decision for the 'yes' or 'no' branch to connect to
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
