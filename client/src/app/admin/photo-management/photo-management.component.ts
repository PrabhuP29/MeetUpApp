import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Photo } from 'src/app/_models/photo';
import { AdminService } from 'src/app/_Services/admin.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {
  photos: Partial<Photo[]>;

  constructor(private adminService: AdminService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getPhotosForApproval();
  }

  getPhotosForApproval(){ console.log("get photos");
    this.adminService.getPhotosForApproval().subscribe(response =>{
      this.photos = response;
    });
  }

  approvePhoto(photo: Photo){
    photo.isApproved = true;
    this.adminService.approvePhoto(photo).subscribe(() =>{
      this.toastr.success("Photo Approved!")
      this.photos = this.photos.filter(x=>x.id !== photo.id);
    });
  }

  rejectPhoto(photo: Photo){
    this.adminService.rejectPhoto(photo).subscribe(() =>{
      this.toastr.success("Photo Rejected!");
      this.photos = this.photos.filter(x=>x.id !== photo.id);
    });
  }

}
