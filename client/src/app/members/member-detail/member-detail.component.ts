import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MembersService } from 'src/app/_Services/members.service';
import { MessageService } from 'src/app/_Services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab: TabDirective;
  messages: Message[] = [];
  
  constructor(private memberService:MembersService, private route:ActivatedRoute,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      console.log(data.member);
      this.member = data.member;
    })

    this.route.queryParams.subscribe(params => {
      params.tab? this.selectTab(params.tab): this.selectTab(0);
    })

    this.galleryOptions=[
      {
        width:'500px',
        height: '500px',
        imagePercent:100,
        thumbnailsColumns:4,
        imageAnimation:NgxGalleryAnimation.Slide,
        preview:false

      }
    ]
    
    this.galleryImages = this.getImages();
  }

  getImages():NgxGalleryImage[]{
    const imageUrls = [];
    for(const photo of this.member.photos){
      imageUrls.push({
        small:photo?.url,
        medium:photo?.url,
        big:photo?.url
      })
    }

    return imageUrls;
  }

  // loadMember(){
  //   this.memberService.getMember(this.route.snapshot.paramMap.get('username')).subscribe(member =>{
  //     this.member = member;
  //     this.galleryImages = this.getImages();
  //   })
 
  // }

  loadMessages(){
    this.messageService.getMessageThread(this.member.username).subscribe(messages => {
      this.messages = messages;
    });
  }

  selectTab(tabId: number){
    console.log(tabId);
    this.memberTabs.tabs[tabId].active = true;
  }

  onTabActivated(data: TabDirective){
    this.activeTab = data;
    console.log(this.activeTab.heading);
    if(this.activeTab.heading === 'Messages' && this.messages.length === 0){
      console.log(this.activeTab.heading);
      this.loadMessages();
    }
  }


}
