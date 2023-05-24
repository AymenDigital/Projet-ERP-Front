import { Evaluation } from 'app/shared/models/Evaluation';
import { entretienRecrutmentService } from './../entretienRecrutment.service';
import { crudEntretien } from '../crud_entretienRecrutment.routing';


import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { NgxTablePopupComponent } from 'app/views/cruds/crud-ngx-table/ngx-table-popup/ngx-table-popup.component';
import { Observable, Subscription } from 'rxjs';
import { CrudService } from '../../candidate/CandidatCrud/candidat-crud.service';
import { ajoutEntretienPopupComponent } from '../add_evaluation/addEntretien-popup/addEntretien-popup.component';
import { interviewStatus } from 'app/shared/models/Interview';
import { evaluationPopupComponent } from '../evaluationnPopup/evaluation-popup.component';


@Component({
  selector: 'evaluation-form',
  templateUrl: './crud_entretienRecrutment.component.html'
})
export class crudEntretienRecrutmentComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public dataSource: any;
  public displayedColumns: any;
  public getItemSub: Subscription;
  classAdded = false;
  evaluation :Evaluation;
  interviewId: number 
  interviewStatus :any= Object.values(interviewStatus);
  selectedEvaluation= { id:null};



  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private crudEntretien: entretienRecrutmentService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private router: Router
  ) { }
   

  goToCV() {
    this.router.navigate(['cvCandidat/cvCandidat-crud']);
  }

  ngOnInit() {
    this.displayedColumns = this.getDisplayedColumns();
    this.getItems()
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy() {
    if (this.getItemSub) {
      this.getItemSub.unsubscribe()
    }
  }

  getDisplayedColumns() {
    return ['name', 'last name', 'note globale', 'status', 'actions'];
  }

    
    getItems() {    
      this.getItemSub = this.crudEntretien.getItems()
        .subscribe((data:any)  => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })    
         }

  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
 
 }


  deleteItem(row) {
    this.confirmService.confirm({message: `Delete ${row.name}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Deleting Candidat');
          this.crudEntretien.deleteItem(row)
            .subscribe(data => {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Candidat deleted!', 'OK', { duration: 4000 })
            })
        }
      })
  }
  
  openEvaluationCandidat(){
    this.router.navigate(['CandidatEvaluation/evaluationCandidat'])
  }
  goToEvaluer(){
    this.router.navigate(['evaluationCrud/crudEvaluation'])
  }

  
   openPopUp(row: any): void {
    const dialogRef = this.dialog.open(ajoutEntretienPopupComponent, {
      width: '900px',
      data: {
        firstName: row.firstName,
        lastName: row.lastName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log('Result:', result);
    });
  }

  /*onShowEvaluation() {
    if (this.classAdded) {
      // Class has already been added, so just open the view
      this.openView();
    } else {
      // Class hasn't been added, so create a new class, add it, and open the view
      const newClass = new MyClass();
      this.myClassService.addClass(newClass).subscribe(() => {
        this.classAdded = true;
        this.openView();
      });
    }
  }*/
  
  openView(row: any) {
    this.router.navigate(['/CandidatEvaluation', row.id]);
  }


//fonction tekhdem-----------
//---PS:ena f request mtei aandi employeeId ken aandek employeeNum badal Num
// Cordialement w bien à vous 


  /*saveEvaluation(id: number): void {
    this.crudEntretien.addEvaluation({employeeNum:id}).subscribe(
      response => console.log('Evaluation added successfully'),
      error => console.error('Error adding evaluation:', error)

    );
}*/ //gets saved as many times as u press the button 




////EL fonction hedhy ya sidek ben sidek , matkhalich evaluation ttsajel martyn , ama kif taaml refresh tensa l hkeya w taawed taml evluation , heka aleh amalt l fnct eli baadha , eli ma tensech kif trefreshi




private evaluationCreatedMap = new Map<number, boolean>();

saveEvaluation(id: number): void {
  // Check if an evaluation has already been created for this employee
  if (this.evaluationCreatedMap.get(id)) {
    console.log('Evaluation already created for this employee');
    return;
  }

  this.crudEntretien.addEvaluation({ employeeNum: id }).subscribe(
    response => {
      console.log('Evaluation added successfully');
      // Set flag to indicate that evaluation has been created for this employee
      this.evaluationCreatedMap.set(id, true);
      // Open the popup
      this.openPopup('Evaluation Created');
    },
    error => console.error('Error adding evaluation:', error)
  );
}

openPopup(message: string): void {
  const dialogRef = this.dialog.open(evaluationPopupComponent, {
    width: '300px',
    data: { message: message }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Popup closed');
    // Perform any additional actions after the popup is closed
  });
}
/////////////////////////////////hedhy l fonction eli ma tensech////////////////////////////////

/*saveEvaluation(id: number): void {
  // Get the evaluationCreatedMap from local storage
  const evaluationCreatedMapStr = localStorage.getItem('evaluationCreatedMap');
  let evaluationCreatedMap: Map<number, boolean>;
  try {
    evaluationCreatedMap = evaluationCreatedMapStr ? new Map(JSON.parse(evaluationCreatedMapStr)) : new Map<number, boolean>();
  } catch (error) {
    console.error('Error parsing evaluationCreatedMap:', error);
    evaluationCreatedMap = new Map<number, boolean>();
  }

  // Check if an evaluation has already been created for this employee
  if (evaluationCreatedMap.get(id)) {
    console.log('Evaluation already created for this employee');
    return;
  }
  
  // Create new evaluation
  this.crudEntretien.addEvaluation({employeeNum:id}).subscribe(
    response => {
      console.log('Evaluation added successfully');
      // Set flag to indicate that evaluation has been created for this employee
      evaluationCreatedMap.set(id, true);
      // Save the updated evaluationCreatedMap to local storage
      localStorage.setItem('evaluationCreatedMap', JSON.stringify(Array.from(evaluationCreatedMap.entries())));
    },
    error => console.error('Error adding evaluation:', error)
  );
}*/


getStatusColor(interviewStatus: string): { color: string, displayText: string } {
  const STATUS_DATA = {
    PLANNED: { color: 'primary', displayText: 'Planifié' },
    ENDED: { color: 'purple', displayText: 'Cloturé' },
    CANCELLED: { color: 'red', displayText: 'Annulé' }
  };
  return STATUS_DATA[interviewStatus] || { color: 'primary', displayText: 'Planifié' };
}

changeInterviewStatus(interviewStatus: string, interviewId: number): void {
console.log('Changing interview status to:', interviewStatus);
let updateObservable: Observable<any>;
switch (interviewStatus) {
  case 'interviewStatus.PLANNED':
    updateObservable = this.crudEntretien.updateToPlannedById(interviewId);
    break;
  case 'interviewStatus.ENDED':
    updateObservable = this.crudEntretien.updateToEndedById(interviewId);
    break;
  case 'interviewStatus.CANCELLED':
    updateObservable = this.crudEntretien.updateToCancelledById(interviewId);
    break;
  default:
    // Cas de statut de contrat non géré
    console.error('Statut de candidat non géré');
    return;
}
}

applyStatusFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

  this.dataSource.filterPredicate = (data, filter) => {
    const status = this.getStatusColor(data.intervieStatus).displayText.toLowerCase();
    return status.includes(filter);
  };

  this.dataSource.filter = filterValue;

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

showInput1 = false;
toggleInput1() {
  this.showInput1 = !this.showInput1;
}
}

