var cheerio = require('cheerio');
var _ = require('underscore');
var moment = require('moment');
var request = require('request');
var CartoDB = require('cartodb');
var secret = require('./secret.js');
var schedule = require('node-schedule');

var client = new CartoDB({
  user: secret.USER, 
  api_key:     secret.API_KEY,
  /* e.g. http://myusername.cartodb.com */
  cartodb_url: (process.env.CARTODB_URL || 'http://cartodb.projects.nonni.cc:8080')
});

console.log(client.access_url);

client.on('connect', function() {
  var splitted;
  var code;
  var valuesArr = [];
  var sqlAll = "select t from {table}";
  var sql = "insert into {table} (t, the_geom, a, dep, s, q, dl, dd, dr) values ";
  var url = "http://www.vedur.is/skjalftar-og-eldgos/jardskjalftar/#view=table";

  client.query(sqlAll, {table: 'earthquakes'}, function(err, data){            
    var rows = [];
    _.each(data.rows, function(obj){ rows.push(moment.utc(obj.t).toISOString()); });
    console.log(rows);
    request(url, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        $ = cheerio.load(html);
        $('script').each(function(i, elem) {
          if (i == 5) {
            splitted = $(elem).text().split("\n");
            code = eval(splitted[10].split('=')[1]);            
            code.map(function(quakes) {
              if (!(_.contains(rows, moment.utc(quakes.t).toISOString())))  {             
                var day = moment.utc(quakes.t).toISOString();
                quakes.lon = quakes.lon.toString().replace(',','.');
                quakes.lat = quakes.lat.toString().replace(',','.');
                quakes.dep = quakes.dep.toString().replace(',','.');
                quakes.s = quakes.s.toString().replace(',','.');
                quakes.q = quakes.q.toString().replace(',','.');              
                quakes.dL = quakes.dL.toString().replace(',','.');              

                sql += "('" + 
                  day + "'," +
                  "(ST_SetSRID(ST_Point("+quakes.lon+","+quakes.lat+"),4326))" + "," +
                  quakes.a + "," +
                  quakes.dep + "," +
                  quakes.s + "," +
                  quakes.q + "," +
                  quakes.dL + ",'" +
                  quakes.dD + "','" +
                  quakes.dR +"'" +
                   "),";                
              }
            })
          }
        });
        sql = sql.substr(0,sql.length-1);
        client.query(sql, {table: 'earthquakes'}, function(err, data){
          console.log(data);
        })        
      }            
    });    
  });  

});
var j = schedule.scheduleJob('*/1 * * * *', function(){
    console.log('Running crawler at: ', moment().toISOString());
    client.connect();
});