import { CrudService } from './../candidat-crud.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { NgxTablePopupComponent } from 'app/views/cruds/crud-ngx-table/ngx-table-popup/ngx-table-popup.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Fruit } from 'assets/examples/material/input-chip/input-chip.component';
import { FormBuilder, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Civility, Employee, EmployeeStatus, MaritalSituation, Provenance, Title } from 'app/shared/models/Employee';

import { LanguageLevel, Languages } from 'app/shared/models/Language';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs-compat';
import { PrintSharedService } from 'app/shared/services/PrintShared.service';


@Component({
  selector: 'app-candidat-crud',
  templateUrl: './candidat-crud-table.component.html',
  styleUrls: ['./candidat-crud-table.component.scss'],
})


export class CandidatCrudTableComponent implements OnInit {
  formData = {}
  console = console;
  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  public itemForm: FormGroup;;
  selectedFile: File;
  formWidth = 200; 
  formHeight = 700; 
  title :string[]= Object.values(Title);
  EmployeeStatus :any= Object.values(EmployeeStatus);
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Fruit[] = [];
  defaultStatus = EmployeeStatus.PRE_QUALIFIED;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  public dataSource: any;
  public displayedColumns: any;
  public getEmployeesub: Subscription;
  submitBtnLabel = 'Save';
  editMode = false;
  employeeId: number //| null = null;
  employeeList: Employee[];
  filteredEmployees: Employee[] = [];
  filteredStatusOptions: string[];


  constructor(
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private crudService: CrudService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private router: Router,
    private printService: PrintSharedService, ) { }
   
  printCv(cvData: string) {
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = cvData;
    window.print();
    document.body.innerHTML = originalContents;
  }
  ngOnInit() {
    
    this.displayedColumns = this.getDisplayedColumns();
    this.getEmployees();
  }


  updateEmployee(id: number){
    this.router.navigate(["candidatUpdate/updateCandidat", id]);
  }
  goToCV() {
    this.router.navigate(['cvCandidat/cvCandidat-crud']);
  }
  
  /*goToTemplate() {
    this.router.navigate(['templcv/templateDuCv']);
  }*/

  getDisplayedColumns() {
    return ['firstName', 'lastName', 'title',  'status', 'actions'];
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    if (this.getEmployeesub) {
      this.getEmployeesub.unsubscribe()
    }
  }

  
  

