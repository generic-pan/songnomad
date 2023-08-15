const express = require('express');
const app = express();
const _ = require('underscore');

const azure = require('azure-storage');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

let rowCount = 0;

const request = require('request');
const headers = {
  'Accept': 'application/json;odata=nometadata'
};
request({
  url: '[INSERT TABLE URL]',
  headers: headers
}, function(error, response, body) {
  if (error) {
    console.error(error);
  } else {
    //console.log(body);
    rowCount = JSON.parse(body).value.length;
    console.log(rowCount);
  }
});

app.use(express.static('public'));

app.listen(process.env.PORT || 3000, function() {
  console.log('Server is running...');
});

var tableRows = [];
var tableUrl;
var tableSas;

const url = tableUrl + tableSas;


request({
  url: url,
  headers: headers
}, function(error, response, body) {
  if (error) {
    console.error(error);
  } else {
    //console.log(body);
    tableRows = JSON.parse(body).value;
    app.get('/update', (req, res) => {
      const myRet = _.sample(tableRows, 8);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(myRet));
    });
  }
});

app.post('/email', (req, res) => {
  const email = req.body.email;
  const entity = {
  PartitionKey: { '_': '0' },
  RowKey: { '_':  rowCount + ""},
  email: { '_': email }
};
rowCount++;

// Insert the entity into the "songnomad" table
tableService.insertEntity('emails', entity, (error, result, response) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Entity inserted successfully');
  }
});
  console.log(email);
  res.send(JSON.stringify('Email sent successfully'));
});