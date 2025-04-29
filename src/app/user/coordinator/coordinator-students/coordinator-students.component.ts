import { Component, OnInit } from '@angular/core';
import { UserDetails } from '../../../Models/userModel';
import { StudentData } from '../../../Models/StudentModel';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { DataTable } from 'simple-datatables';

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


  Coordinator_id : number = 0;
  programme : string='';
  total_students : string='';



  constructor(private http : HttpClient ){

  }


  ngOnInit() {

    setTimeout(() => {
      this.isLoading = false;
    }, 100);

    this.getProfile();
    this.GetStudents();

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

  Insert_Student(){

    console.log("................")

    const form_data = {
      programme: this.programme,
      total_students: this.total_students,
      coordinator_id: this.Coordinator_id  // make sure this is set
    };

    console.log(form_data);

    const headers = { 'Content-Type': 'application/json' };


    this.http.post(`http://127.0.0.1:5000/add_student_program`, form_data,  { headers })
      .subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Student added',
            showConfirmButton: false,
            timer: 1500,
          });

          window.location.reload();

        },
        error => {

          Swal.fire({
            icon: "error",
            title: "Oops...",
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

  console.log("................")

  this.http.get<StudentData[]>(`http://127.0.0.1:5000/students`)
    .subscribe(
      response => {

        this.students = response;
        console.log(this.students);
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


  openUpdateModal(id: number) {
    this.isOpen = true;

    console.log('Opening modal for ID:', id);
    // Your logic to open modal here
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
