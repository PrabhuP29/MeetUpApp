import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Photo } from '../_models/photo';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsersWithRoles(){
    return this.http.get<Partial<User[]>>(this.baseUrl+'admin/users-with-roles');
  }

  updateUserRoles(username, roles){
    return this.http.post(this.baseUrl+'admin/edit-roles/'+username+'?roles='+roles,{});
  }

  getPhotosForApproval(){
    return this.http.get<Partial<Photo[]>>(this.baseUrl+'admin/photos-to-approve');
  }

  approvePhoto(photo: Photo){
    return this.http.post(this.baseUrl+'admin/approve-photo',photo);
  }

  rejectPhoto(photo: Photo){
    return this.http.post(this.baseUrl+'admin/reject-photo', photo);
  }
}
