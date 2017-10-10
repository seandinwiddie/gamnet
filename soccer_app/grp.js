var soccerapp=angular.module("myapp",[])
var app_id="ZsCFMZzIfwikLAbIWWIwDsyPynNTlzxlTDC0GPrk";
var js_key="WahTfAJFRE7ZCY1JcfLPDCNRHZWJl9g01sa6w4rf";
var no;
Parse.initialize(app_id,js_key);
soccerapp.controller("groupController",function($scope){

  var userid=Parse.User.current().id,
    User=Parse.Object.extend("User");

  document.body.innerHTML+='<div class="ui-loader ui-corner-all ui-body-a ui-loader-default"><span class="ui-icon-loading"></span></div>';

  $scope.loadData=function(){
    var result=Parse.Object.extend("Results"),
      queryResult=new Parse.Query(result),
      GameScore=Parse.Object.extend("Game"),
      queryGame=new Parse.Query(GameScore),
      queryStage=new Parse.Query("Stage");
    queryResult.include("user");
    queryResult.include("game");
    queryResult.include("game.stage");
    queryResult.include("game.participant1");
    queryResult.include("game.participant2");
    queryResult.include("game.participant1.team");
    queryResult.include("game.participant2.team");
    queryStage.contains("name",groupName);
    queryGame.ascending("date");
    queryGame.matchesQuery("stage",queryStage);
    queryResult.matchesQuery("game",queryGame);
    queryResult.equalTo("user",new User({id: userid}));
    queryResult.find({
      success: function findGroup(results){
        $scope.$apply(function(){
          var arr=[],dayArr=[],gResult1=[],gResult2=[],countDays=0;
          if(results.length>0)dayArr.push(results[0].get("game").get("date"));
          no=1;
          for(var i=0;i<results.length;i++){
            var team1,team2,date=results[i].get("game").get("date");
            for(var j=0;j<=countDays;j++){
              if(
                dayArr[j].getDate()!=date.getDate()
                ||dayArr[j].getMonth() != date.getMonth()
                ||dayArr[j].getFullYear() != date.getFullYear()
              ){
                dayArr.push(results[i].get("game").get("date"));
                countDays++;
                break;
              }
            }
            if(results[i].get("game").get("participant1").get("team")){
              team1=results[i].get("game").get("participant1").get("team").get("name");
            }else{
              team1=results[i].get("game").get("participant1").get("name");
            }
            if(results[i].get("game").get("participant2").get("team")){
              team2=results[i].get("game").get("participant2").get("team").get("name");
            }else{
              team2=results[i].get("game").get("participant2").get("name");
            }
            gameid=results[i].get("game").id;
            arr.push({"no":results[i].get("game").get("number"),
              "time":results[i].get("game").get("date"),
              "team1":team1,
              "team2":team2,
              "result1": results[i].get("team1"),//.get("game").get("score1"),
              "result2": results[i].get("team2"),//get("game").get("score2"),
              "grp":results[i].get("game").get("stage").get("name").slice(-1),
              "pid":gameid,
              "rid": results[i].id});
            gResult1[results[i].id]=results[i].get("team1");
            gResult2[results[i].id]=results[i].get("team2");
            no++;
          }

/* v-- Special Filtering Functions --v */
          unique=function(a){var seen={},out=[],j=0;
            for(var y=0;y<a.length;y++){var item=a[y];if(seen[item]!==1){seen[item]=1;out[j++]=item;}}
            return out;}
          dup=function(a){
            var out=[],counts=[];
            for(var i=0;i<a.length;i++){
              var j=a[i];
              counts[j]=counts[j]>=1?counts[j]+1:1;
            }
            for(var j in counts)if(counts[j]>1)out.push(j);
            return out;
          }
          contains=function(a,b){return !!~a.indexOf(b)}
/* ^-- Special Filtering Functions --^ */

          var grpTms=[];
          for(var i=0;i<arr.length;i++){grpTms.push(arr[i].team1);}
          grpTms=unique(grpTms);grpTms=grpTms.sort();
          var grp=[];
          for(var i=0;i<grpTms.length;i++){grp.push({'team':grpTms[i]});}
//Played
          for(var j=0;j<grp.length;j++){
            grp[j]['Pld']=0;
            for(var i=0;i<arr.length;i++){
              arr[i].result1!=null && arr[i].result2!=null?bthGms=true:bthGms=false;
              if(
                (
                  arr[i].team1==grp[j]['team']
                  ||
                  arr[i].team2==grp[j]['team']
                )
                &&bthGms==true
              )grp[j]['Pld']++;
            }
          }
//Goal for
          for(var j=0;j<grp.length;j++){
            grp[j]['GF']=[];
            for(var i=0;i<arr.length;i++){
              arr[i].result1!=null && arr[i].result2!=null?bthGms=true:bthGms=false;
              if(arr[i].team1==grp[j]['team']&&bthGms==true)
                grp[j]['GF'].push(arr[i].result1);
              if(arr[i].team2==grp[j]['team']&&bthGms==true)
                grp[j]['GF'].push(arr[i].result2);
            }
            grp[j]['GF']==""?grp[j]['GF']=0:grp[j]['GF']=grp[j]['GF'].reduce(function(a,b){return a+b;});
          }
//Goal Against
          for(var j=0;j<grp.length;j++){grp[j]['GA']=[];
            for(var i=0;i<arr.length;i++){
              arr[i].result1!=null && arr[i].result2!=null?bthGms=true:bthGms=false;
              if(arr[i].team1==grp[j]['team']&&bthGms==true)grp[j]['GA'].push(arr[i].result2);
              if(arr[i].team2==grp[j]['team']&&bthGms==true)grp[j]['GA'].push(arr[i].result1);
            }
            grp[j]['GA']==""?grp[j]['GA']=0:grp[j]['GA']=grp[j]['GA'].reduce(function(a,b){return a+b;});
          }
//Goal Difference
          for(var j=0;j<grp.length;j++){grp[j]['GD']=grp[j]['GF']-grp[j]['GA'];}
//Points
          for(var j=0;j<grp.length;j++){
            grp[j]['Pts']=0;
            for(var i=0;i<arr.length;i++){
              arr[i].result1!=null && arr[i].result2!=null?bthGms=true:bthGms=false;
              if(
                (
                  arr[i].team1==grp[j]['team']
                  ||
                  arr[i].team2==grp[j]['team']
                )
                &&arr[i].result1==arr[i].result2
                &&bthGms==true
              )grp[j]['Pts']++;
              if(
                (
                  arr[i].team1==grp[j]['team']
                  &&arr[i].result1>arr[i].result2
                  &&bthGms==true
                )
                ||
                (
                  arr[i].team2==grp[j]['team']
                  &&arr[i].result1<arr[i].result2
                  &&bthGms==true
                )
              )grp[j]['Pts']+=3;
            }
          }
//Rankings
          for(var j=0;j<grp.length;j++){
            grp[j]['rnk']=0;
            grp[j]['rnk']=grp[j]['Pts']+(grp[j]['GD']/100)+(grp[j]['GF']/10000);
          }
          for(var i=0;i<arr.length;i++){
            if(arr[i].result1!=null && arr[i].result2!=null){
              if(
                (arr[i].team1==grp[0]['team']&&arr[i].team2==grp[1]['team'])
                ||
                (arr[i].team1==grp[1]['team']&&arr[i].team2==grp[0]['team'])
              ){
                if(arr[i].result1>arr[i].result2){
                  grp[0]['rnk']=grp[0]['rnk'] + 3/1000000;
                }
                else if(arr[i].result1<arr[i].result2){
                  grp[1]['rnk']=grp[1]['rnk'] + 3/1000000;
                }
                else{
                  grp[0]['rnk']=grp[0]['rnk']+(grp[0]['GF']/100000000);
                  grp[1]['rnk']=grp[1]['rnk']+(grp[1]['GF']/100000000);
                }
              }
              if(
                (arr[i].team1==grp[0]['team']&&arr[i].team2==grp[2]['team'])
                ||
                (arr[i].team1==grp[2]['team']&&arr[i].team2==grp[0]['team'])
              ){
                if(arr[i].result1>arr[i].result2){
                  grp[0]['rnk']=grp[0]['rnk'] + 3/1000000;
                }
                  else if(arr[i].result1<arr[i].result2){
                  grp[2]['rnk']=grp[2]['rnk'] + 3/1000000;
                }
                else{
                  grp[0]['rnk']=grp[0]['rnk']+(grp[0]['GF']/100000000);
                  grp[2]['rnk']=grp[2]['rnk']+(grp[2]['GF']/100000000);
                }
              }
              if(
                (arr[i].team1==grp[0]['team']&&arr[i].team2==grp[3]['team'])
                ||
                (arr[i].team1==grp[3]['team']&&arr[i].team2==grp[0]['team'])
              ){
                if(arr[i].result1>arr[i].result2){
                  grp[0]['rnk']=grp[0]['rnk'] + 3/1000000;
                }
                else if(arr[i].result1<arr[i].result2){
                  grp[3]['rnk']=grp[3]['rnk'] + 3/1000000;
                }
                else{
                  grp[0]['rnk']=grp[0]['rnk']+(grp[0]['GF']/100000000);
                  grp[3]['rnk']=grp[3]['rnk']+(grp[3]['GF']/100000000);
                }
              }
              if(
                (arr[i].team1==grp[1]['team']&&arr[i].team2==grp[2]['team'])
                ||
                (arr[i].team1==grp[2]['team']&&arr[i].team2==grp[1]['team'])
              ){
                if(arr[i].result1>arr[i].result2){
                  grp[1]['rnk']=grp[1]['rnk'] + 3/1000000;
                }
                else if(arr[i].result1<arr[i].result2){
                  grp[2]['rnk']=grp[2]['rnk'] + 3/1000000;
                }
                else{
                  grp[1]['rnk']=grp[1]['rnk']+(grp[1]['GF']/100000000);
                  grp[2]['rnk']=grp[2]['rnk']+(grp[2]['GF']/100000000);
                }
              }
              if(
                (arr[i].team1==grp[1]['team']&&arr[i].team2==grp[3]['team'])
                ||
                (arr[i].team1==grp[3]['team']&&arr[i].team2==grp[1]['team'])
              ){
                if(arr[i].result1>arr[i].result2){
                  grp[1]['rnk']=grp[1]['rnk'] + 3/1000000;
                }
                else if(arr[i].result1<arr[i].result2){
                  grp[3]['rnk']=grp[3]['rnk'] + 3/1000000;
                }
                else{
                  grp[1]['rnk']=grp[1]['rnk']+(grp[1]['GF']/100000000);
                  grp[3]['rnk']=grp[3]['rnk']+(grp[3]['GF']/100000000);
                }
              }
              if(
                (arr[i].team1==grp[2]['team']&&arr[i].team2==grp[3]['team'])
                ||
                (arr[i].team1==grp[3]['team']&&arr[i].team2==grp[2]['team'])
              ){
                if(arr[i].result1>arr[i].result2){
                  grp[2]['rnk']=grp[2]['rnk'] + 3/1000000;
                }
                else if(arr[i].result1<arr[i].result2){
                  grp[3]['rnk']=grp[3]['rnk'] + 3/1000000;
                }
                else{
                  grp[2]['rnk']=grp[2]['rnk']+(grp[2]['GF']/100000000);
                  grp[3]['rnk']=grp[3]['rnk']+(grp[3]['GF']/100000000);
                }
              }
            }
          }

          // console.log("All teams have been sorted by Points, Goal Difference, and Goal For.");
          // grpPts=[],grpPtsDupTms=[];
          // for(var j=0;j<grp.length;j++)grpPts.push(grp[j]['Pts']);
          // grpPtsDup=dup(grpPts);
          // for(var d=0;d<grpPtsDup.length;d++){
          //   //console.log(grpPtsDup+" "+d);
          //   grpPtsDupTms[d]=[];
          //   for(var j=0;j<grp.length;j++){
          //     grp[j]['PtsD']=grp[j]['Pts'];
          //     if(grp[j]['Pts']==grpPtsDup[d])grpPtsDupTms[d].push(grp[j]['team']);
          //   }
          //   console.log("Now these teams have the same points: "+grpPtsDupTms[d]+", so");
          //   for(var i=0;i<arr.length;i++){
          //     arr[i].result1!=null && arr[i].result2!=null?bthGms=true:bthGms=false;
          //     if(
          //       bthGms==true
          //       &&contains(grpPtsDupTms[d],arr[i].team1)
          //       &&contains(grpPtsDupTms[d],arr[i].team2)
          //     ){
          //       console.log("In the game of "+arr[i].team1+" vs "+arr[i].team2+",");
          //       if(arr[i].result1>arr[i].result2){
          //         for(var j=0;j<grp.length;j++)if(grp[j]['team']==arr[i].team1){
          //           grp[j]['PtsD']+=1/1000000;
          //           console.log(arr[i].team1+" wins, increasing points to "+grp[j]['PtsD']+".");
          //         }
          //       }
          //       else if(arr[i].result1<arr[i].result2){
          //         for(var j=0;j<grp.length;j++)if(grp[j]['team']==arr[i].team2){
          //           grp[j]['PtsD']+=1/1000000;
          //           console.log(arr[i].team2+" wins, increasing points to "+grp[j]['PtsD']+".");
          //         }
          //       }else{console.log("both teams tie.");}
          //     }
          //   }
          //   console.log(grpPtsDupTms[d]+" are now sorted again, based on their updated Points.");
          // }

          /*
          if(grp.team1.Pts==grp.team2.Pts){
            if(bthGms==true){
               if(arr[i].result1>arr[i].result2){
                grp.team1.Pts+=1/1000000;
              }
            }
          }
          */
          $scope.groupResult1=gResult1;
          $scope.groupResult2=gResult2;
          $scope.groupScores=arr;
          $scope.days=dayArr;
          $scope.grp=grp;
          document.getElementsByClassName("ui-loader")[0].style.display="none";
        });
      },
      error: function(error){
        $scope.gameScores="fail!";
        console.log(error);
      }
    });
  }
  $scope.loadData();

  $scope.saveResults=function(groupResult1,groupResult2){
    document.getElementsByClassName("ui-loader")[0].style.display="block";
    var Results=Parse.Object.extend("Results"),
      myResult=new Parse.Query(Results),
      GameScore=Parse.Object.extend("Results");
    for(var key in groupResult1){
      var score1=groupResult1[key],
        score2=groupResult2[key],
        gameScore=new GameScore();
      gameScore.id=key;
      gameScore.set("team1",parseInt(score1));
      gameScore.set("team2",parseInt(score2));
      gameScore.save(null,{
        success: function(point) {
          $scope.loadData();
        },
        error: function(point,error) {
          // The save failed.
          // error is a Parse.Error with an error code and description.
        }
      });
    }
  };
});
