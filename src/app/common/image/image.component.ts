import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageService } from './image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {


  target: HTMLInputElement;
  profile_image_key: string;

  @Input('profile_image_url') profile_image_url: string;
  @Input('css_class') css_class: string;
  @Output() onUploaded = new EventEmitter<any>();

  constructor(private imageService: ImageService) { }

  ngOnInit() {
    console.log('css_class', this.css_class);
  }

  reset() {
    this.profile_image_url = '';
  }

  fileChanged(e: Event) {
    if (e.srcElement.id === 'file-input') {
      this.target = e.target as HTMLInputElement;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.profile_image_url = event.target.result;
      }
      console.log('[ImageComponent] profile image size ', this.target.files[0].size);
      reader.readAsDataURL(this.target.files[0]);
      this.imageService.saveProfilePicture(this.target.files[0]).then(resp => {
        this.profile_image_key = resp.file_management_key;
        this.onUploaded.emit(this.profile_image_key);
        console.log('[ImageComponent] profile image saved ', this.profile_image_key);
      })
    }
  }

}
