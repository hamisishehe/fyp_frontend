import { Component, OnInit } from '@angular/core';
import { Venue } from '../../../Models/VenueModel';
import { UserDetails } from '../../../Models/userModel';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { DataTable } from 'simple-datatables';
import { CollageModel } from '../../../Models/collageModel';

@Component({
  selector: 'app-venue',
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './venue.component.html',
  styleUrl: './venue.component.css'
})
export class VenueComponent implements OnInit{

    isOpen = false;
    isUploadOpen=false;
    isLoading: boolean = true;

  isUpdateModalOpen = false;

    userData : UserDetails | null = null;
    venue: Venue [] = [];
    collage:CollageModel [] = [];



    Coordinator_id : number = 0;

    location : string='';
    name : string='';
    type:string='';
    collage_id : number = 0;
    teaching_capacity: number = 0;
    total_exam: number = 0;


    pageSize = 10;
    currentPage = 1;
    searchText = '';
    editIndex: number | null = null;

    exam_capacity = this.teaching_capacity / 2;




    constructor(private http : HttpClient ){

    }


    ngOnInit() {

      setTimeout(() => {
        this.isLoading = false;
      }, 100);

      this.getProfile();
      this.GetVenue();
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

    Insert_Venue(){

      this.total_exam = this.teaching_capacity / 2;

      console.log("................")

      const form_data = {
        name: this.name,
        location: this.location,
        exam_capacity : this.total_exam,
        teaching_capacity:this.teaching_capacity,
        type:this.type,
      };

      console.log(form_data);

      const headers = { 'Content-Type': 'application/json' };


      this.http.post(`${environment.baseUrl}/add_venue`, form_data,  { headers })
        .subscribe(
          response => {
            Swal.fire({
              icon: 'success',
              title: 'venue Inseted',
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




GetVenue(){

  console.log("................")

  this.http.get<Venue[]>(`${environment.baseUrl}/venues`)
    .subscribe(
      response => {

        this.venue = response;
        console.log(response);
        this.initializeTable();

      },
      error => {


        console.log(error);
      }
    );
}


get filteredVenues() {
  if (!this.searchText) return this.venue;
  return this.venue.filter(item =>
    (item.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
     item.location?.toLowerCase().includes(this.searchText.toLowerCase()) ||
     item.type?.toLowerCase().includes(this.searchText.toLowerCase()))
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

updateVenue(item: any) {
  this.http.put(`${environment.baseUrl}/update_venue/${item.id}`, {
    name: item.name,
    location: item.location,
    exam_capacity: item.teaching_capacity / 2, // optionally handle this too
    teaching_capacity: item.teaching_capacity,
    type: item.type
  }).subscribe({
    next: (res) => {
      Swal.fire({
              icon: 'success',
              title: 'venue Updated',
              showConfirmButton: false,
              timer: 1500,
            });
      console.log('Updated:', res);
      this.editIndex = null;
       window.location.reload();
    },
    error: (err) => {
      Swal.fire({
              icon: 'error',
              title: err,
              showConfirmButton: false,
              timer: 1500,
            });
      console.error('Update error:', err);
    }
  });
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
