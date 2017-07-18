var fileData = {};
	var name = "", rollNumber ="";
	$(document).ready(function() {
		resetAlerts();
		$("#add-location").click(function() {
			getLocation();
		});
		
	});
	
    google.charts.load('current', {
      'packages': ['map'],
      // Note: you will need to get a mapsApiKey for your project.
      // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
      'mapsApiKey': "AIzaSyDOsfhvWs3me3uY8Yy4hl8vJC_B4Zl8jLU" // MT2015Network project
    });
    google.charts.setOnLoadCallback(loadData);

    function drawMap (chartData) {
      var locationData = new google.visualization.DataTable();
      locationData.addColumn('number', 'Lat');
      locationData.addColumn('number', 'Long');
	  locationData.addColumn('string', 'Name');
	  
	  rollNumbers = Object.keys(chartData);
	  var rows = [];
	  for(var k in rollNumbers) {
		locationData.addRow(chartData[rollNumbers[k]]);
	  }
	  
	  //locationData.addRows([[12.844751,77.663232,"IIITB"]]);

      var options = {
        mapType: 'styledMap',
        zoomLevel: 5,
        showTooltip: true,
        showInfoWindow: true,
        useMapTypeControl: true,
		enableScrollWheel: true,
        maps: {
          // Your custom mapTypeId holding custom map styles.
          styledMap: {
            name: 'Styled Map', // This name will be displayed in the map type control.
            styles: [
              {featureType: 'poi.attraction',
               stylers: [{color: '#fce8b2'}]
              },
              {featureType: 'road.highway',
               stylers: [{hue: '#0277bd'}, {saturation: -50}]
              },
              {featureType: 'road.highway',
               elementType: 'labels.icon',
               stylers: [{hue: '#000'}, {saturation: 100}, {lightness: 50}]
              },
              {featureType: 'landscape',
               stylers: [{hue: '#259b24'}, {saturation: 10}, {lightness: -22}]
              }
        ]}}
      };

      var map = new google.visualization.Map(document.getElementById('map_div'));
	  map.draw(locationData, options);
    }
	
	function loadData(){
        $.ajax({
            url: 'getdata.php',
            cache: false,
            async: true,
            beforeSend: function () {
                //do what you want to do before sending the data to the server
            },
            type: "POST",
            data: { password: '123' }, //data to post to server
            error: function (inerror) {
                //do something if an error happends
            }, 
            success: function (indata) {
                //do something with server's response
                indata = JSON.parse(indata);
				fileData = indata;
				console.log(indata);
				$("#friend-count").html(Object.keys(indata.data).length);
				drawMap(indata.data);				
            }
        });
	}
	function resetAlerts(){
		$('.alert-warning').hide();
		$('.alert-success').hide();
	}
	function getLocation() {
		
		name = $("#friend-name").val();
		name = name.trim();
		
		var rollNumber_tmp = $("#friend-roll-number").val();
		rollNumber_tmp = parseInt(rollNumber_tmp);
		

		if(name != '' && !isNaN(rollNumber_tmp) && ((rollNumber_tmp >= 1 && rollNumber_tmp <= 132) || (rollNumber_tmp >= 501 && rollNumber_tmp <= 521))  )
		{
			$("#friend-roll-number").val(rollNumber_tmp);
			
			rollNumber = "MT2015" + (rollNumber_tmp < 100 ? "0" + rollNumber_tmp : rollNumber_tmp);
			
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition);
			} else { 
				resetAlerts();
				$('.warning-text').html("Geolocation is not supported by this browser.");
				$('.alert-warning').show();
				setTimeout(function() { resetAlerts(); }, 3000);
			}
		}
		else {
				resetAlerts();
				$('.warning-text').html("Please enter valid name and roll number");
				$('.alert-warning').show();
				setTimeout(function() { resetAlerts(); }, 3000);
		}
	}

	function showPosition(position) {
		resetAlerts();
		$('.success-text').html("Your location added/updated successfully");
		fileData.data[rollNumber] = [position.coords.latitude,position.coords.longitude,name];
		
		//fileData.data.push([position.coords.latitude,position.coords.longitude,name]);
		console.log(fileData);
		$.ajax({
            url: 'savedata.php',
            cache: false,
            async: true,
            beforeSend: function () {
                //do what you want to do before sending the data to the server
            },
            type: "POST",
            data: { filedata: JSON.stringify(fileData) }, //data to post to server
            error: function (inerror) {
                //do something if an error happends
            }, 
            success: function (indata) {
               $('.alert-success').show();	
			   loadData();
            }
        }); 
	}