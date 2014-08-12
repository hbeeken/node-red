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

var should = require("should");
var path = require("path");
var fs = require('fs-extra');

var csvNode = require("../../../../nodes/core/parsers/70-CSV.js");
var helper = require("../../helper.js");

/* CSV contents
Surname First Name  Middle Name DOB
Smith   John    “Matthew George”    13/05/1984
Thomas  Emily   Jane    16/12/1953
Jones   John    James   05/11/2003
*/

describe('CSV node', function() {

    var resourcesDir = path.join(__dirname,"..","..","..","resources");
    var file = path.join(resourcesDir, "70-CSV-test-file.csv");
    
    before(function(done) {
        helper.startServer(done);   
    });

    afterEach(function() {
        helper.unload();
    });
    /*
    it('should be loaded', function(done) {
        var flow = [{id:"csvNode1", type:"csv", name: "csvNode", temp:"Surname, First Name, Middle Name, DOB"}];
        helper.load(csvNode, flow, function() {
            var csvNode1 = helper.getNode("csvNode1");
            csvNode1.should.have.property('name', 'csvNode');
            done();
        });
    });
    
    it('should be loaded with error if template not specified', function(done) {
        var flow = [{id:"csvNode1", type:"csv", name: "csvNode" }];
        helper.load(csvNode, flow, function() {
            var csvNode1 = helper.getNode("csvNode1");
            csvNode1.should.have.property('name', 'csvNode');
            csvNode1.on("log", function(msg) {
                console.log(msg);
                done();
            });
        });
    });

    it('should convert a valid csv string to a javascript object', function(done) {
        fs.readFile(file, 'utf8', function(err, data) {
            var flow = [{id:"n1",type:"csv",wires:[["n2"]],func:"return msg;", temp:"Surname, First Name, Middle Name, DOB"},
                        {id:"n2", type:"helper"}];
            helper.load(csvNode, flow, function() {
                var n1 = helper.getNode("n1");
                var n2 = helper.getNode("n2");
                n2.on("input", function(msg) {
                    msg.should.have.property('topic', 'bar');

                    msg.payload[0].should.have.property('Surname', "Smith");
                    msg.payload[0].should.have.property('First Name', "John"); 
                    msg.payload[0].should.have.property('Middle Name');    
                    msg.payload[0].should.have.property('DOB', "13/05/84");

                    msg.payload[1].should.have.property('Surname', "Thomas");
                    msg.payload[1].should.have.property('First Name', "Emily");                        
                    msg.payload[1].should.have.property('Middle Name', "Jane");    
                    msg.payload[1].should.have.property('DOB', "16/12/53");

                    msg.payload[2].should.have.property('Surname', "Jones");
                    msg.payload[2].should.have.property('First Name', "John");                        
                    msg.payload[2].should.have.property('Middle Name', "James");    
                    msg.payload[2].should.have.property('DOB', "05/11/03");
                    done();

                });
                n1.receive({payload:data,topic: "bar"});
            });            
        });
    });
*/  
   it('should convert a javascript object to an csv string', function(done) {
       var flow = [{id:"n1",type:"csv",wires:[["n2"]],func:"return msg;", temp:"Surname, firstName, middleName, DOB"},
                   {id:"n2", type:"helper"}];
        helper.load(csvNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n2.on("input", function(msg) {
                msg.should.have.property('topic', 'bar');
                console.log("TEST output");
                console.log(msg.payload);
                msg.payload.indexOf('Surname, firstName, middleName, DOB').should.be.above(-1);
                msg.payload.indexOf('Smith,John,Matthew George,13/05/84').should.be.above(-1);
                msg.payload.indexOf('Thomas,Emily,Jane,16/12/53').should.be.above(-1);
                msg.payload.indexOf('Jones,John,James,05/11/03').should.be.above(-1);
                done();
            });
            var johnSmith = {Surname: "Smith", firstName:"John", middleName:"Matthew George", DOB:"13/05/84"};
            var emilyThomas = {Surname:"Thomas", firstName:"Emily", middleName:"Jane", DOB:"16/12/53"};
            var johnJones =  {Surname:"Jones",firstName:"John", middleName:"James", DOB:"05/11/03"};
            var obj = [johnSmith,emilyThomas,johnJones];
            n1.receive({payload:obj,topic: "bar"});
        });
    });
 
/*   it('should log an error if asked to parse an invalid csv string', function(done) {
       var flow = [{id:"n1",type:"csv",wires:[["n2"]],func:"return msg;", temp:"Surname, firstName, middleName, DOB"},
                   {id:"n2", type:"helper"}];
        helper.load(csvNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n1.on("log", function(msg) {
                should.deepEqual("error", msg.level);
                done();
            });
            n1.receive({payload:'not valid csv string',topic: "bar"});
        });
    });
    
    it('should log an error if asked to parse something thats not csv or js', function(done) {
        var flow = [{id:"n1",type:"csv",wires:[["n2"]],func:"return msg;", temp:"Surname, firstName, middleName, DOB"},
                    {id:"n2", type:"helper"}];
        helper.load(csvNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n1.on("log", function(msg) {
                msg.should.have.property('msg');
                should.deepEqual("This node only handles csv strings or js objects.", msg.msg);
                done();
            });
            n1.receive({payload:1,topic: "bar"});
        });
    });

    it('should be loaded with error if template not specified', function(done) {
        var flow = [{id:"n1",type:"csv",wires:[["n2"]],func:"return msg;"},
                    {id:"n2", type:"helper"}];
        helper.load(csvNode, flow, function() {
            var n1 = helper.getNode("n1");
            var n2 = helper.getNode("n2");
            n1.on("log", function(msg) {
                msg.should.have.property('msg');
                console.log("msg.msg: " + msg.msg);
                should.deepEqual("A columns template MUST be specified that contains the ordered list of column headers.", msg.msg);
                done();
            });
            n1.receive({payload:1,topic: "bar"});
        });
    });
*/    
});
