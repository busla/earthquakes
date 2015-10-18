window.onload = function () {
    var datePickerConfigs = {
        ranges: {
           'Í dag': [moment(), moment()],
           'Í gær': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Síðustu 7 daga': [moment().subtract(6, 'days'), moment()]
           //'Síðustu 30 daga': [moment().subtract(29, 'days'), moment()],
           //'Þessi mánuður': [moment().startOf('month'), moment().endOf('month')],
           //'Síðasti mánuður': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },        
        "locale": {
          "format": "DD/MM/YYYY",
          "separator": " - ",
          "applyLabel": "Sækja",
          "cancelLabel": "Til baka",
          "fromLabel": "Frá",
          "toLabel": "Til",
          "customRangeLabel": "Velja tímabil",
          "daysOfWeek": [
              "Sun",
              "Mán",
              "Þri",
              "Mið",
              "Fim",
              "Fös",
              "Lau"
          ],
          "monthNames": [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"
          ],
          "firstDay": 1
        },        
        "drops": "down",
        "startDate": moment(),
        "endDate": moment()
    };
    $('.datepicker .range').html(moment().format('DD. MMM ´YY'));
    var mapCss = [
    'Map {',
    '-torque-frame-count:1000;',
    '-torque-animation-duration:4;',
    '-torque-time-attribute:"t";',
    '-torque-aggregation-function:"count(cartodb_id)";',
    '-torque-resolution:1;',
    '-torque-data-aggregation:linear;',
    '}'
    ].join('\n');

    function calculateDuration(start, end) {
      var newDuration = Math.round((end-start) / 15000000);
      
      return newDuration;
    };

    function createSelector(torqueLayer) {
          $('.datepicker').daterangepicker(datePickerConfigs, function(start, end, label) {
            torqueLayer.stop();
                       
            torqueLayer.setDuration(calculateDuration(start, end));
            $('.datepicker .range').html(start.format('DD. MMM') + ' - ' + end.format('DD. MMM'));
            var datePickerQuery = Mustache.render("SELECT * FROM earthquakes where t BETWEEN ('{{start}}') AND ('{{end}}')", {start: moment.utc(start).toISOString(), end: moment.utc(end).toISOString()});          
        
            torqueLayer.setSQL(datePickerQuery)
              .on('load', function() {                
                torqueLayer.play();
            });
          });
    };

    //var viz = 'http://cartodb.projects.nonni.cc/user/nonni/api/v2/viz/269ec9be-71fa-11e5-8f49-0242ac1102a9/viz.json';
    var map = new L.Map('map', {
        center: [65.02578496606658,-18.226318359375], // Iceland
        zoom: 4,
        fullscreen: true,        

    });
    
    

    var MapBox = L.tileLayer('http://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      id: 'levito.nncakpfl',
      accessToken: 'pk.eyJ1IjoibGV2aXRvIiwiYSI6IlBJb2JmMVUifQ.zQtsrXpJF3DmgbxT4tysLQ'
    });

    map.addLayer(MapBox);    
    
    var layerSource = {
        type: 'torque',
        options: {
            query: "SELECT * FROM earthquakes where t >= ('TODAY'::date)",
            //query: "SELECT * FROM earthquakes",
            maps_api_template: "http://cartodb.projects.nonni.cc:8181/user/{user}",            
            tiler_domain: "cartodb.projects.nonni.cc",
            tiler_port: "8181",
            tiler_protocol: "http",
            sql_api_template: "http://cartodb.projects.nonni.cc:8080/user/{user}", 
            sql_api_port: 8080,         
            sql_api_endpoint: "/api/v2/sql",
            sql_api_protocol: "http",
            sql_api_domain: "cartodb.projects.nonni.cc",            
            user_name: 'nonni',
            cartocss: (mapCss+$('#cartocss').html())
            

            //tile_style: '/** torque visualization */ Map { -torque-frame-count:19; -torque-animation-duration:2; -torque-time-attribute:"t"; -torque-aggregation-function:"count(cartodb_id)"; -torque-resolution:4; -torque-data-aggregation:linear; } #monkey_jump{ comp-op: lighter; marker-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 0; marker-line-opacity: 1; marker-type: ellipse; marker-width: 12; marker-fill: #FF2900; }'
        }
    };

    cartodb.createLayer(map,layerSource, {no_cdn:true,cartodb_logo: false})
      .addTo(map)
      .done(function(layer) {
        
        var torqueLayer = layer;
        createSelector(torqueLayer);

        torqueLayer.on('load', function() {
            torqueLayer.play();
        });        
        torqueLayer.on('change:time', function(changes) {
          
          var st = changes.time.toString().substr(4).split(' ');
          if (st.length > 2) {
            $('.time > .value').text(st[1] + '. ' + st[0] +  ' - ' + st[3].substr(0,5));
          }          

        });        
      })
      .error(function(err) {
          console.log("Error: " + err);
      });             

}