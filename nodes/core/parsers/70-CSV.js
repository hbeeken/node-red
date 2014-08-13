/**
 * Copyright 2014 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    "use strict";
    var csv = require('fast-csv');
    
    function CSVNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;
        this.on("input", function(msg) {
            if (msg.hasOwnProperty("payload")) {
                if (typeof msg.payload == "object") { //convert to csv
                    if (msg.payload instanceof Array) {
                        console.log("msg.payload instanceof Array");
                        console.log(msg.payload);
                        var columns;
                        if (n.temp) {
                            columns = n.temp;
                        } else {
                            // assume first row are the headers
                            columns = true;
                        }
                        console.log(n.temp);
                        var csvString = csv.writeToString(msg.payload, {headers:columns});
                        console.log(csvString);
                        msg.payload = csvString;
                        node.send(msg);
                    }
                }
                else if (typeof msg.payload == "string") { //convert csv string to js
                    console.log("converting to a js object");
                    console.log(msg.payload);
                    var obj = {};
                    var row = 0;
                    
                    var columns;
                    if (n.temp) {
                        columns = n.temp;
                    } else {
                        // assume first row are the headers
                        columns = true;
                    }
                    csv.fromString(msg.payload, {headers:columns}).on ("record", function(data){
                        console.log("row " + row + " = " + data);
                        console.log(data);
                        obj[row] = data;
                        console.log("-----------");
                        row++;
                    }).on("end", function() {
                        console.log("done");
                        msg.payload = obj;
                        node.send(msg);
                    });
                }
                else { node.log("This node only handles csv strings or js objects."); }
            }
        });
    }
    RED.nodes.registerType("csv",CSVNode);
}
