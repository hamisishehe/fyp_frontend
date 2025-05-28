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
    pageSize = 10;
    currentPage = 1;
    searchText = '';
    editIndex: number | null = null;


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

  insert_Program(){

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




GetStudents(){

  console.log("................");

  this.http.get<StudentData[]>(`${environment.baseUrl}/students`)
    .subscribe(
      response => {

         console.log("................");

        this.students = response;
        console.log(response);


      },
      error => {

        console.log(error);
      }
    );
}





updateStudentProgram(item : any) {

  console.log("clicked");
  const payload = {
    programme: item.programme,
    programme_code:item.programme_code,
    total_students: item.total_students,
  };

  this.isLoading = true;

  this.http.put(`${environment.baseUrl}/update_student_program/${item.id}`, payload).subscribe({
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




  GetDepartment(){

    console.log("................")

    this.http.get<DepartmentModel[]>(`${environment.baseUrl}/departments`)
      .subscribe(
        response => {

          this.department = response;
          console.log(this.department);

        },
        error => {


          console.log(error);
        }
      );
  }


get filteredVenues() {
  if (!this.searchText) return this.students;
  return this.students.filter(item =>
    (item.programme?.toLowerCase().includes(this.searchText.toLowerCase()) ||
     item.programme_code?.toLowerCase().includes(this.searchText.toLowerCase())
     )
  );
}

get paginatedVenues() {
  if (this.pageSize === this.filteredVenues.length) {
    // show all if pageSize = all
    return this.filteredVenues;
  }
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  return this.filteredVenues.slice(start, end);
}

get totalPages() {
  return Math.ceil(this.filteredVenues.length / this.pageSize) || 1;
}

cancelEdit() {
  this.editIndex = null;
}


openUpdateModal(index: number) {
  this.editIndex = index;

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


}
