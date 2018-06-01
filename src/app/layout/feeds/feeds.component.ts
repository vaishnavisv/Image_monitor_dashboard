import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { routerTransition } from '../../router.animations';
import { fadeInAnimation } from '../../fade-in.animation';
import { DataService } from '../../services/data-service'; //Import dataservice file to get the hidden feeds
import { Global } from '../../shared/global';//Import Global to use global variables in the feeds's local scope
import * as _ from 'lodash'
import { DatePipe } from '@angular/common';
import { FeedService } from '../../services/feed-service';//Import feed service to get feeds
import { Userservice } from '../../services/userservice';//Import feed service to get feeds
import { Utilities } from '../../shared';//Import utilities to perform sorting and filtering
@Component({

  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss'],
  animations: [routerTransition()]
})

export class FeedsComponent implements OnInit {
spinnerState:boolean=false;//state variable to store the status of the spinner to display
p:any; //variable to store the current page nuber
pageheading:any;  //variable to store and display as page heading
feeds:any=[];          //variable to store feeds to display
view:any;      //variable to store the view state
date:any;      //variable to store the state of dates to filters
user:any;     //variable to store the username
alertNofeedsinrange:boolean=false;//alert variable to store boolean values if the given input dates has not feeds
feedlink:any;
  constructor(private datepipe:DatePipe,public variab:Global,public dataservice:DataService,public feedService:FeedService,public userService:Userservice,private route: ActivatedRoute,public util:Utilities) { }

  //On loading Component
  ngOnInit() {

    this.user =localStorage.getItem('name');

        this.feedService.getlatestfeeds(this.user).then(res=>{
              this.feeds = res;

            console.log(this.feeds);
          });
        //Get the user session object from local Storage and store it in the usersession variable
        var usersession = localStorage.getItem("superlogin.session");
        //Parse the usersession variable to JSON object and store in the jsonusersession variable
        var jsonusersession = JSON.parse(usersession);
        //Get the user db's url and store in the url variable
        let url = jsonusersession.userDBs.supertest;
        //Set the user db's url to another local Storage variable
         localStorage.setItem('url',url);




        //this.usersview = localStorage.getItem('view');

        this.view = null;




      }

  /*addcontent(){
    this.feedService.getUrlfeeds(this.feedlink).then(res=>{
        this.feeds = res;
    })
  }*/

  //Function to handle view event from page-header component
  public handleView(childView:any){
    this.view= childView;

  }
  //Function to handle Date event from page-header component
  public handleDate(childDates:any){
    this.util.filterDate(childDates,this.variab.globalfeeds).then(res=>{
      //console.log(res);
      if(res['length'] == 0){
        this.alertNofeedsinrange = true;
        setTimeout(() => this.alertNofeedsinrange = false, 2000);
      }
      else{
        this.feeds = res;
      }
    })

  }
  //Function to handle clear Date event from page-header component
  handleClearDate(eve){
    if(eve == 'reset'){
      this.feeds = this.variab.globalfeeds;
    }
  }
  //Function to handle sort label like 'Latest','Oldest' feeds when clicked from page-header component
  handleSort(childSortLabel:any){
    var checkForCategory:any=[];
    if(childSortLabel === 'Latest'){
      //If input is latest sort the feeds in the descending order
      this.util.sortdescending(this.variab.globalfeeds).then(res=>{
        this.feeds = res;
      })

    }
    if(childSortLabel === 'Oldest'){
      //If input is oldest sort the feeds in the descending order
      this.util.sortascending(this.variab.globalfeeds).then(res=>{
        this.feeds = res;
      })
    }
  }
  //Function to handle refreshed feeds when clicked from page-header component
/*  handleRefresh(childrefresh:any){
    this.userService.pullnewFeeds().then(res=>{
     });
    this.spinnerState=true;
    this.feeds.length = 0;
    this.getfeedsOnFeedname(childrefresh).then(val=>{
      if(val['length']==0){
            this.getfeedsOnSubcategory(childrefresh,'null').then(val=>{
                  this.variab.globalfeeds = val;

                  //Reverse the filter to sort according to latest feeds
                   this.variab.globalfeeds.reverse();
                //Call the checkForDeleted method to check for hidden/removed feeds
                //and remove those feeds from the display array
                      this.feeds=this.variab.globalfeeds;
                     // console.log("every",this.feeds);
                      if(this.variab.globalfeeds){
                        this.spinnerState=false;
                      }
            });


      }
      else{
          this.variab.globalfeeds = val;

          //Reverse the filter to sort according to latest feeds
           this.variab.globalfeeds.reverse();
        //Call the checkForDeleted method to check for hidden/removed feeds
        //and remove those feeds from the display array
              this.feeds=this.variab.globalfeeds;
             // console.log("every",this.feeds);
              if(this.variab.globalfeeds){
                this.spinnerState=false;
              }
      }

    //this.getfeedsOnSubcategory(childrefresh,'null').then(val=>{





    });

  }*/


  onpage(){
    window.scroll(0,0);
  }


}
