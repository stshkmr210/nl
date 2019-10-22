let url = `https://www.newslaundry.com/sample-data/sample-subscribers.csv`;
//`http://samplecsvs.s3.amazonaws.com/SalesJan2009.csv`;
let fileName = 'csvFile.csv';
const fs = require('fs');
const request = require('request');
const csv = require('csvtojson');
const moment = require('moment');
let inputMonth = process.argv[2] || moment(new Date()).format('M');

console.log("inputMonth",inputMonth);

var getJsonOfCsv = function(url,fileName) {
	return new Promise(async (resolve,reject)=>{
		try{
           let requestObj =  request(url)
           requestObj.on('response', (response) => {
           	  console.log(response.statusCode);
           	  if(!response || response.statusCode != 200){
           	  	return reject('file not found');
           	  }
			  return resolve(response.pipe(fs.createWriteStream(fileName)));
		   });
		   requestObj.on('error', (error) => {
		   	 return reject(error);
		   });
		}catch(error){
		  return reject(error);
		}
	});
} 


var fetchCsv = async function() {
	 try{
     	 await getJsonOfCsv(url,fileName);
     	 let jsonArray = await csv().fromFile(fileName);
     	 if(!jsonArray || jsonArray.length <=0){
     	 	console.log('no data found');
     	 	return false;
     	 }
     	 let gained  = 0;
     	 let lost = 0;
     	 let division = {
     	 	"Disruptor"   : 0,
     	 	"Liberator"   : 0,
     	 	"GameChanger" : 0,
     	 };
     	 jsonArray.forEach(function(value,index){
     	 	console.log(value,index);
     	 	if(value['Subscription Start Date'] && moment(new Date(value['Subscription Start Date'])).format('M') == inputMonth){
             gained++;
     	 	}
     	 	if(value['Subscription End Date'] && moment(new Date(value['Subscription End Date'])).format('M') == inputMonth){
             lost++;
     	 	}
     	 	if(value['Subscription End Date'] && value['Subscription Start Date'] 
     	 		&& moment(new Date(value['Subscription Start Date'])).format('M') >= inputMonth  
     	 		&& inputMonth <= moment(new Date(value['Subscription End Date'])).format('M')){
             division[value['Subscription Type']]++;
     	 	}
     	 });
     	 console.log("Lost::",lost);
     	 console.log("Gained::",gained);
     	 console.log("Division::",division);
	 }catch(error){
	 	console.log(error);
	 }
}

fetchCsv();

