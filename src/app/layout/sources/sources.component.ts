import { Component, OnInit} from '@angular/core';
import { Global } from '../../shared/global';
import { CategoryService } from '../../services/category-service';
import { FeedService } from '../../services/feed-service';
import { routerTransition } from '../../router.animations';
@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss'],
  animations: [routerTransition()]
})
export class SourcesComponent implements OnInit {
  catvalue;
  metadata:any=[];
  feedname:any;
  createfeed:boolean=false;
  constructor(public categoryService:CategoryService,public variab:Global,public feedService:FeedService) { 
    
  }

  ngOnInit() {
    this.categoryService.getAll().then((result)=>{
      this.variab.categoryfeeds=result;
    })
  }
  onselectingcategory(category){
  	
  	this.catvalue=category;
  }
  addcontent(){
   /* let doc={
      category:value
    }
    this.categoryService.addcategory(doc);
    this.variab.categoryupdated.push({doc:doc})*/
    console.log(this.feedname);
    this.feedService.getAllFeeds(this.feedname).then(res=>{
      this.metadata = res;
      
      this.createfeed = true;
      console.log("value",this.metadata,this.createfeed);
    })
  	
  }
}
