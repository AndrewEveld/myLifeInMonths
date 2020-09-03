$(document).ready(function() {

  var obamadata = [
      { "name": "Hawaii", "value":72},
      { "name": "Jakarta", "value":45},
      { "name": "Hawaii", "value":96},
      { "name": "Occidental College", "value":24},
      { "name": "Columbia University", "value":21},
      { "name": "Business Int. Co.", "value":15},
      { "name": "NYPIRG", "value":5},
      { "name": "Chicago Comm. Org.", "value":38},
      { "name": "Harvard Law", "value":39},
      { "name": "U. Chicago Prof.", "value":60},
      { "name": "Illinois Senator", "value":96},
      { "name": "US Senator", "value":48},
      { "name": "President", "value":96},
      { "name": "Private Citizen", "value":44}
    ];

  var obamarange = ["#1f77b4", "#ff7f0e", "#1f77b4", "#2ca02c", "#d62728",
  "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
  "#d728a0", "#a9b9cb", "#0fffb7"];

  var gdata = [
    { "name": "Northampton, PA", "value":120},
    { "name": "Canvas, WV", "value":96},
    { "name": "Gambier, OH", "value":9},
    { "name": "Canvas, WV", "value":3},
    { "name": "Gambier, OH", "value":9},
    { "name": "Canvas, WV", "value":3},
    { "name": "Gambier, OH", "value":21},
    { "name": "Milwaukee, WI", "value":3},
    { "name": "Madison, WI", "value":21},
    { "name": "San Antonio, TX", "value":7},
    { "name": "Madison, WI", "value":77},
    { "name": "Shreveport, LA", "value":84},
    { "name": "Conway, AR", "value":75}
  ];

  var gcolors_map = new Map();
  gcolors_map.set("Northampton, PA", "#008080");
  gcolors_map.set("Canvas, WV", "#002855");
  gcolors_map.set("Gambier, OH", "#4B2E84");
  gcolors_map.set("Milwaukee, WI", "#008B2B");
  gcolors_map.set("Madison, WI", "#c5050c");
  gcolors_map.set("San Antonio, TX", "#0f52ba");
  gcolors_map.set("Shreveport, LA", "#8a2432");
  gcolors_map.set("Conway, AR", "#E96B10");

  var isabelladata = [
    { "name": "childhood", "value":160},
    { "name": "high school", "value":46},
    { "name": "college", "value":48},
    { "name": "adulting", "value":30},
    { "name": "moved back to U.S.", "value":9},
    { "name": "time left", "value":559},
  ];

  var isabellarange = ["#EF476F","#FCA311","#FFD166","#0EAD69","#4ECDC4","#118AB2"];

  exampleData = [
    [
      { "name": "Bethlehem", "value": 96},
      { "name": "Canvas", "value": 96},
      { "name": "Gambier", "value": 45},
      { "name": "Milwaukee", "value": 3},
      { "name": "Madison", "value": 21},
      { "name": "San Antonio", "value": 7},
      { "name": "Madison", "value": 77},
      { "name": "Shreveport", "value": 84},
      { "name": "Conway", "value": 75}
    ],
    [
      {"name": "Paris", "value": 57},
      {"name": "Warren", "value": 48},
      {"name": "Charleston", "value": 98},
      {"name": "Conway", "value": 24}
    ]
  ]

  var originaldata = [
    { "name": "Childhood", "value":184},
    { "name": "High School", "value":45}
  ];
  var originalrange = ["#1f77b4", "#aec7e8"];

  var data = [];
  var colors_map = new Map();
  //var defaultColors = d3.scaleOrdinal(d3.schemeCategory10);
  var chart;

  function calculateData() {
    console.log("Recalculating...");

    //Events_list and colors_list are used to help set up the linking system.
    let events_list = $(".eventname").map(function(){return this.innerHTML;}).get();
    let dates_list = $(".date-pick").map(function(){return new Date(this.value);}).get();
    let months_list = getNumMonthsFromDatesList(dates_list);
    var colors_list = $(".colorpick").map(function(){return this.value;}).get();
    let dataRows = $(".color-col");
    console.log(dates_list);
    console.log(months_list);

    data = []
    colors_map = new Map();

    //For all events, if the event does not exist in the map, set the color to the first color in the list.
    events_list.forEach((item, i) => {
      // should we slugify the event name? Why do we need to slugify things?
      data.push({ "name": events_list[i],
                  "value": months_list[i]});

      let color_td = dataRows[i];
      let cpick = $(color_td).find(".colorpick");
      let clink = $(color_td).find(".clink");

      if(!colors_map.has(item)){
        //console.log("found " + item + " " + colors_list[i]);
        colors_map.set(item, colors_list[i]);

        cpick.css("display", "initial");
        cpick.prop("disabled", false);

        //This bit of code is for the unlinking of events!
        if (clink.prop("disabled")===false){
          let new_color=randomColor();
          colors_list[i]=new_color;
          colors_map.set(item, colors_list[i]);
          cpick.val(colors_map.get(item));
        }

        clink.css("display", "none");
        clink.prop("disabled", true);
      } else {
        cpick.val(colors_map.get(item));
        cpick.css("display", "none");
        cpick.prop("disabled", true);

        //Insert unlink icon
        clink.css("display","initial");
        clink.prop("disabled", false);
      }
    });

    checkFuture();
    //console.log(colors_map);
    //console.log(data);
  }

  function makeWaffleChart() {
    chart = myLifeInMonths()
        .title($("#title-input").text())
        .colorscale(colors_map);

    d3.select("#waffle")
  			.datum(data)
  			.call(chart);
  }

  function getCurrentNumMonths() {
    var numMonths = 0;
    var dataRows = $("#mainTable").find('tbody tr');
    dataRows.each(function () {
      var row = $(this);
      numMonths += parseInt(row.children().eq(2).text());
    })
    console.log(numMonths);
    return numMonths;
  }

  function getNumMonthsFromDatesList(dates_list) {
    var months_list = [];
    for (let index = 0; index < dates_list.length; index++) {
      const element = dates_list[index];
      var previous = new Date();
      if (!(index == dates_list.length - 1)) {
        previous = dates_list[index + 1];
      }
      months_list.push(calculateMonths(element, previous));
    }
    return months_list;
  }

  // Help from https://stackoverflow.com/questions/44494447/generate-and-download-screenshot-of-webpage-without-lossing-the-styles
  $( "#camera" ).click(function() {
    $(this).html("Processing");
    $(this).removeClass("btn-primary");
    $(this).addClass("btn-danger");
    console.log("Testing");
    var cameraClone = $("<div></div>").html($("#capture").html());
    cameraClone.css("width", "800px");
    cameraClone.attr("id", "captureClone");
    cameraClone.addClass("chart-area");
    $("body").append(cameraClone);

    setTimeout(function() {
      domtoimage.toBlob(document.getElementById('captureClone'))
      .then(function (blob) {
          window.saveAs(blob, 'my-life-in-months.png');
      }).finally(function (blob) {
          $("#captureClone").remove();
          $("#camera" ).html("<i class='fa fa-camera' aria-hidden='true'></i> Download Image");
          $("#camera" ).removeClass("btn-danger");
          $("#camera" ).addClass("btn-primary");
      });
    }, 500);
  });

  $( "#csv-button" ).click(function() {
    var title = document.getElementById("title-input").textContent;
    download(title, convertDataToCSVFormat(data, colors_map));
  });

  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // use the 1st file from the list
    f = files[0];
    var f_name = f.name.split(".")[0];

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
        return function(e) {

          CSVFormatToData(e.target.result, f_name);
        };
      })(f);
      reader.readAsText(f);
    }

  document.getElementById('file-upload').addEventListener('change', handleFileSelect, false);

  function CSVFormatToData(csv_string, csv_name) {
    var rows = csv_string.split("\n");
    var dataToChange = [];
    var colorsMapToChange = new Map();
    if (rows[rows.length - 1] == "") {
      rows.splice(rows.length - 1, 1);
    }
    var isInvalid = false;
    rows.splice(0, 1);
    rows.forEach(element => {
      var columns = parseCSVRows(element);
      if (columns.length != 3 || !isNormalPosInteger(columns[1]) || !/^#[0-9A-F]{6}$/i.test(columns[2])) {
        isInvalid = true;
        return;
      }
      dataToChange.push({"name" : columns[0], "value" : columns[1]});
      if (!colorsMapToChange.has(columns[0])) {
        colorsMapToChange.set(columns[0], columns[2]);
      }
    });
    if (!isInvalid) {
      $( "#title-input" ).html(csv_name);
      populateTable(dataToChange, colorsMapToChange);
      calculateData();
      makeWaffleChart();
    }
    else {
      $('#showEventAlertHere').html(alertMaker("alert-event-name-length",
      "Your CSV file is not in the correct format! Please read our Uploading Format Guidlines."));
    }
    document.getElementById('file-upload').value = '';
  }

  function parseCSVRows(rowString) {
    var splitOnDoubleQuotes = rowString.split('\"');
    if (splitOnDoubleQuotes.length == 1) {
      var toReturn = rowString.split(",");
      if (toReturn.length != 3) {
        return []
      }
      return toReturn;
    }
    else if (splitOnDoubleQuotes.length != 3){
      return [];
    }
    console.log(splitOnDoubleQuotes);
    var first = splitOnDoubleQuotes[1];
    var lastTwo = splitOnDoubleQuotes[2].split(",");
    console.log(first + lastTwo);
    return [first, lastTwo[1], lastTwo[2]];
  }

  function convertDataToCSVFormat(dataToConvert, colorsMapToConvert) {
    var toReturn = "Life Event,Months,Color\n";
    dataToConvert.forEach(element => {
      toReturn += '"' + element["name"] + '"' + "," + element["value"] + "," + colorsMapToConvert.get(element["name"]) + "\n";
    });
    return toReturn
  }

  // Taken from https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
  function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename + ".csv");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  /* global $ */
  /* this is an example for validation and change events */
  $.fn.numericInputExample = function () {
  	'use strict';
  	var element = $(this);

    element.find('td').off('change').off('validate');

  	element.find('td').on('change', function (evt) {
      if (!$(this).hasClass( "radiocheck" )) {
        calculateData();
        makeWaffleChart();
      }
  	}).on('validate', function (evt, value) {
  		var cell = $(this),
  			column = cell.index();
		if( cell.attr("id") == "title-input") {
			if (!value){
				$('#showEventAlertHere').html(alertMaker("alert-event-name-length", "Charts need a title!"));
			}
			else if (value.trim().length == 0){
				$('#showEventAlertHere').html(alertMaker("alert-event-name-length", "Titles must be at least 1 character long!"));
			}
			else if (value.trim().length >= 30){
				$('#showEventAlertHere').html(alertMaker("alert-event-name-length", "Titles must be less than 30 characters long!"));
			} else {
				$("#alert-event-name-length").remove();
			}
			return !!value && value.trim().length > 0 && value.trim().length < 30;
		}
  		else if (column === 1) {
        if (!value){
  		    $('#showEventAlertHere').html(alertMaker("alert-event-name-length", "Event names must not be empty!"));
        }
        else if (value.trim().length == 0){
  		    $('#showEventAlertHere').html(alertMaker("alert-event-name-length", "Event names must be at least 1 character long!"));
        }
        else if (value.trim().length >= 25){
  		    $('#showEventAlertHere').html(alertMaker("alert-event-name-length", "Event names must be less than 25 characters long!"));
        } else {
          $("#alert-event-name-length").remove();
        }
  			return !!value && value.trim().length > 0 && value.trim().length < 25;
  		} else if (column === 2){
        if (!isNormalPosInteger(value)) {
          $('#showMonthsAlertHere').html(alertMaker("alert-event-month-length", "Events must be an integer greater than 0 and less than 1200 months long!"));
        } else {
          $("#alert-event-month-length").remove();
        }

  			return isNormalPosInteger(value);
  		} else {
        return false;
      }
  	});
  	return this;
  };

  function addNewEventRow(event, dayStarted, color) {
    var dateInputFormat =  getDateInputFormat(dayStarted); 
    var newRow = $('<tr>' +
          '<td class="radiocheck"><input class="rowcheck" type="checkbox"></td>' +
          '<td class="eventname" tabindex="1">' + event + '</td>' +
          '<td class="monthsevent" tabindex="1">' + '<input class="date-pick" type="date" value="' + dateInputFormat + '">' + '</td>' +
          '<td class="color-col"><input class="colorpick" type="color" value="' + color + '">' +
          '<span class="clink"><i class="fa fa-link"></i></span></td></tr>');
    $('#mainTable').find("tbody").append(newRow);
    // https://github.com/mindmup/editable-table/issues/1
    newRow.numericInputExample();
    var box = $(newRow.children().eq(0).children().eq(0));
    box.click(function() {
      checkState()
    });
  }

  function getDateInputFormat(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var date_input_format = year + "-";
    date_input_format += (month > 9) ? (month + "") : ("0" + month);
    date_input_format += (day > 9) ? (month + "") : ("0" + day);
    return date_input_format;
  }

  function randomEventRow() {
    var eventNames = getRandomEventName(1);
    var day = getNextRandomDate();
    var c = randomColor();
    addNewEventRow(eventNames[0], day, c);
    calculateData();
    makeWaffleChart();
  }

  function calculateMonths(first, second) {
    return (second.getFullYear() * 12 + second.getMonth()) - (first.getFullYear() * 12 + first.getMonth());
  }

  $( "#addrow" ).click(function() {
    randomEventRow();
  });

  $( ".exampleCharts" ).click(function() {
    var value = $(this).attr('value');
    var populateData = exampleData[parseInt(value)];
    populateTable(populateData);
    calculateData();
    makeWaffleChart();
    $('#mainTable').editableTableWidget().numericInputExample()
  });

  function populateTable(newData, colorsMapData) {
    $("#mainTable").find("tbody").html("");
    colors_map = colorsMapData;
    newData.forEach(function(row) {
      if (!colors_map.has(row["name"])) {
        let c = randomColor({seed:eventNames[i]});
        addNewEventRow(row["name"], row["value"], c);
        colors_map.set(row["name"], c);
      } else {
        addNewEventRow(row["name"], row["value"], colors_map.get(row["name"]));
      }
    })
    //data = newData;
  }

  $( "#togglefuture" ).click(function() {
    calculateData();
    makeWaffleChart();
  });

  function checkFuture() {
    const lifeExpectancy = 80
    var numMonths = getCurrentNumMonths();
    if ($('#togglefuture').prop('checked') && (lifeExpectancy * 12) > numMonths) {
      futureIndex = data.length;
      data.push({ "name": "The Future",
                  "value": (lifeExpectancy * 12) - numMonths});
      colors_map.set("The Future", "#bfbfbf");
    }
  };

  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  /* Randomize array in-place using Durstenfeld shuffle algorithm */
  function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
  }

  function getRandomEventName(count){
    events = ["Backpacked Andes", "Mars Vacation", "Started pickle farm", "Went ghost hunting",
    "Raised dinosaurs", "Learned to unicycle", "Surveyed Antarctica", "Studied arachnids",
    "Studied French", "Published a book", "Sculpted ice", "Entered the Olympics",
    "Composed an opera", "Busked in subway", "Perfected sourdough", "Shrunk to 1:12 size",
    "Robot uprising", "Developed vaccine", "Worked in Moria", "Unemployed", "Netflix binge",
    "Ant invasion", "Kaiju attacks", "The Long Nap", "Unexplained illness",
    "Worked three jobs", "Worked at Ponderosa", "Delivered mail", "Rescued lemurs",
    "Camino de Santiago", "Red Cross Volunteer", "Southwest Roadtrip", "Lived with squirrels"];

    shuffleArray(events);

    return events.slice(0, count);
  }

  // https://stackoverflow.com/questions/10834796/validate-that-a-string-is-a-positive-integer
  function isNormalPosInteger(str) {
      str = str.trim();
      if (!str) {
          return false;
      }
      str = str.replace(/^0+/, "") || "0";
      var n = Math.floor(Number(str));
      return n !== Infinity && String(n) === str && n > 0 && n <= 1200;
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }

  function alertMaker(id, text) {
    return '<div class="alert alert-danger alert-dismissible show fade" role="alert" id="' + id + '">' +
      '<strong>Warning!</strong> ' + text + ' ' +
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
      '  <span aria-hidden="true">&times;</span>' +
      '</button>' +
    '</div>'
  }

  function getLastEventDate() {
    var last_event_date = new Date("2000-01-01");
    if ($(".date-pick").length) {
      last_event_date = $( ".date-pick" ).last().value;
      console.log(last_event_date);
    }
    return last_event_date;
  }

  function getNextRandomDate() {
    var last_event_date = getLastEventDate();
    var num_months_to_add = getRandomIntInclusive(10,30);
    var next_random_date = new Date(last_event_date.setMonth(last_event_date.getMonth() + num_months_to_add));
    return next_random_date;
  }

  var eventNames = getRandomEventName(5);
  for (var i = 0; i < eventNames.length; i++) {
    var day = getNextRandomDate();
    var c = randomColor();
    addNewEventRow(eventNames[i], day, c);
  }

  calculateData();
  makeWaffleChart();


  function getCurrentChecks() {
    var numChecks = 0;
    var dataRows = $("#mainTable").find('tbody tr');
    dataRows.each(function () {
      var row = $(this);
      var box = $(row.children().eq(0).children().eq(0));
      if(box.is(":checked")){
        numChecks++;
      };
    })
    console.log(numChecks);
    return numChecks;
  }

  function alterTable(func) {
    var dataRows = $("#mainTable").find('tbody tr');
    dataRows.each( function () {
      var row = $(this);
      var box = $(row.children().eq(0).children().eq(0));
      //https://www.tutorialrepublic.com/faq/how-to-check-a-checkbox-is-checked-or-not-using-jquery.php
      if(box.is(":checked")){
        func(row);
      };
    });
    checkState();
  }

  $( "#remove" ).click(function() {
    alterTable(function(row) {row.remove();});
    calculateData();
    makeWaffleChart();
  });

  $( "#moveup" ).click(function() {
    alterTable(function(row) {row.insertBefore(row.prev());})
    calculateData();
    makeWaffleChart();
  });

  $( "#movedown" ).click(function() {
    alterTable(function(row) {row.insertAfter(row.next());})
    calculateData();
    makeWaffleChart();
  });

  $( "#repeat" ).click(function() {
    alterTable(function(row) {
      let c = row.clone();
      var box = $(c.children().eq(0).children().eq(0)); // need to remove the checkmark
      box.prop('checked', false); //https://stackoverflow.com/questions/13557623/remove-attribute-checked-of-checkbox
      row.parent().append(c);
      box.click(function() {
        checkState()
      });})
    calculateData();
    makeWaffleChart();
  });

  function checkState(){
    let check_count = getCurrentChecks();
    if (check_count == 0) {
      $( "#remove" ).prop('disabled', true);
      $( "#moveup" ).prop('disabled', true);
      $( "#movedown" ).prop('disabled', true);
      $( "#repeat" ).prop('disabled', true);
    } else if (check_count == 1) {
      $( "#remove" ).prop('disabled', false);
      $( "#moveup" ).prop('disabled', false);
      $( "#movedown" ).prop('disabled', false);
      $( "#repeat" ).prop('disabled', false);
    } else {
      $( "#remove" ).prop('disabled', false);
      $( "#moveup" ).prop('disabled', true);
      $( "#movedown" ).prop('disabled', true);
      $( "#repeat" ).prop('disabled', false);
    }
  }

  checkState();

  $('.rowcheck').click(function() {
    checkState()
  });

  $('#mainTable').editableTableWidget().numericInputExample();

  $(".alert").alert();

  document.getElementById("title-input").focus();
});
