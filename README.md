# Earthquakes
Spider and parser written in Node that fetches data every minute about logged earthquakes in Iceland. 

The data source is the Icelandic Met Office, and the spider crawls this page: http://www.vedur.is/skjalftar-og-eldgos/jardskjalftar/#view=table

# CartoDB
This repo is useless unless you signup for a CartoDB account on http://www.cartodb.com (or run your own CartoDB server) but it demonstrates how you can easily crawl pages at certain intervals using <a href="https://www.npmjs.com/package/request">Request</a> and <a href="https://www.npmjs.com/package/cheerio">Cheerio</a> and post to the CartoDB SQL API, using a datepicker to modify the SQL query.

# Demo
A landing page with a Torque layer that animates the records by date.

http://earthquakes.projects.nonni.cc
