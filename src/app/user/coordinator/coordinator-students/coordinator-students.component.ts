import { Component, OnInit } from '@angular/core';
import { UserDetails } from '../../../Models/userModel';
import { StudentData } from '../../../Models/StudentModel';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { DataTable } from 'simple-datatables';
import { DepartmentModel } from '../../../Models/departmentModel';

@Component({
  selector: 'app-coordinator-students',
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './coordinator-students.component.html',
  styleUrl: './coordinator-students.component.css'
})
export class CoordinatorStudentsComponent implements OnInit{

  isOpen = false;
  isUploadOpen=false;
  isLoading: boolean = true;

isUpdateModalOpen = false;
selectedStudent: any = {};  // will store student info for editing


  userData : UserDetails | null = null;
  students: StudentData [] = [];
  department: DepartmentModel [] = [];



  Coordinator_id : number = 0;
  programme : string='';
  programme_code:string='';
  duration : number = 0;
  department_id: number =0;
  user_dept : String='';


editId: number | null = null;
 editProgramme: string = '';
 editCode: string = '';
 editTotal: number = 0;


  constructor(private http : HttpClient ){

  }


  ngOnInit() {

    setTimeout(() => {
      this.isLoading = false;
    }, 100);

    this.getProfile();
    this.GetStudents();
    this.GetDepartment();

  }


  getProfile() {
    const token = localStorage.getItem('token');

    if (token) {
      // Set the Authorization header with the Bearer token
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });



      // Make the HTTP GET request to fetch the profile
      this.http
        .get<UserDetails>(`${environment.baseUrl}/user/profile`, {
          headers,
        }) // Use baseUrl here
        .subscribe(
          (data) => {

            this.userData = data;

            this.userData = data;
            this.Coordinator_id = this.userData.id;

            console.log(this.userData.id);


          },
          (error) => {
            console.error('Error fetching user profile', error);
          }
        );
    } else {
      console.error('No token found');
    }
  }

  Insert_Program(){

    console.log("................")

    const form_data = {
      programme: this.programme,
      programme_code:this.programme_code,
      duration: this.duration,
      coordinator_id: this.Coordinator_id,  // make sure this is set
      department_id:this.department_id

    };

    console.log(form_data);

    const headers = { 'Content-Type': 'application/json' };


    this.http.post(`${environment.baseUrl}/add_student_program`, form_data,  { headers })
      .subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Program added',
            showConfirmButton: false,
            timer: 1500,
          });

          window.location.reload();

        },
        error => {

          Swal.fire({
            icon: "error",
            title: error,
            text: error,
            timer: 1500,
          });


        }
      );
}



onExcelSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.UploadExcelFile(file);
  }
}



GetStudents(){

  console.log("................");

  this.http.get<StudentData[]>(`${environment.baseUrl}/students`)
    .subscribe(
      response => {

         console.log("................");

        // if (this.user_dept == response) {

        // }

        this.students = response;
        console.log(response);
        this.initializeTable();

      },
      error => {


        console.log(error);
      }
    );
}


  GetDepartment(){

    console.log("................")

    this.http.get<DepartmentModel[]>(`${environment.baseUrl}/departments`)
      .subscribe(
        response => {

          this.department = response;
          console.log(this.department);
          this.initializeTable();

        },
        error => {


          console.log(error);
        }
      );
  }



isDragging = false;
selectedFile: File | null = null;

onDragOver(event: DragEvent) {
  event.preventDefault();
  this.isDragging = true;
}

onDragLeave(event: DragEvent) {
  event.preventDefault();
  this.isDragging = false;
}

onFileDrop(event: DragEvent) {
  event.preventDefault();
  this.isDragging = false;

  const file = event.dataTransfer?.files[0];
  if (file && this.validateExcel(file)) {
    this.selectedFile = file;
    this.UploadExcelFile(file);
  }
}

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file && this.validateExcel(file)) {
    this.selectedFile = file;
    this.UploadExcelFile(file);
  }
}

validateExcel(file: File): boolean {
  const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const isValid = validTypes.includes(file.type);
  if (!isValid) {
    Swal.fire('Invalid file', 'Please upload a valid Excel file.', 'error');
  }
  return isValid;
}

UploadExcelFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  this.http.post(`${environment.baseUrl}/upload-students`, formData)
    .subscribe(
      (response: any) => {
        Swal.fire('Success', `${response.message}`, 'success');
        this.selectedFile = null;
      },
      (error) => {
        Swal.fire('Error', error.error?.error || 'Upload failed', 'error');
      }
    );
}

updateStudentProgram() {
  const payload = {
    id: this.selectedStudent.id,
    programme: this.selectedStudent.programme,
    total_students: this.selectedStudent.total_students,
    coordinator_id: this.selectedStudent.coordinator_id
  };

  this.isLoading = true;

  this.http.put('/update_student_program', payload).subscribe({
    next: (res) => {
      console.log('Update successful', res);
      this.isLoading = false;
      this.isUpdateModalOpen = false;
      // You can refresh your student list here if needed
      this.GetStudents();
    },
    error: (err) => {
      console.error('Update failed', err);
      this.isLoading = false;
    }
  });
}



openUpdateModal(id: number) {
  const student = this.students.find(s => s.id === id);
  if (student) {
    this.editId = id;
    this.editProgramme = student.programme;
    this.editCode = student.programme_code;
    this.editTotal = student.total_students;
  }
}

saveEdit() {
  const updated = {
    programme: this.editProgramme,
    programme_code: this.editCode,
    total_students: this.editTotal
  };

  this.http.patch(`${environment.baseUrl}/update_student_program/${this.editId}`, updated).subscribe({
    next: () => {
      // Refresh list or update local array
      const index = this.students.findIndex(s => s.id === this.editId);
      if (index > -1) {
        this.students[index] = { ...this.students[index], ...updated };
      }
      this.editId = null;
      window.location.reload();
    },
    error: err => console.error("Update failed", err)
  });
}

cancelEdit() {
  this.editId = null;
}
  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }



  openUploadModal() {
    this.isUploadOpen = true;
  }

  closeUploadModal() {
    this.isUploadOpen = false;
  }





  closeUpdateModal() {
    this.isUpdateModalOpen = false;
    this.selectedStudent = {};
  }




  initializeTable(): void {
    setTimeout(() => {
      let datatable = new DataTable('#search-table');
      console.log('Table initialized');
    }, 100);
  }

}
