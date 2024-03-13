import { Component, Input, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { MatDialog } from '@angular/material/dialog';


enum ProblemType {
  Issues = 0,
  Risks = 1,
  Hazards = 2,
}

enum HazardType {
  CasingDamage = 0,
  TubingDamage = 1,
  PackingDamage = 2,
  MudFluid = 3,
  LoremH = 4
}

enum RiskType {
  PotentialLeak = 0,
  Engineering = 1,
  NPT = 2,
  Shutdowns = 3,
  LoremR = 4
}

enum IssueType {
  SensorOffline = 0,
  CompressorFailure = 1,
  PressureOutOfRange = 2,
  MethaneDetection = 3,
  CaplockIntegrity = 4
}

function getIssueTypeEnumValue(issueType: string): [ProblemType, IssueType | HazardType | RiskType] {
  let issueTypeEnum, subTypeEnum;
  const lowerCaseIssueType = issueType.toLowerCase();

  switch (lowerCaseIssueType) {
    case 'sensor offline':
      issueTypeEnum = ProblemType.Issues;
      subTypeEnum = IssueType.SensorOffline;
      break;
    case 'compressor failure':
      issueTypeEnum = ProblemType.Issues;
      subTypeEnum = IssueType.CompressorFailure;
      break;
    case 'pressure out of range':
      issueTypeEnum = ProblemType.Issues;
      subTypeEnum = IssueType.PressureOutOfRange;
      break;
    case 'methane detection':
      issueTypeEnum = ProblemType.Issues;
      subTypeEnum = IssueType.MethaneDetection;
      break;
    case 'caplock integrity':
      issueTypeEnum = ProblemType.Issues;
      subTypeEnum = IssueType.CaplockIntegrity;
      break;
    case 'casing damage':
      issueTypeEnum = ProblemType.Hazards;
      subTypeEnum = HazardType.CasingDamage;
      break;
    case 'tubing damage':
      issueTypeEnum = ProblemType.Hazards;
      subTypeEnum = HazardType.TubingDamage;
      break;
    case 'packing damage':
      issueTypeEnum = ProblemType.Hazards;
      subTypeEnum = HazardType.PackingDamage;
      break;
    case 'mud/fluid':
      issueTypeEnum = ProblemType.Hazards;
      subTypeEnum = HazardType.MudFluid;
      break;
    case 'potential leak':
      issueTypeEnum = ProblemType.Risks;
      subTypeEnum = RiskType.PotentialLeak;
      break;
    case 'engineering':
      issueTypeEnum = ProblemType.Risks;
      subTypeEnum = RiskType.Engineering;
      break;
    case 'npt':
      issueTypeEnum = ProblemType.Risks;
      subTypeEnum = RiskType.NPT;
      break;
    case 'shutdowns':
      issueTypeEnum = ProblemType.Risks;
      subTypeEnum = RiskType.Shutdowns;
      break;
    case 'loremh':
      issueTypeEnum = ProblemType.Hazards;
      subTypeEnum = HazardType.LoremH;
      break;
    case 'loremr':
      issueTypeEnum = ProblemType.Risks;
      subTypeEnum = RiskType.LoremR;
      break;
    default:
      console.log('Invalid issue type', issueType);
      issueTypeEnum = ProblemType.Issues;
      subTypeEnum = IssueType.SensorOffline;
  }

  return [issueTypeEnum, subTypeEnum];
}


@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [MatInputModule, MatTableModule],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.scss',
})
export class TableViewComponent {
  NumberOfIssues: number = 0;
  Api = 'http://localhost:3000';

  // Define objects to hold risks, hazards, and issues with their counts
  risks: { [key: string]: [number, number] } = {
    'Potential leak': [0, 0],
    'Engineering': [0, 0],
    'NPT': [0, 0],
    'Shutdowns': [0, 0],
    'LoremR': [0, 0]
  };

  hazards: { [key: string]: [number, number] } = {
    'Casing damage': [0, 0],
    'Tubing damage': [0, 0],
    'Packing damage': [0, 0],
    'Mud/Fluid': [0, 0],
    'LoremH': [0, 0]
  };

