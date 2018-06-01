import { Component,Input,OnInit,Output,EventEmitter } from '@angular/core';
import { Router,ActivatedRoute } from "@angular/router";
import { Global } from '../../global';
import {NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';
import { BoardService } from '../../../services/board-service';
import { Userservice } from '../../../services/userservice';
import { GroupService } from '../../../services/group-service';
import { DataService } from '../../../services/data-service';
import * as _ from 'lodash';
import { DatePipe,Location } from '@angular/common';
@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    providers: [NgbDropdownConfig],
    styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit{

    user:any;
    groupname:any;
    isActive = false;
    showMenu = '';
    selected:any;
    selectedlevel:any;
    groups:any=[];
    showGroups:any;
    archivesurl:any;
    eventCalled() {
        this.isActive = !this.isActive;
    }
    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }
    addFeedClass(element: any) {

        if (element === this.showMenu) {

            this.showMenu = '0';
        } else {

            this.showMenu = element;

        }
    }

   select(item){
        this.selected = (this.selected === item ? null : item);
     }
     isactive(item){
       return this.selected === item;
     }
     selectlevel(item){
          this.selectedlevel = (this.selectedlevel === item ? null : item);
       }
       isactivelevel(item){
         return this.selectedlevel === item;
       }



    constructor(public router:Router,public datepipe:DatePipe,public variab:Global,config: NgbDropdownConfig,public boardservice:BoardService,public userservice:Userservice,public dataservice:DataService,public groupService:GroupService,public route:ActivatedRoute){


    }
    ngOnInit(){



    }
}
