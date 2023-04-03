const fs = require('fs');
const csvRead = require('csv-reader');
const createCvsWriter = require('csv-writer').createArrayCsvWriter;
const fileName = "KNSR3852_16.csv";
let inputStream = fs.createReadStream(`./input/${fileName}`, 'utf8');

let record =  [];
let i= 0 ,j= 0;
let merged = false
inputStream
    .pipe(new csvRead ({ parseNumbers : true, parseBooleans: true, trim: true, skipLines: 1}))
    .on('data', function(row) {
        //console.log(row);
        row.splice(0,1);
        if( typeof(row[0]) == "number" || row[0] == "" ) row.splice(0, 1)
        i=0;
        merged = false;
        for(elt of row)
        {
            if(typeof(elt) == "string" && elt != "")
            {
                if(elt[0] == elt[0].toLowerCase() || elt[0] == "("){
                    record[record.length-1][i] += ` ${elt}`;
                    i++;
                    merged = true;
                    continue;
                }
            }
            i++
        }

        if(!merged) record.push(row)
        
    })
    .on('end', function(){
        const csvWriter = createCvsWriter({
            path: `./outpout/${fileName}`
        });
        
        csvWriter.writeRecords(record);
        
    })