import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
/**
 * Generated class for the SqliteDemoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sqlite-demo',
  templateUrl: 'sqlite-demo.html',
})
export class SqliteDemoPage {

  database: SQLiteObject;

  key=""
  content="";
  message = [];
  result_length = "";

  isOpenSqlite=false;

  constructor(public navCtrl: NavController,private sqlite: SQLite,private platform:Platform) {

  }

  ngOnInit(){
    
  }
  
  initDB(){
    if(!this.platform.is("cordova")){
      return console.log("cordova_not_available");
    }

    this.sqlite.create({
     name: 'mydb.db',
     location: 'default'
    })
    .then((db: SQLiteObject) => {
      db.executeSql('create table if not exists historyMessage(id INTEGER PRIMARY KEY AUTOINCREMENT, key text NOT NULL,content text NOT NULL)', {})//建表
       .then(() => {
        console.log('Executed SQL...');
       })
       .catch(e => {
        console.log("create db error:",e);
       });
   
      this.database = db;      
    }).catch(e =>{
      console.log("創建錯誤：",e);
    });
  }

  // 新增
  insert(params?:any){
    if(!this.platform.is("cordova")){
      return console.log("cordova_not_available");
    }
    params = {
      key:this.key,
      content:this.content,
    };

    this.database.executeSql("INSERT INTO historyMessage(key,content) VALUES (?,?);",[params.key,params.content])
    .then(() => {
      console.log('插入成功');
      this.query();
    })
    .catch(e => {
      console.log("插入失敗：",e);
    });
  }

  // 修改
  update(params?:any){
    if(!this.platform.is("cordova")){
      return console.log("cordova_not_available");
    }
    params = {
      key:this.key,
      content:this.content,
    };
  
    this.database.executeSql("UPDATE historyMessage SET content=? WHERE key=? ",[params.content,params.key])
    .then(() => {
      console.log('修改成功');
      this.query();
    })
    .catch(e => {
      console.log("修改失敗：",e);
    });
  }
  
  // 刪除
  detele(key?:string){
    if(!this.platform.is("cordova")){
      return console.log("cordova_not_available");
    }
    key = this.key;
    this.database.executeSql("DELETE FROM historyMessage WHERE key=? ",[key])
    .then(() => {
      console.log('刪除成功');
      this.query();
    })
    .catch(e => {
      console.log("刪除失敗：",e);
    });
  }

  // 查詢
  query(key?:string){
    if(!this.platform.is("cordova")){
      return console.log("cordova_not_available");
    }
    this.message=[];
    this.database.executeSql("SELECT * FROM historyMessage",{})
    .then((result) => {
      console.log('查詢結果:');
      if(result.rows.length > 0){
        this.result_length = result.rows.length+"";
        for(let i=0;i<result.rows.length;i++){
          let opts = {
            key:result.rows.item(i).key,
            content:result.rows.item(i).content
          }
          this.message.push(opts);
        }
      }else{
       this.result_length = "result rows length is 0.";
      }
    })
    .catch(e => {
      console.log("查詢失敗：",e);
    });
  }


}
