import { Component,Input,ViewChild,ElementRef} from '@angular/core';
import { NgbModal, ModalDismissReasons,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { ReadlaterStore } from '../../store/readlater-store';
import { Global } from '../../../shared/global';
import { DataService } from '../../../services/data-service';
import { FeedService } from '../../../services/feed-service';
import { Router } from '@angular/router';
import {NgbAlertConfig} from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  modalRef: NgbModalRef;
    @Input() item: any;
    @Input() guid: any;
    @Input() fullUrl: any;
    closeResult: string;
    @ViewChild('sharewithteam') teammodal:any;
    date:any;
    photoform:FormGroup;
    alertSucuessful:boolean=false;
    constructor(private modalService: NgbModal,public elementRef:ElementRef,public readlaterstore:ReadlaterStore,public variab:Global,
      public dataservice:DataService,public router:Router,public datePipe:DatePipe,
      private fb: FormBuilder,public feedService:FeedService,public ngAlert:NgbAlertConfig,) {
      this.date = new Date();

      this.photoform = new FormGroup({
        'title': new FormControl(null, [Validators.required]),
        'description': new FormControl(null, [Validators.required]),
        'tags': new FormControl(null, [Validators.required]),
        'usd': new FormControl(null, [Validators.required]),
        'copyrights': new FormControl(),
        'inr': new FormControl(null, [Validators.required])
      });

     }


    openshareteam(content) {
       this.modalRef = this.modalService.open(this.teammodal);
       this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

    }





    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }
    addData(){

      let doc = {
        '_id':this.date.toISOString(),
        'id':this.guid,
        'title':this.photoform.controls.title.value,
        'description':this.photoform.controls.description.value,
        'tags':this.photoform.controls.tags.value,
        'copyrights':this.photoform.controls.copyrights.value,
        'price':{
          'inr':this.photoform.controls.inr.value,
          'usd':this.photoform.controls.usd.value
        }
      }
      console.log(doc);
     this.feedService.addFeed(doc).then(res=>{
        console.log(res);
        if(res['ok']==true){
          this.photoform.reset();
          this.alertSucuessful =true;
          this.ngAlert.type = 'success';
          setTimeout(() => this.alertSucuessful = false, 2000);
        }
      })
    }

}
