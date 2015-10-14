# Earthquakes
Spider and parser written in Node that fetches data every minute about logged earthquakes in Iceland. 

The data source is the Icelandic Met Office, and the spider crawls this page: http://www.vedur.is/skjalftar-og-eldgos/jardskjalftar/#view=table

# CartoDB
This repo is useless unless you run your own CartoDB server but it demonstrates how you can easily crawl pages at certain intervals using <a href="https://www.npmjs.com/package/request">Request</a> and <a href="https://www.npmjs.com/package/cheerio">Cheerio</a> and post to the CartoDB SQL API running on your server.

# Demo
A landing page with an embedded iframe from CartoDB:
http://earthquakes.projects.nonni.cc
