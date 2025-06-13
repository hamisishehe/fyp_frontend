import { Component, OnInit } from '@angular/core';
import { UserDetails } from '../../../Models/userModel';
import { StudentData } from '../../../Models/StudentModel';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { DataTable } from 'simple-datatables';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CollageModel } from '../../../Models/collageModel';

@Component({
  selector: 'app-collage',
  imports: [HttpClientModule,FormsModule,CommonModule],
  templateUrl: './collage.component.html',
  styleUrl: './collage.component.css'
})
export class CollageComponent implements OnInit{

    isOpen = false;
  isUploadOpen=false;
  isLoading: boolean = true;

isUpdateModalOpen = false;
selectedStudent: any = {};  // will store student info for editing


  userData : UserDetails | null = null;
  collage: CollageModel [] = [];


  Coordinator_id : number = 0;
  short_name : string='';
  name : string='';



  constructor(private http : HttpClient ){

  }


  ngOnInit() {

    setTimeout(() => {
      this.isLoading = false;
    }, 100);

    this.getProfile();
    this.GetCollages();

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

  Insert_Collage(){

    console.log("................")

    const form_data = {
      name: this.name,
      short_name: this.short_name,
      coordinator_id: this.Coordinator_id
    };

    console.log(form_data);

    const headers = { 'Content-Type': 'application/json' };


    this.http.post(`${environment.baseUrl}/add_collage`, form_data,  { headers })
      .subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Collage added',
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
