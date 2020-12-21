jQuery(document).ready(function(){    
    
    //새로고침시 처음화면으로 이동
    $(document).keydown(function(e){
        if(e.keyCode==116){
            document.location.href="http://127.0.0.1:5000/";
            return false;
        }
    });

    'use strict'
  
    $('[data-toggle="tooltip"]').tooltip();
      
    // set active contact from list to show in desktop view by default
    if(window.matchMedia('(min-width: 992px)').matches) {
      $('#one_depth .media:first-of-type').addClass('active');
    }
      
      
    const contactSidebar = new PerfectScrollbar('.contact-sidebar-body', {
      suppressScrollX: true
    });
      
    new PerfectScrollbar('.contact-content-body', {
      suppressScrollX: true
   });
      
    new PerfectScrollbar('.contact-content-sidebar', {
      suppressScrollX: true
    });
      
    $('.contact-navleft .nav-link').on('shown.bs.tab', function(e) {
      contactSidebar.update()
    })
      
    // UI INTERACTION
    $(document).on('click','.contact-list .media',function(e){
      e.preventDefault();
      
      if($(this).parent().attr('id')=="one_depth"){
        if($('#second-page').attr('class')=="nav-link active"){
          $('.nav a[href="#first-View"]').tab('show');
        }
        $('.contact-list .media').removeClass('active');
        $(this).addClass('active');
      }
      if($(this).parent().attr('id')=="two_depth"){
        $('#two_depth .media,#three_depth .media').removeClass('active');
        $(this).addClass('active');
      }
      if($(this).parent().attr('id')=="three_depth"){
        $('#three_depth .media').removeClass('active');
        $(this).addClass('active');
        var list_txt=$(this).find('li').text();
        $('#third-page').text(list_txt);
        $('.nav a[href="#third-View"]').tab('show');
      }

      var cValue = $(this).find('li').val();
      $('#contactName').find('li').val(cValue);
      
      var cName = $(this).find('h6').text();
      $('#contactName').find('li').text(cName);

      var cdescribe = $(this).find('.tx-12').text();
      $('#contactDescribe').text(cdescribe);

      var cAvatar = $(this).find('.avatar').clone();
      
      cAvatar.removeClass (function (index, className) {
        return (className.match (/(^|\s)avatar-\S+/g) || []).join(' ');
      });
      cAvatar.addClass('avatar-xl');
      
      $('#contactAvatar .avatar').replaceWith(cAvatar);
      
      
      // showing contact information when clicking one of the list
      // for mobile interaction only
      if(window.matchMedia('(max-width: 991px)').matches) {
        $('body').addClass('contact-content-show');
        $('body').removeClass('contact-content-visible');
      
        $('#mainMenuOpen').addClass('d-none');
        $('#contactContentHide').removeClass('d-none');
      }
    })
      
      
    // going back to contact list
    // for mobile interaction only
    $('#contactContentHide').on('click touch', function(e){
      e.preventDefault();
      
      $('body').removeClass('contact-content-show contact-options-show');
      $('body').addClass('contact-content-visible');
      
      $('#mainMenuOpen').removeClass('d-none');
      $(this).addClass('d-none');
    });
      
    $('#contactOptions').on('click', function(e){
      e.preventDefault();
      $('body').toggleClass('contact-options-show');
    })
      
    $(window).resize(function(){
      $('body').removeClass('contact-options-show');
    })

    var startxt = "<nav class='navstar' data-loaded='no'><a href=''><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'"+
    "viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-star'>"+
    "<polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'></polygon></svg></a></nav>"
    var yellow_star = "<nav class='navstar active' data-loaded='yes'><a href=''><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'"+
    "viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-star'>"+
    "<polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'></polygon></svg></a></nav>"

    $(document).on('click','#one_depth .media,#favorite_list .media',function(e){
      //2depth
      e.preventDefault();
      $('#two_depth').empty();
      $('#three_depth').empty();
      var onedepth_val = $(this).find('li').val();
      var list_txt=$(this).find('li').text();
      $('#first-page').text(list_txt+' →');
      $('#second-page').text('');
      $('#third-page').text('');
      $.ajax({
        type:'POST',
        url:'http://127.0.0.1:5000/click',
        data : 
          {'pid' : onedepth_val} ,
        dataType:'JSON',
        success:function(result){
          var obj = JSON.parse(JSON.stringify(result))
          for (i=0; i<Object.keys(obj).length; i++) {
            if(obj[i].favState == 'yes') {
              var list_two = document.createElement('div');
              list_two.setAttribute('class','media');
              list_two.innerHTML = "<div class='media-body mg-l-10'><h6 class='tx-13 mg-b-3'><li value="+obj[i].id+">"+ obj[i].title +"</h6>"+
              "<span class='tx-12'>"+obj[i].describe+"</span></div>"+yellow_star;
              document.getElementById('two_depth').appendChild(list_two);
            }
            else{
              var list_two = document.createElement('div');
              list_two.setAttribute('class','media');
              list_two.innerHTML = "<div class='media-body mg-l-10'><h6 class='tx-13 mg-b-3'><li value="+obj[i].id+">"+ obj[i].title +"</h6>"+
              "<span class='tx-12'>"+obj[i].describe+"</span></div>"+startxt;
              document.getElementById('two_depth').appendChild(list_two);
            }
          }
        }
      });
      $('.nav a[href="#first-View"]').tab('show');
    })
    $(document).on('click','#two_depth .media',function(e){
      //3depth
      e.preventDefault();
      var twodepth_val=$(this).find('li').val();
      var list_txt = $(this).find('li').text();
      $('#second-page').text(list_txt+' →');
      $('#three_depth').empty();
      $('#third-page').text('');
      $.ajax({
        type:'POST',
        url:'http://127.0.0.1:5000/click',
        data : 
          {'pid' : twodepth_val} ,
        dataType:'JSON',
        success:function(result){
          var obj = JSON.parse(JSON.stringify(result))
          for (i=0; i<Object.keys(obj).length; i++) {
            if(obj[i].favState == 'yes') {
              var list_two = document.createElement('div');
              list_two.setAttribute('class','media');
              list_two.innerHTML = "<div class='media-body mg-l-10'><h6 class='tx-13 mg-b-3'><li value="+obj[i].id+">"+ obj[i].title +"</h6>"+
              "<span class='tx-12'>"+obj[i].describe+"</span></div>"+yellow_star;
              document.getElementById('three_depth').appendChild(list_two);
            }
            else{
              var list_two = document.createElement('div');
              list_two.setAttribute('class','media');
              list_two.innerHTML = "<div class='media-body mg-l-10'><h6 class='tx-13 mg-b-3'><li value="+obj[i].id+">"+ obj[i].title +"</h6>"+
              "<span class='tx-12'>"+obj[i].describe+"</span></div>"+startxt;
              document.getElementById('three_depth').appendChild(list_two);
            }
          }
        }
      });
      $('.nav a[href="#second-View"]').tab('show');
    });
    $(document).on('click','#three_depth .media',function(){
      $('.nav a[href="#third-View"]').tab('show');
    })
    $(document).on('click','#gourl',function(e){
      e.preventDefault();
      var urlid=$('#contactName').find('li').val();
      $.ajax({
        type:'POST',
        url:'http://127.0.0.1:5000/urlclick',
        data : 
          {'urlid' : urlid} ,
        dataType:'JSON',
        success:function(result){
          var basic_url = "https://dev.zioyou.com";
          window.open(basic_url+result['url'],'newpop');
        }
      });
    })
    $('#submit-btn').on('click',function(e){
      e.preventDefault();
      $('.nav a[href="#tabContact"]').tab('show');
      $('#one_depth').empty();
      var search_txt=$("#submit-txt").val();
      $.ajax({
        type:'POST',
        url:'http://127.0.0.1:5000/search',
        data : 
          {'txtsearch' : search_txt} ,
        dataType:'JSON',
        success:function(result){
          var obj = JSON.parse(JSON.stringify(result))
          for (i=0; i<Object.keys(obj).length; i++) {
            if(obj[i].favState == 'yes') {
              var list_two = document.createElement('div');
              list_two.setAttribute('class','media');
              list_two.innerHTML = "<div class='media-body mg-l-10'><h6 class='tx-13 mg-b-3'><li value="+obj[i].id+">"+ obj[i].title +"</h6>"+
              "<span class='tx-12'>"+obj[i].describe+"</span></div>"+yellow_star;
              document.getElementById('one_depth').appendChild(list_two);
            }
            else{
              var search_list = document.createElement('div');
              search_list.setAttribute('class','media');
              search_list.setAttribute('id','search_depth_list');
              search_list.innerHTML = "<div class='media-body mg-l-10'><h6 class='tx-13 mg-b-3'><li value="+obj[i].id+">"+ obj[i].title +"</h6>"+
              "<span class='tx-12'>"+obj[i].describe+"</span></div>"+startxt;
              document.getElementById('one_depth').appendChild(search_list);
            }
          }
        }
      })
    })
    $('#submit-txt').keydown(function(key){
      if(key.keyCode==13){
        $('#submit-btn').click();
      }
    })
    $('#all_data').on('click',function(){
      $('#one_depth').empty();
      $('#submit-txt').val('');
      var search_txt='';
      $.ajax({
        type:'POST',
        url:'http://127.0.0.1:5000/search',
        data : 
          {'txtsearch' : search_txt} ,
        dataType:'JSON',
        success:function(result){
          var obj = JSON.parse(JSON.stringify(result))
          for (i=0; i<Object.keys(obj).length; i++) {
            if(obj[i].favState == 'yes') {
              var list_two = document.createElement('div');
              list_two.setAttribute('class','media');
              list_two.innerHTML = "<div class='media-body mg-l-10'><h6 class='tx-13 mg-b-3'><li value="+obj[i].id+">"+ obj[i].title +"</h6>"+
              "<span class='tx-12'>"+obj[i].describe+"</span></div>"+yellow_star;
              document.getElementById('one_depth').appendChild(list_two);
            }
            else{
              var search_list = document.createElement('div');
              search_list.setAttribute('class','media');
              search_list.setAttribute('id','search_depth_list');
              search_list.innerHTML = "<div class='media-body mg-l-10'><h6 class='tx-13 mg-b-3'><li value="+obj[i].id+">"+ obj[i].title +"</h6>"+
              "<span class='tx-12'>"+obj[i].describe+"</span></div>"+startxt;
              document.getElementById('one_depth').appendChild(search_list);
            }
          }
        }
      })
    })
    $('#search_log').on('click',function(){
      $('#recently_search').empty();
      $('.nav a[href="#tabSearch"]').tab('show');
      $.ajax({
        type:'POST',
        url:'http://127.0.0.1:5000/recently',
        success:function(result){
          var obj = JSON.parse(result);
          for (i=0; i<Object.keys(obj).length; i++) {
            var search_list = document.createElement('div');
            search_list.setAttribute('class','media');
            search_list.innerHTML="<div class='media-body mg-l-10'><h6 class='tx-13 mg-b-3'><li value=''>"+ obj[i].stitle +"</h6>"+
            "<span class='tx-12'></span></div>";
            document.getElementById('recently_search').appendChild(search_list);
          }
        }
      })
    })
    $(document).on('click','#recently_search .media',function(){
      var search_txt=$(this).find('li').text();
      $('#submit-txt').val(search_txt);
      $('#one_depth').empty();
      $.ajax({
        type:'POST',
        url:'http://127.0.0.1:5000/search',
        data : 
          {'txtsearch' : search_txt} ,
        dataType:'JSON',
        success:function(result){
          var obj = JSON.parse(JSON.stringify(result))
          for (i=0; i<Object.keys(obj).length; i++) {
            if(obj[i].favState == 'yes') {
              var list_two = document.createElement('div');
              list_two.setAttribute('class','media');
              list_two.innerHTML = "<div class='media-body mg-l-10'><h6 class='tx-13 mg-b-3'><li value="+obj[i].id+">"+ obj[i].title +"</h6>"+
              "<span class='tx-12'>"+obj[i].describe+"</span></div>"+yellow_star;
              document.getElementById('one_depth').appendChild(list_two);
            }
            else{
              var search_list = document.createElement('div');
              search_list.setAttribute('class','media');
              search_list.setAttribute('id','search_depth_list');
              search_list.innerHTML = "<div class='media-body mg-l-10'><h6 class='tx-13 mg-b-3'><li value="+obj[i].id+">"+ obj[i].title +"</h6>"+
              "<span class='tx-12'>"+obj[i].describe+"</span></div>"+startxt;
              document.getElementById('one_depth').appendChild(search_list);
            }
          }
        }
      })
      $('.nav a[href="#tabContact"]').tab('show');
    })
    $(document).on('click','#tabFavorite',function(e){

      $('#favorite_list').empty();
      $.ajax({
        type:'POST',
        url:'http://127.0.0.1:5000/favorite',
        dataType:'JSON',
        success:function(result){
          var obj = JSON.parse(JSON.stringify(result))
          for (i=0; i<Object.keys(obj).length; i++) {
            var favoriteList = document.createElement('div');
            favoriteList.setAttribute('class','media');
            favoriteList.setAttribute('id','search_depth_list');
            favoriteList.innerHTML = "<div class='media-body mg-l-10'><h6 class='tx-13 mg-b-3'><li value="+obj[i].id+">"+ obj[i].title +"</h6>"+
            "<span class='tx-12'>"+obj[i].describe+"</span></div>";
            document.getElementById('favorite_list').appendChild(favoriteList);
          }
        }
      })
    })
    $(document).on('click','.navstar',function(e){
      var titlename=$(this).parent().find('li').text();
      var titleid=$(this).parent().find('li').val();
      var desname=$(this).parent().find('span').text();
      e.preventDefault();
      e.stopPropagation();
      if($(this).attr('data-loaded')=="no"){
        $(this).addClass('active');
        $.ajax({
          type:'POST',
          url:'http://127.0.0.1:5000/insert_favorite',
          data : 
            {'titlename' : titlename, 'desname':desname, 'titleid':titleid},
          dataType:'JSON'
        })
        $(this).attr("data-loaded","yes");
      }
      else if($(this).attr("data-loaded")=='yes'){
        $(this).removeClass('active');
        $.ajax({
          type:'POST',
          url:'http://127.0.0.1:5000/delete_favorite',
          data : {'titleid' : titleid},
          datatype :'JSON'
        })
        $(this).attr("data-loaded","no");
      }
    })
});