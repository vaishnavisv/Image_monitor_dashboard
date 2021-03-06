import { Injectable,ViewChild } from '@angular/core';
import { DataService } from '../../services/data-service';
import { FeedService } from '../../services/feed-service';//Import feed service to update feed when removed
import { ArchiveService } from '../../services/archive-service';
import {Global} from '../../shared/global';
import * as _ from 'lodash'
@Injectable()

export class Utilities {
user:any;     //variable to store the username
resultFeeds:any=[];//variable to store the intermediate results
date:Date;//variable to store the current date
constructor(public dataservice : DataService,public archiveService:ArchiveService,public feedService:FeedService,public variab:Global) { 
   this.date = new Date();
  this.user = localStorage.getItem('name');
}
//Function to check of any deleted feeds and pop the deleted feeds from the global buffer
// and display the rest of the feeds
checkForDeletedFeeds(feeds){

  let hiddenfeeds:any=[];//local variable to store hidden feeds
  return new Promise(resolve=>{
    //Check if feeds is empty or not
    if(feeds.length==0){
      resolve(feeds);
    }
    //Get the hidden feeds
    this.dataservice.getdeletedfeeds(this.user).then(res=>{
       hiddenfeeds=res;//Store the feeds in the local variable
       //If no hidden feeds return the feeds
      if(hiddenfeeds.length == 0){ 
       resolve(feeds);
      }
    //To do: Manipulate feed data structure hidden true
    //Data structure to represent hidden by user
    //such that design document can filter below condition
    //Check for the hidden feeds in the annotated feeds and remove the hidden feeds 
    hiddenfeeds.map(feed=>{
       feeds.filter(globalfeed=>{
        //console.log(feed.value._id,globalfeed.value._id)
        if(globalfeed.value._id === feed.value._id){
          var i = _.indexOf(feeds,globalfeed);
          feeds.splice(i,1);
          resolve(feeds);
        }
        else{
          resolve(feeds);
        }
         
      })
        
    })
   })
  });
}
//function to check if the feeds in the board are already published
checkForPublished(boardfeeds,boardname){
  return new Promise(resolve=>{
   var alreadypublished:any=[];
  this.archiveService.getAlreadyPublishedfeeds(boardname).then(res=>{
          alreadypublished=res;
          //console.log(res);
      var datefeed = boardfeeds.map( (board, index) => {
          // console.log(alreadypublished,feeds);
         return  _.filter(alreadypublished,function(o) { 
           //console.log(o)
           if(o.value._id===board.value._id){
             //console.log(o)
           return o  ; 
         }
         });

      });
      /*alreadypublished.map(pub=>{
        boardfeeds= boardfeeds.filter(item=> item.value._id!== pub.value._id);
      })

      //console.log(boardfeeds);
      resolve(boardfeeds);*/
     //console.log(datefeed);
      //this.feedstobepublished=_.flatten(datefeed);
      //console.log("annoforboards",datefeed);
      //Map Annos for Boards to return boolean array
      //Returns example:[true,false,true] 
      //Index of output == Index of label which means label[0] and label[1] 
      //is active for above output
      var publishedfeeds  =  datefeed.map(anno=>{

          if(anno[0]){
              return true;
           }
            else{
              return false;
            
          }
      });
       resolve(publishedfeeds);
  })
  });
}
getPublishedfeeds(boardfeeds,boardname){
  return new Promise(resolve=>{
   var alreadypublished:any=[];
    this.archiveService.getAlreadyPublishedfeeds(boardname).then(res=>{
          alreadypublished=res;
    
      alreadypublished.map(pub=>{
        boardfeeds= boardfeeds.filter(item=> item.value._id === pub.value._id);
        //console.log(boardfeeds);
        resolve(boardfeeds);
      })

      
      
   
    })
  });

}
//Function to filter the feeds on date
filterDate(date,feeds){
  var date = date;
  //Parse the from and to dates to timestamp to filter
  var fromdate = Date.parse(date.changefrom);
  var todate = Date.parse(date.changeto);
  
  return new Promise(resolve=>{
      //Filter the globalfeeds ondate and store in the local variable feeds
  this.resultFeeds =  feeds.filter((res)=>{


    //Check if from date less than to date
    if(fromdate<=todate){
      //Get the date from every feed in the database and check if it exists between 
      //the given from and to date
      //console.log(res.value.date);
     if(fromdate<=Date.parse(res.value.date) && todate>=Date.parse(res.value.date)){
      
        return res;
      }    
      //Alert if no feeds between the from and to dates
      else{
        
      }
    } 
    //Alert if the from date is greater than to date
    else{
       
    }  
  });
  resolve(this.resultFeeds);
  })
}
//Function to sort the feeds on descending order from latest 
sortdescending(feeds){
  return new Promise(resolve=>{
    this.resultFeeds = feeds.sort(function(a, b) {
     // console.log("datea",a,b)   
      return new Date(b.value.date || b.value.value.date).getTime() - new Date(a.value.date || a.value.value.date).getTime()
    });
    //console.log("sorted util",this.resultFeeds)
    resolve(this.resultFeeds);
  });
}
//Function to sort the feeds on ascending order from oldest 
sortascending(feeds){
  return new Promise(resolve=>{
    this.resultFeeds = feeds.sort(function(a, b) {
      return new Date(a.value.date).getTime() - new Date(b.value.date).getTime()
    });
    resolve(this.resultFeeds);
  });    
}
//Click hide to remove the feed and push to trashbox
 hide(feeditem,index){
   console.log("hid",feeditem);
   let model = {
     "@context": "http://www.w3.org/ns/anno.jsonld",
     "type": "Annotation",
     "creator": this.user,
     "created": this.date.getTime(),
     "modified": this.date.getTime(),
     "generator": "mm_2017_v1",
     "generated": this.date.getTime(),
     "target": feeditem,
     "hidden":true
   }   
   
   //check if the url is trashbox and alert cant remove from trashbox
   /*if(this.router.url === '/trashbox'){
     this.alertremove=true
   }
   //Add a object hide feed with properties hidefeed and hiddenby and update
 else{*/
  return new Promise(resolve=>{ 
  feeditem.hidefeed={'hidefeed':true,'hiddenby':this.user};
    //console.log(feeditem);  
   this.feedService.updatefeed(feeditem).then(res=>{
     //console.log(res);
     if(res['ok'] == true){
      // console.log("de",index);
        this.dataservice.addtodatabase(model).then(res=>{
         if(res['ok'] == true){
           resolve(res);
         }
       });

     }
   })
  });
  
  
  }

 //}
 

}