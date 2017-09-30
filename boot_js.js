var myApp;
var currentTab;
var value_form = "";
var choice;
var user_id;


myApp = angular.module("myApp", []);
myApp.controller("myCtrl", function($scope, $http) {
    $scope.tab_choice = "user"; // set default tab choice
    $scope.id = "";
    $scope.num = 0;
    $scope.favourite_stored = JSON.parse(localStorage.getItem("faourtes"));
    //console.log("here" + $scope.favourite_stored);


    // handle tab changine
    $(document).ready(function() {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
            choice = $(e.target).text(); // get current tab
            choice = choice.slice(0, choice.length - 1).toLowerCase(); // changine the name to appropriat choice
            document.getElementById("tab_choice_1").innerHTML = choice;
            $scope.tab_choice = choice;
            if($scope.tab_choice == 'favorite'){
              document.getElementById("tabContent").style.display = "block";
              document.getElementById("table_progress_bar").style.display = "none";
              document.getElementById("Users").style.display = "none";
            }
            else if ($scope.input_field) {
                $scope.hit_ajax(); // get new data as per new choice
            }
        });
    });
    // caliing php to get data for current tab
    $scope.hit_ajax = function() {

            document.getElementById("tabContent").style.display = "block";
            document.getElementById("table_progress_bar").style.display = "block";
            document.getElementById("Users").style.display = "none";

            $scope.users_type = ""; // array of 25 objects
            $scope.user_paging = "";
            $http({
                method: 'GET',
                url: 'boot_php.php?keyword=' + $scope.input_field + '&choice=' + $scope.tab_choice
            }).then(function successCallback(response) {
                $scope.users_type = response.data.data; // array of 25 objects
                //$scope.users_type.tab = $scope.tab_choice + "s";
                //console.log($scope.users_type.tab);
                //console.log(response.data.data[0].picture.data.url);
                $scope.user_paging = response.data.paging;
                $scope.showPrev = false;
                if($scope.user_paging.next){
                  $scope.showNext = true;
                }
                else{
                  $scope.showNext = false;
                }
                document.getElementById("table_progress_bar").style.display = "none";
                document.getElementById("Users").style.display = "block";
            }, function errorCallback(response) {}); // success ends
        } // hit_ajax ends

    // next button
    $scope.get_nextUsers = function() {
        $http.get($scope.user_paging.next).then(function(res) {
          if(res.data.data){
              $scope.users_type = res.data.data; // updating the table data to next page
          }
          if(res.data.paging){
            $scope.user_paging = res.data.paging;
          } // updating the pagination data
            //console.log("next paging is"+ $scope.user_paging.next);
            $scope.showButtons();
        })
    }

    // previous button`
    $scope.get_prevUsers = function() {
        $http.get($scope.user_paging.previous).then(function(res) {
            $scope.users_type = res.data.data; // updating the table to table data in prev page
            $scope.user_paging = res.data.paging; // updating the pagination data to prev
            //console.log("prev paging is"+ $scope.user_paging.previous);
            $scope.showButtons();
        })
    }

    $scope.showButtons = function(){
      if($scope.user_paging.next){
        //console.log("next is" + $scope.showNext);
         $scope.showNext =  true;
      }
      else{
        //console.log("false");
        $scope.showNext= false;
      }
      if($scope.user_paging.previous){
      //return true;
      $scope.showPrev =  true;
      }
      else{
        //return false;
        $scope.showPrev =  false;
      }
      //console.log("prev is" + $scope.showPrev);

    }

    $scope.get_albums = function(id, name, im_url, item) {
        //console.log("id" + id); album_bar
        $scope.current_ID = item;
        $scope.cur = item;
        document.getElementById("album_bar").style.display = "block";
        document.getElementById("post_bar").style.display = "block";
        document.getElementById("albums").style.display = "block";
        document.getElementById("posts").style.display = "block";
        document.getElementById("Users").style.display = "none";
        document.getElementById("Favorites").style.display = "none";
        document.getElementById("back").style.display = "block";
        document.getElementById("fb").style.display = "none";
        document.getElementById("star_in_album").style.display = "none";
        document.getElementById("accordion").style.display = "none";
        document.getElementById("no_album_warning").style.display = "none";
        document.getElementById("posts_found").style.display = "none";
        document.getElementById("no_post_warning").style.display = "none";
        $scope.profile_name = name;
        $scope.img_url = im_url;

        //console.log($scope.profile_name);
        $http({
            method: 'GET',
            url: 'boot_php.php?id=' + id
        }).then(function successCallback(response) {
            $scope.IDdata = response.data; // this has id, albums, and posts
            //****albums******
            if (!$scope.IDdata.albums) { // no albums found
                $scope.noAlbum = "No Albums Found";
                document.getElementById("album_bar").style.display = "none";
                document.getElementById("no_album_warning").style.display = "block";

            } else { // albums found
                $scope.albumArray = $scope.IDdata.albums.data; // array of 5 albums
                $scope.firstAlbum = $scope.albumArray[0];
                $scope.albumArray.splice(0, 1);
                document.getElementById("album_bar").style.display = "none";
                document.getElementById("accordion").style.display = "block";

            }

            // *****posts****
            if (!$scope.IDdata.posts) { // no posts found
                $scope.noPost = "No Posts Found";
                document.getElementById("post_bar").style.display = "none";
                document.getElementById("no_post_warning").style.display = "block";
                //console.log(document.getElementById("no_post_warning").style.display);

            } else {
                document.getElementById("post_bar").style.display = "none";
                document.getElementById("posts_found").style.display = "block";
                $scope.postArray = $scope.IDdata.posts.data; // array of 5 posts
              //  console.log($scope.postArray[0]);
            }

            document.getElementById("fb").style.display = "block";
            document.getElementById("star_in_album").style.display = "block";
            //$scope.user_paging = response.data.paging;
        }, function errorCallback(response) {}); // success ends

        // here

    }
    $scope.post_on_fb = function(){

      FB.init({
        appId      : '187980488372996',
        xfbml      : true,
        version    : 'v2.8'
      });
       //console.log('187980488372996');
       FB.ui({
         app_id: '187980488372996',
         method: 'feed',
         link: window.location.href,
         picture: $scope.current_ID.picture.data.url,
         name: $scope.current_ID.name,
         caption: 'FB SEARCH FROM USC CSCI571',
           href: 'https://developers.facebook.com/docs/',
         }, function(response){
           if (response && !response.error_message){
             alert("Posted sucessfully");
           }
           else{
               alert("Not Posted");
           }
       });
     }

    $scope.store_in_local = function(item, obj, num_placed){
      var id_button;
      if(num_placed == 1){
         id_button = "#"+"favourite_button" + obj;
      }
      else{
        id_button = "#"+"star_in_album";
      }
      // if(num_placed == 3){
      //   id_button = "#"+"star_in"
      // }
      $(id_button).find('i').toggleClass('glyphicon glyphicon-star-empty').toggleClass('glyphicon glyphicon-star');
      var starred = $(id_button).find('i').hasClass('glyphicon glyphicon-star');
      //console.log(obj + " " + starred);
      if(starred){ // if the favs button is starred, then add to favs list
        if(localStorage.getItem("faourtes")){
          var str_get = localStorage.getItem("faourtes");
          var ar_get = JSON.parse(str_get);
          var found = ar_get.find(checkItem);
          if(!found){
            ar_get.push(item);
            localStorage.setItem("faourtes", JSON.stringify(ar_get));
            //console.log("added" + ar_get);
          }
        }
        else{
          //console.log("not found");
          var ar= [item];
          localStorage.setItem("faourtes", JSON.stringify(ar));
        }
      }
      else{ // else if not starred, delete from favs ist
        var str_get = localStorage.getItem("faourtes");
        var ar_get = JSON.parse(str_get);
        var found = ar_get.find(checkItem);
        if(found){
          // delete from favs list
          //var index = ar_get.indexOf(item.id);
          var index = ar_get.map(function(d) { return d['id']; }).indexOf(item.id);
          ar_get.splice(index, 1);
          localStorage.setItem("faourtes", JSON.stringify(ar_get));
          //console.log("arr is "+ ar_get);
          //console.log("index is" + index);
        }
      }


      function  checkItem(element){
        return element.id==item.id;
      }
      $scope.favourite_stored = JSON.parse(localStorage.getItem("faourtes"));
    }

    $scope.present = function(item){
      if(!item){
        return false;
      }
      //console.log("here"+item);
      // check if faourtes are there in local storae or not
      if(localStorage.getItem("faourtes")){
        // find the item, if present or not
        var str_get = localStorage.getItem("faourtes");
        var ar_get = JSON.parse(str_get);
        var found = ar_get.find(checkItem);
        return found;
      }
      // if not, then return false
      else{
        return false;
      }

      function  checkItem(element){
        return element.id==item.id;
      }
    }

    $scope.del_from_fav = function(item){
      var str_get = localStorage.getItem("faourtes");
      var ar_get = JSON.parse(str_get);
      var found = ar_get.find(checkItem);
      if(found){
        // delete from favs list
        //var index = ar_get.indexOf(item.id);
        var index = ar_get.map(function(d) { return d['id']; }).indexOf(item.id);
        ar_get.splice(index, 1);
        localStorage.setItem("faourtes", JSON.stringify(ar_get));
    }
    function  checkItem(element){
      return element.id==item.id;
    }
    $scope.favourite_stored = JSON.parse(localStorage.getItem("faourtes"));
  }


}); // controller ends




function back_to_table(){
  document.getElementById("Users").style.display = "block";
  document.getElementById("Favorites").style.display = "block";
  document.getElementById("albums").style.display = "none";
  document.getElementById("posts").style.display = "none";
  document.getElementById("back").style.display = "none";
  document.getElementById("fb").style.display = "none";
  document.getElementById("star_in_album").style.display = "none";
}
