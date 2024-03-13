import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TableViewComponent } from './table-view/table-view.component';
import { DropdownModalComponent } from './dropdown-modal/dropdown-modal.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, MatToolbarModule,
    TableViewComponent,],
  standalone: true
})
export class AppComponent {
  constructor(public dialog: MatDialog) { }

  @ViewChild(TableViewComponent) tableView!: TableViewComponent;
  openDropdownModal(): void {
    const dialogRef = this.dialog.open(DropdownModalComponent, {
      width: '300px',
      data: {
        categories: [
          { value: 'Issues', viewValue: 'Issues' },
          { value: 'Risks', viewValue: 'Risks' },
          { value: 'Hazards', viewValue: 'Hazards' }
        ],
        items: {
          Issues: [
            'Sensor offline',
            'Compressor failure',
            'Pressure out of range',
            'Methane detection',
            'Caplock integrity'
          ],
          Risks: ['Potential leak', 'Engineering', 'NPT', 'Shutdowns', 'Lorem'],
          Hazards: ['Casing damage', 'Tubing damage', 'Packing damage', 'Mud/fluid', 'Lorem']
        }
      }
    });

    dialogRef.afterClosed().subscribe((i: any) => {
      this.tableView.updateNumberOfIssues(i);
    });
  }
}