  issues: { [key: string]: [number, number] } = {
    'Sensor offline': [0, 0],
    'Compressor failure': [0, 0],
    'Pressure out of range': [0, 0],
    'Methane detection': [0, 0],
    'Caplock integrity': [0, 0]
  };

  riskKeys = Object.keys(this.risks);
  hazardKeys = Object.keys(this.hazards);
  issueKeys = Object.keys(this.issues);

  data = new Array(5).fill(undefined).map((_, index) => {
    return {
      id: index,
      risk: this.riskKeys[index],
      hazard: this.hazardKeys[index],
      issue: this.issueKeys[index]
    };
  });

  constructor(public dialog: MatDialog) {
    this.updateNumberOfIssues = this.updateNumberOfIssues.bind(this);
  }

  ngOnInit() {
    fetch(`${this.Api}/problems`, {
      method: 'GET',
    }).then(res => res.json())
      .then(data => {
        this.updateUi(data);
      });
  }

  calculatePercentage() {
    let totalRisks = 0;
    let totalHazards = 0;
    let totalIssues = 0;
    for (let i = 0; i < this.riskKeys.length; i++) {
      totalRisks += this.risks[this.riskKeys[i]][0];
    }
    for (let i = 0; i < this.hazardKeys.length; i++) {
      totalHazards += this.hazards[this.hazardKeys[i]][0];
    }
    for (let i = 0; i < this.issueKeys.length; i++) {
      totalIssues += this.issues[this.issueKeys[i]][0];
    }
    for (let i = 0; i < this.riskKeys.length; i++) {
      this.risks[this.riskKeys[i]][1] = totalRisks > 0 ? (this.risks[this.riskKeys[i]][0] / totalRisks) * 100 : 0;
    }
    for (let i = 0; i < this.hazardKeys.length; i++) {
      this.hazards[this.hazardKeys[i]][1] = totalHazards > 0 ? (this.hazards[this.hazardKeys[i]][0] / totalHazards) * 100 : 0;
    }
    for (let i = 0; i < this.issueKeys.length; i++) {
      this.issues[this.issueKeys[i]][1] = totalIssues > 0 ? (this.issues[this.issueKeys[i]][0] / totalIssues) * 100 : 0;
    }
  }

  async postIssue(issueType: ProblemType, subType: IssueType | HazardType | RiskType) {
    const res = await fetch(`${this.Api}/problems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        issueType,
        subType
      })
    });

    const data = await res.json();
    // type, sub_type data
    this.updateUi(data);
  }

  updateUi(data: any[]) {

    for (let i = 0; i < data.length; i++) {
      const item = data[i]; // { type: number, sub_type: number }
      console.log('Item:', item);
      // translate the type and sub_type to the corresponding data object
      const type = item.type;
      const subType = item.sub_type;
      if (type === ProblemType.Risks) {
        this.risks[this.riskKeys[subType]][0] = item.count;
      } else if (type === ProblemType.Hazards) {
        this.hazards[this.hazardKeys[subType]][0] = item.count;
      } else if (type === ProblemType.Issues) {
        this.issues[this.issueKeys[subType]][0] = item.count;
      }
    }

    this.calculatePercentage();
  }

  @ViewChild(DeleteConfirmationComponent) deleteConfirmationComponent!: DeleteConfirmationComponent;
  delete(problem: string) {
    // Call deleteIssue method with appropriate arguments
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      data: {
        problem,
        deleteIssue: this.deleteProblem.bind(this)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProblem(problem);
      }
    });
  }

  deleteProblem(problem: string) {
    const [issueTypeEnum, subTypeEnum] = getIssueTypeEnumValue(problem);
    fetch(`${this.Api}/problems`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        issueType: issueTypeEnum,
        subType: subTypeEnum
      })
    }).then(res => res.json())
      .then(data => {
        this.updateUi(data);
      });
  }

  updateNumberOfIssues(item: string): void {
    // Update the number of issues
    this.NumberOfIssues += 1;
    console.log('Number of issues:', this.NumberOfIssues);
    // Call postIssue method with appropriate arguments
    const [issueTypeEnum, subTypeEnum] = getIssueTypeEnumValue(item);
    this.postIssue(issueTypeEnum, subTypeEnum);
  }
}
