import { catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  Validators,  FormGroup, FormBuilder, FormArray, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Interview, InterviewMode, InterviewType, interviewLocation } from 'app/shared/models/Interview';
import { Employee } from 'app/shared/models/Employee';


@Component({
  selector: 'app-ngx-table-popup',
  templateUrl: './evaluation-popup.component.html',
  styleUrls:  ['./evaluation-popup.component.scss']
})
export class evaluationPopupComponent implements OnInit {
  
  submitted = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  offerForm : FormGroup;
  formWidth = 200; //declare and initialize formWidth property
  formHeight = 700; //declare and initialize formHeight property

  ////////////////Interview Form/////////////
  interviewType :string []= Object.values(InterviewType);
  interviewMode :string []= Object.values(InterviewMode);
  interviewlocation:string []= Object.values(interviewLocation);
  interview: Interview;
  employee:Employee;


  selectedFile: File;
  constructor( 
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<evaluationPopupComponent>,
    private fb: FormBuilder,
    private http: HttpClient
  ) { }


  ngOnInit() {
    
  }

  closePopup(): void {
    this.dialogRef.close();
  }




}