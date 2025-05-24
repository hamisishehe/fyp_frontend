import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserDetails } from '../../../Models/userModel';
import { DepartmentModel } from '../../../Models/departmentModel';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { DataTable } from 'simple-datatables';
import { FormsModule } from '@angular/forms';
import { CollageModel } from '../../../Models/collageModel';

@Component({
  selector: 'app-department',
  imports: [HttpClientModule,CommonModule, FormsModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentComponent implements OnInit {


     isOpen = false;
    isUploadOpen=false;
    isLoading: boolean = true;

  isUpdateModalOpen = false;
  selectedStudent: any = {};  // will store student info for editing


    userData : UserDetails | null = null;
    department: DepartmentModel [] = [];
    collage: CollageModel [] = [];


    Coordinator_id : number = 0;
    short_name : string='';
    name : string='';
    collage_id : number = 0;



    constructor(private http : HttpClient ){

    }


    ngOnInit() {

      setTimeout(() => {
        this.isLoading = false;
      }, 100);

      this.getProfile();
      this.GetCollages();
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

    Insert_Department(){

      console.log("................")

      const form_data = {
        name: this.name,
        short_name: this.short_name,
        collage_id:this.collage_id,
      };

      console.log(form_data);

      const headers = { 'Content-Type': 'application/json' };


      this.http.post(`${environment.baseUrl}/add_departments`, form_data,  { headers })
        .subscribe(
          response => {
            Swal.fire({
              icon: 'success',
              title: 'Department Inseted',
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


GetCollages(){

  console.log("................")

  this.http.get<CollageModel[]>(`${environment.baseUrl}/collages`)
    .subscribe(
      response => {

        this.collage = response;
        console.log(this.collage);
        this.initializeTable();

      },
      error => {


        console.log(error);
      }
    );
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
