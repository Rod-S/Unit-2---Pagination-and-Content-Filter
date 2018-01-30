//display correct list of 10 students based on page number
const showPage = (pageNumber,studentList) => {
  //hide full list of students given by inline HTML markup
  studentList.hide();
  //Select appropriate range of names based on pageNumber and display them
  studentList.slice(((pageNumber-1)*10),((pageNumber*10))).show();
};

//allow user to select which page of students to display based on link clicked
const appendPageLinks = (studentList) => {
  //determine how many total pages (of 10 students each) there are for this student list
  const totalPages = Math.ceil(studentList.length/10);
  //create a div for page links
  const $pageLinkSection = $('<div class="pagination"><ul class="pagination-ul">');
  //append $pageLinkSection to DOM
  $('.page').append($pageLinkSection);
  //for every page of 10 students (or less)
  for (i=1;i<=totalPages;i++){
    //concatenation of pageLink strings to loop through [i] correctly
    pageLink = '<li> <a href="#">' + [i] + '</a></li>';
    //append pageLinks needed based on totalPages calculation above to DOM
    $('ul.pagination-ul').append(pageLink);
  };
  //click event handler to select specified link as argument for showPage()'s pageList parameter
  $('a').on('click', function(event) {
    //removal of DOM message to avoid duplication during multiple failed search attempts
    $('#noStudent').remove('#noStudent');
    //show studentList associated with clicked pageLink
    showPage(event.target.text, studentList);
    //remove active class on previously clicked on link
    $('a').removeClass('active');
    //add active class on newly clicked link
    event.target.className = 'active';
  });
};

//custom jQuery selector ':Contains' to remove DOM case-sensitivity of searchList()'s .find()
$(function ($) {
  $.expr[':'].Contains = function(object, index, meta) {
    return (object.innerText).toUpperCase()
    .indexOf( meta[3].toUpperCase() )>=0;
  }
});

//creation of search bar and student search functionality
function searchList(studentList) {
  $('div.page-header').append('<div class="student-search"><input id=search placeholder="Search for students..."><button id=searchButton>Search</button>');
  $('#searchButton').on("click", function() {
    //remove class to avoid previously matched students from appearing
    $('li').removeClass('match');
    let searchFilter = $(this).prev().val().toUpperCase();
    //conditional that takes input value and checks against h3(student name) or email class(student email)
    //then hides or shows names based on checks
    if (searchFilter != '') {
              //removal of DOM message to avoid duplication during multiple failed search attempts
      $('#noStudent').remove();
      //show or hide elements that are matched to searchFilter input
      $(studentList).find("h3:Contains(" + searchFilter + ")").parent().parent().show();
      $(studentList).find(".email:Contains(" + searchFilter + ")").parent().parent().show();
      $(studentList).find("h3:not(:Contains(" + searchFilter + "))").parent().parent().hide();
      $(studentList).find(".email:not(:Contains(" + searchFilter +"))").parent().parent().hide();
      //add class for matched students that are now visible
      $('.student-item:visible').addClass('match');
      //place matched students in variable
      $match = $('.match');
      //remove previous pagination div to avoid link duplication
      $('.pagination').remove();
      //call appendPageLinks on new student list: $match
      if ($match.length > 10){
        appendPageLinks($match);
        //call showPage to display 1st calculated page of list: $match
        showPage(1, $match);
        $('a').get(0).className = 'active';
      };
      //conditional for message to append to DOM if no students found
      if ($('.student-item').is(':visible') == false) {
        //removal of DOM message to avoid duplication during multiple failed search attempts
        $('#noStudent').remove();
        //remove class to avoid previously matched students from appearing
        $('li').removeClass('match');
        $('.student-list').prepend('<div id=noStudent><h2>No Students Found with Name or Email:  ' + $(this).prev().val() + '  </h2></div>');
      }
      //conditional for alert to run if input box is blank
    } else if (searchFilter == '') {
      $('#noStudent').remove();
      //remove class to avoid previously matched students from appearing
      $('li').removeClass('match');
      //Call showPage and appendPageLinks to revert to original full student list
      showPage(1,$('li.student-item'));
      appendPageLinks($('li.student-item'));
      alert('Please enter a name or email address of the student you would like to find.');
    }
  });
};

//call showPage(); page 1 displays by default--loads on website load
showPage(1,$('li.student-item'));
//call appendPageLinks
appendPageLinks($('li.student-item'));
//active class called on page load's default link 1
$('a').get(0).className = 'active';
//call searchList()
searchList($('li.student-item'));
