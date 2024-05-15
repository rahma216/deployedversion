sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/dnd/DragInfo","sap/f/dnd/GridDropInfo","./../RevealGrid/RevealGrid","sap/ui/core/library","sap/ui/core/Fragment","sap/ui/model/json/JSONModel","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageBox","sap/ui/core/syncStyleClass","sap/m/MessageToast","sap/ui/core/dnd/DropInfo"],function(e,o,t,n,a,s,r,i,c,l,u,d,g){"use strict";var p=a.dnd.DropLayout;var h=a.dnd.DropPosition;return e.extend("app.pferahma1.controller.Association",{onInit:function(){this.test="";this.base=this.getOwnerComponent();var e=0;if(!this.base||!this.base.getEditFlow){console.error("Base or getEditFlow is undefined.")}this.initData();this.attachDragAndDrop()},initData:function(){var e=this.getOwnerComponent().getModel("mainModel");var o=new sap.ui.model.json.JSONModel;o.setData({id:"",name:""});this.byId("grid1").setModel(o);console.log(e);var t=e.sServiceUrl+"/Entity";if(e){console.log("Main model found");fetch(t).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(e=>{var o=new sap.ui.model.json.JSONModel;o.setData(e.value);console.log("patron",o);this.byId("list1").setModel(o);console.log("aaaaaaaaaa",o)}).catch(e=>{console.error("Error fetching data:",e)})}},onRevealGrid:function(){n.toggle("grid1",this.getView())},onExit:function(){n.destroy("grid1",this.getView())},attachDragAndDrop:function(){var e=this.byId("list1");e.addDragDropConfig(new o({sourceAggregation:"items"}));e.addDragDropConfig(new g({targetAggregation:"items",dropPosition:h.Between,dropLayout:p.Vertical,drop:this.onDrop.bind(this)}));var n=this.byId("grid1");n.addDragDropConfig(new o({sourceAggregation:"items"}));n.addDragDropConfig(new t({targetAggregation:"items",dropPosition:h.Between,dropLayout:p.Horizontal,dropIndicatorSize:this.onDropIndicatorSize.bind(this),drop:this.onDrop.bind(this)}))},onDropIndicatorSize:function(e){var o=e.getBindingContext();console.log("aaa",o);var t=o.getModel().getProperty(o.getPath());console.log("oData",t);if(e.isA("sap.m.StandardListItem")){if(t){return{rows:2,columns:3}}else{console.error("Rows and/or columns properties not found in the data object.")}}},onDrop:function(e){var o=e.getParameter("draggedControl");var t=e.getParameter("droppedControl");var n=e.getParameter("dropPosition");var a=o.getParent();var s=e.getSource().getParent();var r=a.getModel();var i=s.getModel();var c=r.getData();var l=i.getData();var u=a.indexOfItem(o);var d=s.indexOfItem(t);console.log("drag model",c);console.log("drop model",l);var g=c[u];c.splice(u,1);if(!Array.isArray(l)){l=[]}l.splice(d,0,g);if(r!==i){r.setData(c);i.setData(l)}else{i.setData(l)}this.byId("grid1").focusItem(d);var p=this.getView().byId("grid1");this.logGridContent(p)},logGridContent:function(e){this.table=[];var o=e.getItems();o.forEach(function(e){var o=e.getHeader().getTitle();this.table.push(o)}.bind(this))},generateService:function(){var e="service modelsService {\n";this.table.forEach(function(o){e+="\n\tentity "+o+" as projection on models."+o+";"});e+="\n}";console.log("Generated CDS Model:",e);this.onAppendServiceToFilePress(`using models from '../db/models.cds'; \n`+e);this.showCDSserviceGenerationPopup()},generateService2:function(e){var o="service modelsService {\n";var t=[e];if(this.table.length>0&&typeof e==="string"){t=t.concat(this.table.filter(o=>o.trim()!==e.trim()))}else{console.error("Either 'this.table' is empty or 'this.test' is not a string.")}console.log(this.table);console.log("taaaablaaa",t);t.forEach(function(e){o+="\n\tentity "+e+" as projection on models."+e+";"});o+="\n}";console.log("Generated CDS Model:",o);this.onAppendServiceToFilePress(`using models from '../db/models.cds'; \n`+o)},onOpenAddDialog:function(){this.getView().byId("OpenDialog").open()},onCancelDialog:function(e){e.getSource().getParent().close()},OnCdsgen:function(){var e=this.getView().getModel("mainModel");var o=e.sServiceUrl+"/Entity";var t=e.sServiceUrl+"/Field";var n=e.sServiceUrl+"/Association";if(e){console.log("Main model found");fetch(o).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(e=>{console.log("Entity Data:",e);const o=e.value;fetch(t).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(t=>{console.log("Fields:",t);const a=[];o.forEach(e=>{const o=t.value.filter(o=>o.fld_ID===e.ID);a.push({ID:e.ID,name:e.name,fields:o})});fetch(n).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(o=>{console.log("Associations:",o);const n=this.generateCDSEntities(e.value,t.value,o.value)}).catch(e=>{console.error("Error retrieving associations:",e)})}).catch(e=>{console.error("Error retrieving fields:",e)})}).catch(e=>{console.error("Error retrieving entities:",e)})}else{console.error("Main model not found")}this.showCDSmodelGenerationPopup()},generateCDSEntities:function(e,o,t){const n=[];for(const d of e){const g=d.name;const p=o.filter(e=>e.fld_ID===d.ID);let h=`entity ${g} {`;for(const e of p){if(e.annotations==null){let o=`\n\t${e.value}: ${e.type} `;if(e.iskey){o=`\n\tkey ${e.value}: ${e.type} `}h+=o+";"}else{let o=`\n\t${e.value}: ${e.type} ${e.annotations}`;if(e.iskey){o=`\n\tkey ${e.value}: ${e.type} ${e.annotations}`}h+=o+";"}}const f=t.filter(e=>e.entitySource_ID===d.ID||e.entityTarget_ID===d.ID);var a=false;for(const o of f){const t=o.type==="ManyToOne";const n=o.type==="OneToOne";const g=o.type==="ManyToMany";const p=o.entitySource_ID===d.ID;const f=o.entityTarget_ID===d.ID;if(t&&p){const t=e.find(e=>e.ID===o.entityTarget_ID);if(t){h+=`\n\tfld : Association to ${t.name};`}}if(t&&f){const t=e.find(e=>e.ID===o.entitySource_ID);if(t){const e=t.name.toLowerCase();h+=`\n\t${e} : Association to many ${t.name}`;h+=`\ton ${e}.fld = $self;`}}if(n&&p){const t=e.find(e=>e.ID===o.entityTarget_ID);if(t){var s=d.name.toLowerCase();h+=`\n\t${s}${t.name} : Association to ${t.name};`}}if(n&&f){const t=e.find(e=>e.ID===o.entitySource_ID);if(t){var s=t.name.toLowerCase();h+=`\n\t${s} : Association to ${t.name};`}}if(g&&p){a=true;const t=e.find(e=>e.ID===o.entityTarget_ID);var r=d.name.toLowerCase();var i=t.name.toLowerCase();var c=d.name;var l=t.name;var u=c+"2"+l;h+=`\n\t${i}s : Composition of many ${d.name}To${t.name} on ${i}s.${r}=$self;`}if(g&&f){const t=e.find(e=>e.ID===o.entitySource_ID);var r=t.name.toLowerCase();var i=d.name.toLowerCase();h+=`\n\t${r}s : Composition of many ${t.name}To${d.name} on ${r}s.${i}=$self;`}}if(a===true){h+=`\n}\n`;h+=`entity ${c}To${l} {\n      \n\tkey ${r} : Association to ${c};\n      \n\tkey ${i} : Association to ${l};\n      \n}\n`}else{h+=`\n}\n`}n.push(h)}this.onAppendTextToFilePress(` namespace models;\n      using { cuid, managed} from '@sap/cds/common';\n`+n.join(""));return n.join("")},UIgen:function(){var e=this.test;console.log("tttttttttttttttttttttttttttttttttt",e);var o=this.getView().getModel("mainModel");var t=o.sServiceUrl+"/Entity";var n=o.sServiceUrl+"/Field";if(o){console.log("Main model found");fetch(t).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(o=>{console.log("Entity Data:",o);const t=o.value;fetch(n).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(o=>{console.log("Fields:",o);t.forEach(t=>{if(e==t.name){const n=o.value.filter(e=>e.fld_ID===t.ID);let a=`annotate service.${e} with @(`;a+=`\n    UI.FieldGroup #GeneratedGroup : {`;a+=`\n        $Type : 'UI.FieldGroupType',`;a+=`\n        Data : [`;n.forEach(e=>{a+=`\n            {`;a+=`\n                $Type : 'UI.DataField',`;a+=`\n                Label : '${e.value}',`;a+=`\n                Value : ${e.value},`;a+=`\n            },`});a+=`\n        ],`;a+=`\n    },`;a+=`\n    UI.Facets : [`;a+=`\n        {`;a+=`\n            $Type : 'UI.ReferenceFacet',`;a+=`\n            ID : 'GeneratedFacet1',`;a+=`\n            Label : 'General Information',`;a+=`\n            Target : '@UI.FieldGroup#GeneratedGroup',`;a+=`\n        },`;a+=`\n    ],`;a+=`\n    UI.LineItem : [`;n.forEach(e=>{a+=`\n        {`;a+=`\n            $Type : 'UI.DataField',`;a+=`\n            Label : '${e.value}',`;a+=`\n            Value : ${e.value},`;a+=`\n        },`});a+=`\n    ],`;a+=`\n);`;console.log(a);this.onAppendUIToFilePress(`using modelsService as service from '../../srv/services';`+a)}})}).catch(e=>{console.error("Error retrieving fields:",e)})}).catch(e=>{console.error("Error retrieving entities:",e)})}else{console.error("Main model not found")}},onAppendTextToFilePress:function(e){fetch("/odata/v4/models/appendTextToFile",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:e})}).then(e=>e.json()).then(e=>{console.log("Action invoked successfully:",e)}).catch(e=>{console.error("Error invoking action:",e)})},onAppendServiceToFilePress:function(e){fetch("/odata/v4/models/appendServiceToFile",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:e})}).then(e=>e.json()).then(e=>{console.log("Action invoked successfully:",e)}).catch(e=>{console.error("Error invoking action:",e)})},onAppendUIToFilePress:function(e){var o="/home/user/projects/clientproject/app";var t=this.getView().byId("projectname").getValue().toLowerCase();var n=o+"/"+t+"/annotations.cds";console.log("aaaa",n);fetch("/odata/v4/models/appendUIToFile",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({content:e,path:n})}).then(e=>e.json()).then(e=>{console.log("Action invoked successfully:",e);console.log("aaaa",n)}).catch(e=>{console.error("Error invoking action:",e)})},showCDSmodelGenerationPopup:function(){var e=this;var o=sap.m.MessageBox.show("CDS model generated successfully",{icon:sap.m.MessageBox.Icon.WARNING,title:"Confirmation",actions:[sap.m.MessageBox.Action.OK],onClose:function(e){if(e===sap.m.MessageBox.Action.OK){}}});o.getBeginButton().setEnabled(false)},showCDSserviceGenerationPopup:function(){var e=this;var o=sap.m.MessageBox.show("service generated successfully",{icon:sap.m.MessageBox.Icon.WARNING,title:"Confirmation",actions:[sap.m.MessageBox.Action.OK],onClose:function(e){if(e===sap.m.MessageBox.Action.OK){}}});o.getBeginButton().setEnabled(false)},onOpenAddDialog:function(){var e=this.getView().getModel("mainModel");var o=this.getView().byId("mainDialog");o.open();var t=new sap.ui.model.json.JSONModel;console.log(this.table);var n=e.sServiceUrl+"/Entity";var a=e.sServiceUrl+"/Association";var s=[];if(e){fetch(n).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(e=>{const n=e.value;var r=[];this.table.forEach(e=>{var o=n.find(o=>o.name===e);if(o){r.push(o)}});console.log("table3",r);fetch(a).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(e=>{const n=e.value;n.forEach(e=>{r.forEach(o=>{console.log("Association ID:",e.entityTarget_ID);console.log("Entity ID:",o.ID);if(e.entityTarget_ID==o.ID&&e.type=="ManyToOne"){console.log("Match found. Adding association:",e.name);s.push(o.name)}})});console.log("table4",s);var a=s.map(function(e){return{name:e}});t.setData({Entity:a});console.log(t);o.setModel(t,"rahmaModel")}).catch(e=>{console.error("Error retrieving associations:",e)})}).catch(e=>{console.error("Error retrieving entities:",e)})}else{console.error("Model 'mainModel' is not defined or accessible in the view.")}},onSelectChange:function(e){var o=e.getParameter("selectedItem");if(o){var t=o.getText();this.test=t;this.generateService2(this.test);console.log("ttttttt0",this.test);console.log("Selected Text:",t)}else{console.log("No item selected.")}},onCancelDialog:function(e){this.getView().byId("mainDialog").close();var o=this.getView();var t=[o.byId("projectname"),o.byId("apptitle"),o.byId("namespace"),o.byId("appdesc")];t.forEach(e=>{e.setValue("")})},onOpenAddDialog1:function(){this.getView().byId("mainDialog1").open()},onCancelDialog1:function(e){this.getView().byId("mainDialog1").close()},onOpenAddDialog3:function(){this.getView().byId("mainDialog3").open()},onCancelDialog3:function(e){this.getView().byId("mainDialog3").close()},onExecuteCommandPress:function(e){var o=this.getView();var t=o.byId("projectname").getValue().toLowerCase();var n=o.byId("apptitle").getValue().toLowerCase();var a=o.byId("namespace").getValue().toLowerCase();var s=o.byId("appdesc").getValue().toLowerCase();var r="/home/user/projects/clientproject/yoListreport.sh "+t+" "+n+" "+a+" "+s;fetch("/odata/v4/models/ExecuteCommand",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({command:r})}).then(e=>{e.json();console.log("Action invoked successfully:uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");this.UIgen()}).catch(e=>{console.error("Error invoking action:",e)})},onExecuteCommandPressCustomPage:function(e){var o=this.getView();var t=o.byId("custompage").getValue().toLowerCase();var n=o.byId("customtitle").getValue().toLowerCase();var a=o.byId("customnamespace").getValue().toLowerCase();var s=o.byId("customappdesc").getValue().toLowerCase();var r="/home/user/projects/clientproject/customtemp.sh "+t+" "+n+" "+a+" "+s;var i=[o.byId("custompage"),o.byId("customtitle"),o.byId("customnamespace"),o.byId("customappdesc")];fetch("/odata/v4/models/ExecuteCommand",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({command:r})}).then(e=>{e.json();console.log("Action invoked successfully:uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");i.forEach(e=>{e.setValue("")})}).catch(e=>{console.error("Error invoking action:",e)})},onExecuteCommandPressBasicPage:function(e){var o=this.getView();var t=o.byId("viewname").getValue().toLowerCase();var n=o.byId("basicname").getValue().toLowerCase();var a=o.byId("basicapptitle").getValue().toLowerCase();var s=o.byId("basicnamespace").getValue().toLowerCase();var r=o.byId("basicappdesc").getValue().toLowerCase();var i="/home/user/projects/clientproject/basictemp.sh "+t+" "+n+" "+a+" "+s+" "+r;var c=[o.byId("viewname"),o.byId("basicname"),o.byId("basicapptitle"),o.byId("basicnamespace"),o.byId("basicappdesc")];fetch("/odata/v4/models/ExecuteCommand",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({command:i})}).then(e=>{e.json();console.log("Action invoked successfully:uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");this.UIgen()}).catch(e=>{console.error("Error invoking action:",e)})}})});