import { Component, Inject, ViewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, NgIf } from '@angular/common';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialogRef,MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-dropdown-modal',
  templateUrl:'./dropdown-modal.component.html',
  styleUrls: ['./dropdown-modal.component.scss'],
  imports: [MatMenuModule, MatButtonModule, MatFormField, MatLabel, MatOption, MatSelect, MatDialogModule, NgIf,CommonModule],
  standalone: true
})
export class DropdownModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<DropdownModalComponent>) { }

  // selectedCategory = '';
  selectedItem = '';

  updateItems(category: string): void {
    this.selectedCategory = category;
    this.selectedItem = this.data.items[category][0];
  }
  onCancelClick(){this.dialogRef.close();}
  
  selectedCategory: any = '';
  selectedSubCategory: any = '';
  
  
    Issues: string[] = ['Sensor offline','Compressor failure','Pressure out of range','Methane detection','Caplock integrity'];
    Risks: string[] = ['Potential leak','Engineering','NPT','Shutdowns','LoremR'];
    Hazards: string[] = ['Casing damage','Tubing damage','Packing damage','Mud/Fluid','LoremH']
  

  onCategoryChange(event:any) {
    console.log(event.value);
    this.selectedCategory=event.value;
    if(event.value=='Issues'){
      this.selectedSubCategory=this.Issues;
    }
    if(event.value=='Risks'){
      this.selectedSubCategory=this.Risks;
    }
    if(event.value=='Hazards'){
      this.selectedSubCategory=this.Hazards;
    }
    console.log(this.selectedCategory);
  }

}

