import { referentielRoutes } from './../referentiel.routing';

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Civility, MaritalSituation, Provenance, Title } from 'app/shared/models/Employee';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { referentielService } from '../referentiel.service';
import { QuestionCategory } from 'app/shared/models/QuestionCategory';
import { ExperienceLevel } from 'app/shared/models/AssOfferCandidate';
import { QuestionType } from 'app/shared/models/QuestionType';

@Component({
  selector: 'referentiel-crud',
  templateUrl: './referentielcrud-table.component.html'
})


export class referentielCrudTableComponent implements OnInit {
  formData = {}
  console = console;
  ExperienceLevel :string []= Object.values(ExperienceLevel);
  public itemForm: FormGroup;;
 
  selectedFile: File;
  title :string[]= Object.values(Title);

  formWidth = 200; //declare and initialize formWidth property
  formHeight = 700; //declare and initialize formHeight property
  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 

  public dataSource: MatTableDataSource<QuestionCategory>;
  public questionTypesDataSource: MatTableDataSource<QuestionType>;
  public displayedColumns: any;
  public getItemSub: Subscription;
  public getItemSub2: Subscription;
 

  constructor(
    private router : Router,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private crudService: referentielService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService
  ) 
  {     this.dataSource = new MatTableDataSource<QuestionCategory>([]);
    this.questionTypesDataSource = new MatTableDataSource<QuestionType>([]);}

  ngOnInit() {
   this.displayedColumns = this.getDisplayedColumns();
    this.getItems()  ;
  }

  getDisplayedColumns() {
    return ['questionTypeName','name','level','actions' ];
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

  getItems() {    
    this.getItemSub = this.crudService.getItems()
      .subscribe((data: any) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  
        // Call getAllQuestiontypes() and assign the result to another data source
        this.crudService.getAllQuestiontypes().subscribe((questionTypes: any) => {
          this.questionTypesDataSource = new MatTableDataSource(questionTypes);
          // Perform any additional configuration for the question types data source
        });
      });
  }
  



  deleteItem(row) {
    this.confirmService.confirm({message: `Delete ${row.name}?`})
      .subscribe(res => {
        if (res) {
          this.loader.open('Supprssion du questionnaire');
          this.crudService.deleteItem(row)
            .subscribe((data:any)=> {
              this.dataSource = data;
              this.loader.close();
              this.snack.open('Questionnaire supprimée!', 'OK', { duration: 2000 });
              this.getItems();
            })
        }
      })
  }

  applyFilter(event :Event){
    const FilterValue = (event.target as HTMLInputElement).value ;
     this.dataSource.filter = FilterValue.trim().toLowerCase();
 
 }
 goToForm(){
  this.router.navigateByUrl('formReferentiel/referentielForm');
 }


 ExperienceLevelMap={
  [ExperienceLevel.JUNIOR]:'Junior',
  [ExperienceLevel.MID_LEVEL]:'Confirmé',
  [ExperienceLevel.SENIOR]:'Senior',
  [ExperienceLevel.EXPERT]:'Expert', }
}
