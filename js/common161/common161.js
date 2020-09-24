"use strict";
var Common161 = (function () {
    return {
        isNotBlank: function (str) {
            return str && str.trim().length;
        },
        toBoolean: function (val) {
            if (val === undefined) {
                return false;
            }
            return val === "TRUE" || val === "true";
        },
        log : function(text, obj){
            console.log(text + " " + obj);
            return obj;
        },        
        iterator : function(array){
            if(array === undefined){
                throw "undefined array iterator creation";
            }
            var index = -1;

            return {
                next: function(){
                    return index + 1 < array.length ? array[++index] : undefined;
                },
                back: function(){
                    if(index < 0){
                        throw "going to far back";
                    }
                    index--;
                },
                hasNext: function(){
                    return index + 1 < array.length;
                }
            }
        },
        createCountryFlag: function (document, val) {
            var img = document.createElement("img");
            if (Common161.isNotBlank(val)) {
                img.src = "../resources/famfamfam/flags/" + val + ".png";
            } else {
                img.src = "../resources/famfamfam/silk/help.png";
            }
            return img;
        },
        createLanguageFlag: function (document, val) {
            if (Common161.isNotBlank(val)) {
                var img = document.createElement("img");
                var uval = val.toUpperCase();
                if ("PL" === uval) {
                    img.src = "../resources/famfamfam/flags/pl.png";
                    img.alt = "Polish";
                } else if ("EN" === uval) {
                    img.src = "../resources/famfamfam/flags/gb.png";
                    img.alt = "English";
                } else {
                    img.src = "../resources/famfamfam/silk/error.png";
                    img.alt = "Unknown language: " + uval;
                    img.className = "clickable";
                    img.onclick = function () {
                        alert(this.alt);
                    };
                }
                return img;
            } else {
                return document.createTextNode("-");
            }
        },
        createYesNo: function (document, val) {
            var img = document.createElement("img");
            if (val) {
                img.src = "../resources/famfamfam/silk/tick.png";
            } else {
                img.src = "../resources/famfamfam/silk/cross.png";
            }
            return img;
        },
        csv: function (csv, rowMapper) {
            var rows = csv.split(/\r\n|\n/);
            var list = [];
            for (var i = 1; i < rows.length; i++) {
                if (Common161.isNotBlank(rows[i])) {
                    list.push(rowMapper(rows[i].split(/,/)));
                }
            }
            return list;
        },
        link: function(document, link, text) {
            if(link){
                var a = document.createElement('a');
                a.appendChild(document.createTextNode(text));
                a.href = link;
                return a;
            } else {
                return document.createTextNode("");
            }
        },
        from: function(array){
            var joiners = [];
            var filters = [];// tutaj moga byc puste
            
            return {
                join : function(joiner, filter){
                    joiners.push(joiner);
                    filters.push(filter);
                    return this;
                },
                select : function(projector){
                    var projected = [];
                    if(joiners.length === 0){
                        return array.map(projector);
                    }
                    var joinersIt = Common161.iterator(joiners);
                    var currentArrayIt = Common161.iterator(array);
                    var arrayItStack = [];
                    var currentObjStack = [];
                    
                    while(currentArrayIt.hasNext()){
                        var currentObj = currentArrayIt.next();
                        currentObjStack.push(currentObj);
                        var joined = joinersIt.next()(currentObj);
                        if(joinersIt.hasNext()){// go down if these are not leaves
                            arrayItStack.push(currentArrayIt);
                            currentArrayIt = Common161.iterator(joined);
                        } else {// project leaves
                            for(var leaf of joined){
                                currentObjStack.push(leaf);
                                projected.push(projector.apply(null, currentObjStack));
                                currentObjStack.pop();
                            }
                            joinersIt.back();
                        }
                        if(!currentArrayIt.hasNext() && arrayItStack.length > 0){// go up if the current node is finished and not root
                            joinersIt.back();
                            currentArrayIt = arrayItStack.pop();
                            currentObjStack.pop();
                        }
                    }
                    return projected;
                },
                order : function() {
                    // co tu zrobic?
                }
            }   
        },        
        enhancedTable: function (document, tableId, model) {
            var table = document.getElementById(tableId);
            return {
                addRow: function (id) {
                    var row = table.insertRow();
                    row.id = tableId + "-" + id;
                    return {
                        node: function (node) {
                            row.insertCell().appendChild(node);
                            return this;
                        },
                        blank: function () {
                            return this.node(document.createTextNode(""));
                        },
                        text: function (text) {
                            return this.node(document.createTextNode(text ? text : ""));
                        },
                        link: function (link, text) {
                            if (link) {
                                var a = Common161.link(document, link, text);
                                return this.node(a);
                            } else {
                                return this.blank();
                            }
                        },
                        alertImg: function (text, imgSrc) {
                            if (text) {
                                var img = document.createElement("img");
                                img.src = imgSrc;
                                img.alt = text;
                                img.className = "clickable";
                                img.onclick = function () {
                                    alert(this.alt);
                                };
                                return this.node(img);
                            } else {
                                return this.blank();
                            }
                        },
                        info: function (text) {
                            return this.alertImg(text, "../resources/famfamfam/silk/information.png");
                        },
                        yesNo: function(bool){
                            return this.node(Common161.createYesNo(document, bool));
                        },
                        languageFlag: function(lang) {
                            return this.node(Common161.createLanguageFlag(document, lang));
                        },
                        custom: function(renderer) {
							return this.node(renderer(document));
                        }
                    }
                },
                filter: function(val, filter) {
                    // TODO
                }
            }
        }
    }
})();