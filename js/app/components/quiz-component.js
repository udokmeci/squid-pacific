'use strict';

$(document).ready(function(){
  $.widget('lindneo.quizComponent', $.lindneo.component, {
    
    options: {

    },

    _create: function(){

      var that = this;
      var anchor = $('<a></a>');
      anchor.attr('id', 'quiz-' + this.options.component.id );
      
      anchor.text( this.options.component.data.a.text );

      this.element.append( anchor );

      anchor.click(function(e){


        // open a window
        $("<div id='quiz-popup' style='position:absolute; top: " + ( e.pageY + 30 )+ "px; left: "+ e.pageX + "px; '> \
            <div id='question-text'></div> \
            <div id='question-options-container'></div> \
            <div> \
              <a id='send' href='#'>send</a> \
            </div> \
        </div>").appendTo('body');

        // set question text
        $('#question-text').text( that.options.component.data.question );
        var n = that.options.component.data.numberOfSelections;

        var appendText = "";
        for( var i = 0; i < n; i++ ){
          appendText += 
          "<div> \
            <input type='radio' value='" + i + "' name='question' /> \
            "+ that.options.component.data.options[i] + " \
          </div>";
        }
        $('#question-options-container').append(appendText);

        // prepare question options

        // click event
        $('#send').click(function(evt){

          var ind = $('input[type=radio]:checked').val();
          
          if( ind === undefined ){
            alert('secilmemis');
          } else {
            var answer = {
            'selected index': ind,
            'selected option': that.options.component.data.options[ind]
          };

          alert(JSON.stringify(answer));
  
          }

          $('#quiz-popup').remove();
          if( $('#quiz-popup').length ) {
            $('#quiz-popup').remove();
          }
        });

      });

      this._super();
    },

    field: function(key, value){
      
      this._super();

      // set
      this.options.component[key] = value;

    }
    
  });
});


  var createQuizComponent = function ( event, ui ) {

    $("<div class='popup ui-draggable' id='pop-quiz-popup' style='display: block; top:" + (ui.offset.top-$(event.target).offset().top ) + "px; left: " + ( ui.offset.left-$(event.target).offset().left ) + "px;'> \
      <div class='popup-header'> \
        Quiz Ekle \
        <div class='popup-close' id='create-quiz-close-button'>x</div> \
      </div> \
      <!-- popup content --> \
      <div class='gallery-inner-holder'> \
        <label class='dropdown-label' id='leading'> \
          Şık Sayısı: \
          <select id='leading-option-count' class='radius'> \
            <option value='2'>2</option> \
            <option selected value='3'>3</option> \
            <option value='4'>4</option> \
            <option value='5'>5</option> \
          </select> \
        </label> \
        <br /> \
        <label class='dropdown-label' id='leading'> \
          Doğru Cevap: \
          <select id='leading-answer-selection' class='radius'> \
          </select> \
        </label> \
        <br /><br /> \
        <div class='quiz-inner'> \
          Soru kökü: \
          <form id='video-url'> \
            <textarea class='popup-text-area' id='question'>Soru kökünü buraya yazınız.</textarea><br> \
            <!--burası çoğalıp azalacak--> \
            <div id='selection-options-container'> \
            </div> \
          </form> \
        </div> \
        <a href='#' class='btn bck-light-green white radius' id='add-quiz' style='padding: 5px 30px;'>Ekle</a> \
      </div> \
      <!-- popup content--> \
    </div>").appendTo('body');
  
    // initialize options
    var n = $('#leading-option-count').val();
    $('#selection-options-container').empty();
    $('#leading-answer-selection').empty();  
    var appendedText = "";    
    var appendAnswerText = "";
    for(var i = 0; i < parseInt(n); i++ ){
      appendedText +=  (i + 1) + ". seçenek <textarea class='popup-choices-area' id='selection-option-index-" + i + "'></textarea> <br>";

      appendAnswerText += (i === 0) ? "<option selected value='" + ( i + 1 ) + "'>"+ ( i + 1 ) +"</option>" : "<option value='" + ( i + 1 ) + "'>"+ ( i + 1 ) +"</option>";  
    }
    $('#selection-options-container').append(appendedText);
    $('#leading-answer-selection').append(appendAnswerText);      

    // attach close event to close button
    $('#create-quiz-close-button').click(function(){
      $('#pop-quiz-popup').remove();  
      if ( $('#pop-quiz-popup').length ){
        $('#pop-quiz-popup').remove();  
      }
    });

    // when option count change, reorganize options according to that value
    // warning! previouse option texts will be deleted.
    $('#leading-option-count').change(function(e){
      var n = $(this).val();
      $('#selection-options-container').empty();
      $('#leading-answer-selection').empty();
      var appendedText = "";    
      var appendAnswerText = "";
      for(var i = 0; i < parseInt(n); i++ ){
        appendedText +=  (i + 1) + ". seçenek <textarea class='popup-choices-area' id='selection-option-index-" + i + "'></textarea> <br>";
        appendAnswerText += (i === 0) ? "<option selected value='" + ( i + 1 ) + "'>"+ ( i + 1 ) +"</option>" : "<option value='" + ( i + 1 ) + "'>"+ ( i + 1 ) +"</option>";
      }
      $('#selection-options-container').append(appendedText);
      $('#leading-answer-selection').append(appendAnswerText);
    });
  
    $('#add-quiz').click(function(){
      
      var component = {
        'type' : 'quiz',
        'data': {
          'a': {
            'css': {

            },
            'text': 'Quiz Click'
          },
          'self': {
            'css': {
              'position':'absolute',
              'top': (ui.offset.top-$(event.target).offset().top ) + 'px',
              'left':  ( ui.offset.left-$(event.target).offset().left ) + 'px',
              'width': '100px',
              'height': '20px'
            }
          }
        }
      };

      var numberOfSelections = $('#leading-option-count').val();
      var correctAnswerIndex = parseInt($('#leading-answer-selection').val()) - 1;

      component.data['numberOfSelections'] = numberOfSelections;
      component.data['correctAnswerIndex'] = correctAnswerIndex;
      component.data['question'] = $('#question').val();
      component.data['options'] = [];
      for( var i = 0; i < parseInt( numberOfSelections ); i++ ) {
        component.data['options'][i] = $('#selection-option-index-' + i).val();
      }
      $('#create-quiz-close-button').trigger('click');

      window.lindneo.tlingit.componentHasCreated( component );
    });


  };