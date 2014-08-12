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
        this.template = n.temp.split(",");
        this.sep = n.sep || ',';
        this.sep = this.sep.replace("\\n","\n").replace("\\r","\r").replace("\\t","\t");
        this.quo = '"';
        var node = this;
        this.on("input", function(msg) {
            if (msg.hasOwnProperty("payload")) {
                if (typeof msg.payload == "object") { //convert to csv
                    //csv.writetoString()
                    node.send(msg);
                }
                else if (typeof msg.payload == "string") { //convert csv string to js
                    var obj = {};
                    var row = 0;
                    // assume first row are the headers
                    csv.fromString(msg.payload, {headers:true}).on ("record", function(data){
                        console.log("row " + row + " = " + data);
                        console.log(data);
                        obj[row] = data;
                        console.log("-----------");
                        row++;
                    }).on("end", function(data) {
                        console.log("data: " + data);
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
