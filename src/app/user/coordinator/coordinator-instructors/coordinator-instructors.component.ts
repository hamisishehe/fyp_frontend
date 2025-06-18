import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTable } from 'simple-datatables';
import { environment } from '../../../environments/environment';
import { UserDetails } from '../../../Models/userModel';
import Swal from 'sweetalert2'
import { InstructorData } from '../../../Models/InstructorModel';
import { DepartmentModel } from '../../../Models/departmentModel';

@Component({
  selector: 'app-coordinator-instructors',
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './coordinator-instructors.component.html',
  styleUrl: './coordinator-instructors.component.css'
})
export class CoordinatorInstructorsComponent implements OnInit{

  isOpen = false;

  userData : UserDetails | null = null;
  instructors: InstructorData [] = [];
  departments: DepartmentModel [] = [];
  isLoading : boolean = false;


  Coordinator_id : number = 0;
  first_name : string='';
  middle_name : string='';
  last_name : string='';
  gender:string='';
  phone_number : string='';
  email : string='';
  title : string='';
  department_id:number=0;

    editId: number | null = null;
    pageSize = 10;
    currentPage = 1;
    searchText = '';
    editIndex: number | null = null;
    isUpdateModalOpen = false;
    mselectedStudent: any = {};  // will store student info for editing



  constructor(private http : HttpClient ){

  }


  ngOnInit() {

    this.getProfile();
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

            console.log(this.userData);

            this.GetDepartment();
          },
          (error) => {
            console.error('Error fetching user profile', error);
          }
        );
    } else {
      console.error('No token found');
    }
  }

  Insert_NewInstructor(){

    console.log("................")

    const form_data = {
      first_name: this.first_name,
      middle_name: this.middle_name,
      last_name: this.last_name,
      gender:this.gender,
      phone_number: this.phone_number,
      email: this.email,
      title: this.title,
      coordinator_id: this.Coordinator_id,
      department_id:this.department_id // make sure this is set
    };

    console.log(form_data);

    const headers = { 'Content-Type': 'application/json' };


    this.http.post(`${environment.baseUrl}/add_instructor`, form_data,  { headers })
      .subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Instructor added',
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


GetDepartmentById(){

  console.log("................")

  this.http.get<DepartmentModel[]>(`${environment.baseUrl}/departments/${this.department_id}`)
    .subscribe(
      response => {

        console.log("1................")
        this.departments = response;

        console.log(this.departments);
        console.log("2................")

      },
      error => {


        console.log(error);
      }
    );
}


  GetDepartment(){

    console.log("................")

    this.http.get<any>(`${environment.baseUrl}/department_id/${this.userData?.department}`)
      .subscribe(
        response => {


          this.department_id = response.department_id;
          console.log(this.department_id);
          this.initializeTable();
          this.GetDepartmentById();

          this.GetInstructors();

        },
        error => {


          console.log(error);
        }
      );
  }



GetInstructors(){

  this.http.get<InstructorData[]>(`http://127.0.0.1:5000/instructors/by-department/${this.department_id}`)
    .subscribe(
      response => {

        this.instructors = response;
        console.log(response);
        this.initializeTable();

      },
      error => {


        console.log(error);
      }
    );
}



get filteredCourse() {
  if (!this.searchText) return this.instructors;
  return this.instructors.filter(item =>
    (item.first_name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
     item.last_name?.toLowerCase().includes(this.searchText.toLowerCase())
     )
  );
}

get paginatedVenues() {
  if (this.pageSize === this.filteredCourse.length) {
    // show all if pageSize = all
    return this.filteredCourse;
  }
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  return this.filteredCourse.slice(start, end);
}

get totalPages() {
  return Math.ceil(this.filteredCourse.length / this.pageSize) || 1;
}

updateInstructor(item : any) {

  console.log("clicked");
    const payload = {
      first_name: item.first_name,
      middle_name: item.middle_name,
      last_name: item.last_name,
      gender:item.gender,
      phone_number: item.phone_number,
      email: item.email,
      title: item.title,
    };


    console.log(payload);
    console.log(item.id);


  this.isLoading = true;

  this.http.put(`${environment.baseUrl}/update_instructor/${item.id}`, payload).subscribe({
    next: (res) => {
      console.log('Update successful', res);
      this.isLoading = false;
      this.isUpdateModalOpen = false;
      // You can refresh your student list here if needed

      window.location.reload();

      this.GetInstructors();
    },
    error: (err) => {
      console.error('Update failed', err);
      this.isLoading = false;
    }
  });
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




  initializeTable(): void {
    setTimeout(() => {
      let datatable = new DataTable('#search-table');
      console.log('Table initialized');
    }, 100);
  }

}
