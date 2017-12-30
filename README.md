# IDN Homograph Detector

The internationalized domain name (IDN) homograph attack is a way a malicious party may deceive computer users about what remote system they are communicating with, by exploiting the fact that many different characters look alike, (i.e., they are homographs, hence the term for the attack). For example, a regular user of example.com may be lured to click a link where the Latin A is replaced with the Cyrillic A.

This project was built for a database class, and the basic idea was to provide domain name owners to see all potential homographs of their domain name and see the ones that had already been registered because they could potentially be threatening. 

The project only focused on .com zone files. Verisgn provided a 10GB data dump of all the .com domains. Using a script written in python, the database was populated with all cyrillic domain names from the entire dataset. For every domain name searched, all the possible combinations limiting to 3 character mutations were listed and for each domain, the user was allowed to query the database to check the existance of the homograph. 

## Frameworks & Dependencies

The project is written in JavaScript using NodeJS runtime environment. Scrapers were written in Python. 
Dependencies : 
* EJS - Templating
* Express - Server
* MySql - Database
* PunyCode - ASCII to Punycode

## How to run

Clone the repo and from the terminal run `npm install` to get all the dependencies. Setup mysql and add your credentials in the `server.js` file. Use `idn.sql` file to setup the database. Run the app using `node server.js` and go to `http://localhost:3000/` on your browser. 