  getEmployees() {    
    this.getEmployeesub = this.crudService.getItems()
      .subscribe((data:any)  => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })

  }
  

  applyFilterr(event: Event, key: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const filterWords = filterValue.split(' ');
  
    this.dataSource.filterPredicate = (data, filter) => {
      // Split the data value into words and convert to lowercase
      const dataWords = data[key].trim().toLowerCase().split(' ');
  
      // Check if all filter words are present in the data (case-insensitive)
      return filterWords.every(word => {
        return dataWords.some(dataWord => dataWord.indexOf(word.toLowerCase()) !== -1);
      });
    };
  
    this.dataSource.filter = filterValue;
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
 
  
  
  applyStatusFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    this.dataSource.filterPredicate = (data, filter) => {
      const status = this.getStatusColor(data.employeeStatus).displayText.toLowerCase();
      return status.includes(filter);
    };
  
    this.dataSource.filter = filterValue;
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  
  
  
  
  deleteCandidate(row) {
    this.confirmService.confirm({message: `Voulez vous vraiment supprimer ${row.lastName} ${row.firstName}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Supprission du candidat');
          this.crudService.deleteItem(row.id)
            .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Candidat supprimé!', 'OK', { duration: 20});
              this.getEmployees();
            })
        }
      })
  }

add(){
  this.router.navigateByUrl('cvCandidat/cvCandidat-crud');
}



 applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
 
 }



  getStatusColor(employeeStatus: string): { color: string, displayText: string } {
    const STATUS_DATA = {
      IN_PROCESS: { color: 'primary', displayText: 'En processus' },
      IN_PROGRESS: { color: 'primary', displayText: 'En progrès' },
      PRE_QUALIFIED: { color: 'red', displayText: 'Non qualifié' },
      TOP_PROFILES: { color: 'purple', displayText: 'Top profiles' },
      CONVERTED_TO_RESOURCE: { color: 'purple', displayText: 'Converti en ressource ' },
      DO_NOT_CONTACT : { color:'red', displayText: 'A ne plus contacter' },
      ARCHIVE: { color: 'gray', displayText: 'Archivé' }
    };
    return STATUS_DATA[employeeStatus] || { color: 'primary', displayText: 'En processus' };
}

changeEmployeeStatus(employeeStatus: string, employeeId: number): void {
  console.log('Changing employee status to:', employeeStatus);
  let updateObservable: Observable<any>;
  switch (employeeStatus) {
    case 'employeeStatus.IN_PROCESS':
      updateObservable = this.crudService.updateToInProcessById(employeeId);
      break;
    case 'employeeStatus.IN_PROGRESS':
      updateObservable = this.crudService.updateToInProgressById(employeeId);
      break;
    case 'employeeStatus.PRE_QUALIFIED':
      updateObservable = this.crudService.updateToPreQualifiedById(employeeId);
      break;
    case 'employeeStatus.TOP_PROFILES':
      updateObservable = this.crudService.updateToTopProfilesById(employeeId);
      break;
      case 'employeeStatus.DO_NOT_CONTACT':
        updateObservable = this.crudService.updateToDoNotContactById(employeeId);
        break;
    case 'employeeStatus.CONVERTED_TO_RESOURCE':
      updateObservable = this.crudService.updateToConvertedToResourceById(employeeId);
      break;
    case 'employeeStatus.ARCHIVE':
      updateObservable = this.crudService.updateToArchiveById(employeeId);
      break;
    default:
      // Cas de statut de contrat non géré
      console.error('Statut de candidat non géré');
      return;
  }
  
  updateObservable.subscribe(
    (data) => {
      // handle success
      console.log('Mise à jour effectuée avec succès');
      this.getEmployees();    
    },
    (error) => {
      console.error('Erreur lors de la mise à jour : ', error);
    }
  );
}



employeeTitleMap = {
  [Title.FRONT_END_DEVELOPER]: 'Développeur Front-End',
  [Title.BACK_END_DEVELOPER]: 'Développeur Back-End',
  [Title.FULLSTACK_DEVELOPER]: 'Développeur Full-Stack',
  [Title.CRM]: 'CRM',
  [Title.HUMAN_RESOURCE_MANAGER]: 'Responsable des Ressources Humaines',
  [Title.HUMAN_RESOURCE]: 'Ressources Humaines',
  [Title.PROJECT_MANAGER]: 'Chef de Projet',
  [Title.TECH_LEAD]: 'Chef de Projet',
  [Title.UI_UX_DESIGNER]: 'Concepteur UI/UX',
  [Title.QA_ENGINEER]: 'Ingénieur QA',
  [Title.DEVOPS_ENGINEER]: 'Ingénieur DevOps',
  [Title.WEB_DEVELOPER]: 'Développeur Web',
  [Title.OFFICE_MANAGER]: 'Responsable d Agence',
  [Title.ACCOUNTANT]: 'Comptable',
  [Title.SALES_REPRESENTATIVE]: 'Représentant Commercial',
  [Title.CUSTOMER_SUPPORT_SPECIALIST]: 'Spécialiste du Support Client',
  [Title.MARKETING_COORDINATOR]: 'Coordinateur Marketing'
  
};

showInput1 = false;
showInput2 = false;
showInput3 = false;
showInput4 = false;



toggleInput1() {
  this.showInput1 = !this.showInput1;
}

toggleInput2() {
  this.showInput2 = !this.showInput2;
}

toggleInput3() {
  this.showInput3 = !this.showInput3;
}
toggleInput4() {
  this.showInput4 = !this.showInput4;
}



/*printCvById(employeeId: string) {
  const cvUrl = `/candidat/${employeeId}`;
  const printWindow = window.open(cvUrl, '_blank');

  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  } else {
    console.error('Failed to open print window.');
  }
}*/

printCV(employee: any) {
  this.printService.printCV(employee);
}

}
