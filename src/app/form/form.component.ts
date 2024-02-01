import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  registrationForm: FormGroup;
  isEditMode: boolean = false;
  displayedColumns: string[] = ['name', 'employeeId', 'city', 'gender','actions']; // Define table columns
  dataSource: MatTableDataSource<any>;
  formDataList: any[] = []; // Array to store form data
  selectedData: any;

  constructor(private fb: FormBuilder){}  
  ngOnInit() {
    this.regForm();
    this.loadFormData();
    this.dataSource = new MatTableDataSource<any>(this.formDataList);
  }
  submitData() {
    if (this.registrationForm.valid) { 
      // Push the form data to the formDataList array
      this.formDataList.push(this.registrationForm.value);
      
      // Update the data source for the MatTableDataSource
      this.dataSource.data = this.formDataList;
      
      // Store the form data in localStorage
      localStorage.setItem('formData', JSON.stringify(this.formDataList));
      
      // Reset the form after submission
      this.registrationForm.reset();
      
      // Exit edit mode
      this.isEditMode = false;
    }
  }
  
  regForm(){
    this.registrationForm=this.fb.group({
      name: ['', Validators.required],
      employeeId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      city: ['', Validators.required],
      gender: ['', Validators.required]
    })
  }
  loadFormData() {
    const formData = JSON.parse(localStorage.getItem('formData'));
    if (formData) {
      this.formDataList = formData; // Assign the loaded data to formDataList
      this.dataSource = new MatTableDataSource<any>(this.formDataList); // Initialize dataSource with the loaded data
    } else {
      this.formDataList = []; // Initialize an empty array if no data is found in localStorage
      this.dataSource = new MatTableDataSource<any>([]); // Initialize an empty dataSource
    }
  }
  
  editForm(row: any,){
    this.isEditMode = true;
    this.selectedData = row;
    this.registrationForm.patchValue({
      name: this.selectedData.name,
      employeeId: this.selectedData.employeeId,
      city: this.selectedData.city,
      gender: this.selectedData.gender
    });
    console.log(this.registrationForm)
  }
  deleteRow(row: any): void {
    const index = this.formDataList.indexOf(row);
    if (index !== -1) {
      this.formDataList.splice(index, 1);
      localStorage.setItem('formData', JSON.stringify(this.formDataList)); // Update local storage
      this.dataSource.data = this.formDataList; // Update the data source
    }
  }
updateData(){
  if (this.registrationForm.valid) { 
    const index = this.dataSource.data.indexOf(this.selectedData);
    if (index !== -1) {
      // Update the existing element with the new form values
      this.dataSource.data[index] = this.registrationForm.value;
      // Refresh the data source
      this.dataSource._updateChangeSubscription();
      this.registrationForm.reset();
      this.isEditMode = false;
    }
  } else {
    alert('Form is invalid');
  }
}
}
