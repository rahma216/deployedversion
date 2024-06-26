sap.ui.define(["sap/ui/core/mvc/Controller","sap/f/library","sap/m/MessageToast","sap/ui/core/Fragment","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageBox"],function(e,t,o,i,n,s,a){"use strict";return e.extend("app.project1.controller.Fields",{onInit:function(){var e={Actions:[{key:0,type:"String"},{key:1,type:"Int32"},{key:1,type:"Int16"},{key:1,type:"UInt8"},{key:1,type:"Integer"},{key:0,type:"Double"},{key:1,type:"Decimal"},{key:1,type:"DateTime"},{key:1,type:"Date"},{key:1,type:"Integer"},{key:2,type:"Boolean"}]};var t={Annotations:[{key:0,name:"@readonly"},{key:1,name:"@mandatory"},{key:2,name:"@assert.unique"},{key:3,name:"@assert.integrity"},{key:3,name:"@assert.notNull"}]};var o=new sap.ui.model.json.JSONModel({showTable:false});var i={Type:[{key:0,type:"ManyToMany"},{key:1,type:"ManyToOne"},{key:2,type:"OneToOne"}]};var n=new sap.ui.model.json.JSONModel(i);this.getView().setModel(n,"AssociationType");this.getView().setModel(o,"viewModel");var n=new sap.ui.model.json.JSONModel(e);this.getView().setModel(n,"actions");var n=new sap.ui.model.json.JSONModel(t);this.getView().setModel(n,"annotations");var n=this.getView().getModel("selectedEntityModel");this.getView().setModel(n,"selectedEntityModel");this.oRouter=this.getOwnerComponent().getRouter();this.oRouter.getRoute("Details").attachPatternMatched(this._onFieldsMatched,this)},_onFieldsMatched:function(e){this.index=e.getParameter("arguments").index||"0";this.getView().bindElement({path:"/Entity/"+this.index,model:"mainModel"});var t=this.getOwnerComponent().getModel("associationModel");this.getView().setModel(t,"associationsModel");this.getView().byId("associationsTable").setModel(t);this.onFilterAssociations(this.index)},onEditToggleButtonPress:function(){var e=this.getView().byId("ObjectPageLayout"),t=e.getShowFooter();e.setShowFooter(!t)},onSupplierPress:function(){var e=this.getOwnerComponent().getModel("localModel");this.getOwnerComponent().getRouter().navTo("Association");e.setProperty("/layout","ThreeColumnsEndExpanded")},onCloneInputField:function(e){var t=e.getSource();var o=t.getParent();console.log(o.getMetadata());var i=this.getView().byId("fields");var n=i.clone();var s=this.getView().byId("parentvbox");s.addItem(n)},onCancelDialog:function(e){e.getSource().getParent().close()},onFilterAssociations:function(e){var t=this.getView().byId("associationsTable");var o=t.getBinding("items");if(e){var i=new sap.ui.model.Filter("entitySource_ID",sap.ui.model.FilterOperator.EQ,e);var n=new sap.ui.model.Filter("entityTarget_ID",sap.ui.model.FilterOperator.EQ,e);var s=new sap.ui.model.Filter({filters:[i,n],and:false});o.filter(s)}else{o.filter([])}},onFetchAssociations:function(){if(this.getView().byId("associationsTable").getVisible()==true){this.getView().byId("associationsTable").setVisible(false)}else{this.getView().byId("associationsTable").setVisible(true)}},onCreate2:function(){var e=this.byId("fldd").getText();var t=this.getView().getModel("mainModel");var o=t.sServiceUrl+"/Entity";console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbb",this.getView().byId("annotations").mProperties.selectedKeys);var i=this.getView().byId("annotations").mProperties.selectedKeys;var n=i.join(" ");console.log("a7la annotation",n);var s=this.byId("key").getValue();var a;if(s.toLowerCase()==="true"){a=true}else if(s.toLowerCase()==="false"){a=false}else{console.error("Invalid input. Cannot convert to boolean.")}if(t){console.log("Main model found");fetch(o).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(t=>{console.log("Data:",t);if(t&&t.value&&Array.isArray(t.value)){const r=t.value;const l=r.find(t=>t.ID===e);if(l){console.log("Entity with ID :",l);const e=l;console.log("aaaaa",e);const t=this.getView().byId("table1");const r=t.getBinding("items");const c=r.create({ID:this.byId("fieldid").getValue(),value:this.byId("field").getValue(),type:this.byId("idComboBoxSuccess").getValue(),fld:e,annotations:n,iskey:a});var o=this.getView(),i=[o.byId("fieldid"),o.byId("field"),o.byId("idComboBoxSuccess"),,o.byId("key")];i.forEach(e=>{e.setValue("")});var s=this.getView().byId("annotations");s.setSelectedKeys([])}else{console.log("Entity with ID "+e+" not found")}}else{console.error("Invalid data format:",t)}}).catch(e=>{console.error("Error:",e)})}else{console.error("Main model not found")}},onShowTablePress:function(){var e=this.getView().getModel("viewModel");var t=e.getProperty("/showTable");e.setProperty("/showTable",!t);var o=this.getView().getModel("mainModel");var i=o.sServiceUrl+"/Entity";var n=o.sServiceUrl+"/Field";if(o){console.log("Main model found");fetch(i).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(e=>{console.log("Entity Data:",e);const t=e.value;fetch(n).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(e=>{console.log("Fields:",e);const o=[];t.forEach(t=>{const i=e.value.filter(e=>e.fld_ID===t.ID);o.push({ID:t.ID,name:t.name,fields:i})});const i=this.getView();const n=new sap.ui.model.json.JSONModel;n.setData({entityData:o});i.setModel(n)}).catch(e=>{console.error("Error retrieving fields:",e)})}).catch(e=>{console.error("Error retrieving entities:",e)})}else{console.error("Main model not found")}},onUpdate:function(){var e=this.getView().byId("table1").getSelectedItem();if(e){var t=e.getBindingContext("mainModel");if(t){var i=this.getView().byId("iskey").getValue();var n=this.getView().byId("value").getValue();var s=this.getView().byId("idComboBoxupdate").getValue();var a=this.getView().byId("idComboBoxupdate").mProperties.selectedKeys;var r;if(i.toLowerCase()==="true"){r=true}else if(i.toLowerCase()==="false"){r=false}else{console.error("Invalid input. Cannot convert to boolean.")}t.setProperty("iskey",r);t.setProperty("value",n);t.setProperty("type",s);var l=this.getView().getModel("mainModel");l.submitBatch("yourGroupId").then(function(){o.show("Update successful")}).catch(function(e){o.show("Update failed: "+e.message)})}else{o.show("Invalid Field")}}else{o.show("Please select a row to update")}},onDelete:function(){var e=this.byId("table1").getSelectedItem();if(e){var t=e.getBindingContext("mainModel").getObject();e.getBindingContext("mainModel").delete("$auto").then(function(){o.show(t+" SuccessFully Deleted")}.bind(this),function(e){o.show("Deletion Error: ",e)})}else{o.show("Please Select a Row to Delete")}},onDeleteAssociation:function(e){var t=this.getView().getModel("mainModel");var i=this.byId("associationsTable");var n="ID";var s="f9010c85-e8fb-451d-8ebd-2fcb5e3df114";var a=t.bindList("/Association");var r=new sap.ui.model.Filter(n,sap.ui.model.FilterOperator.EQ,s);a.filter(r).requestContexts().then(function(e){if(e.length>0){e.forEach(function(e){e.delete().then(function(){sap.m.MessageToast.show("Association Successfully Deleted");t.submitBatch("yourGroupId").then(function(){o.show("Update successful")}).catch(function(e){o.show("Update failed: "+e.message)});this._onFieldsMatched();i.getBinding("items").refresh();this.getView().bindElement()}).catch(function(e){sap.m.MessageToast.show("Deletion Error: "+e.message)})})}else{sap.m.MessageToast.show("Associations with "+n+" equal to "+s+" not found.")}}).catch(function(e){sap.m.MessageToast.show("Error: "+e.message)})},onOpenAddDialog2:function(){this.getView().byId("OpenDialog2").open()},formatFieldsValue:function(e){if(Array.isArray(e)){return e.map(e=>e.value).join(", ")}else{return""}},Bindtable:function(){var e=this.getView();var t=e.getModel("mainModel");var o=t.sServiceUrl+"/Association";fetch(o).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(t=>{var o=new sap.ui.model.json.JSONModel;o.setData(t);e.setModel(o,"associationsModel");var i=e.byId("associationsTable");i.setModel(o);i.bindItems({path:"/value",template:new sap.m.ColumnListItem({cells:[new sap.m.ObjectIdentifier({title:"{entitySource_ID}"}),new sap.m.ObjectIdentifier({title:"{entityTarget_ID}"}),new sap.m.Text({text:"{type}"})]})})}).catch(e=>{console.error("Failed to fetch associations:",e)})},handleClose:function(){var e=this.getOwnerComponent().getModel("localModel");e.setProperty("/layout","OneColumn");this.getOwnerComponent().getRouter().navTo("Listview")},onCreate:function(){var e=this.getView().getModel("mainModel");var t=this.getView().byId("sourceInput").getValue();var o=this.getView().byId("targetInput").getValue();var i=this.getView().byId("associationtype").getValue();var n=e.sServiceUrl+"/Entity";var s=e.sServiceUrl+"/Association";var a={};var r={};if(e){fetch(n).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(n=>{const l=n.value;l.forEach(e=>{if(e.name==t){a=e}if(e.name==o){r=e}});if(a===r){var c=this.getView(),d=[c.byId("targetInput"),c.byId("associationtype")];d.forEach(e=>{e.setValue("")});this.showSameEntityConfirmationPopup()}else{fetch(s).then(e=>{if(!e.ok){throw new Error("Network response was not ok")}return e.json()}).then(t=>{const o=t.value;let n=false;o.forEach(e=>{console.log(e);if(e.entitySource_ID===a.ID&&e.entityTarget_ID===r.ID||e.entityTarget_ID===a&&e.entitySource_ID===r){n=true}});if(n){console.log("Association already exists between the entities.");c=[l.byId("targetInput"),l.byId("associationtype")];c.forEach(e=>{e.setValue("")})}else{console.log("No existing association found. Ready to create a new one.");var s=e.bindList("/Association");s.create({entitySource:a,entityTarget:r,type:i});var l=this.getView(),c=[l.byId("targetInput"),l.byId("associationtype")];c.forEach(e=>{e.setValue("")})}}).catch(e=>{console.error(e)})}}).catch(e=>{console.error("Error retrieving entities:",e)})}else{console.error("Model 'mainModel' is not defined or accessible in the view.")}},onSuggestionItemSelected:function(e){var t=e.getParameter("selectedItem");var o=t?t.getKey():"";this.byId("selectedKeyIndicator").setText(o)},onSuggestionItemSelected1:function(e){var t=e.getParameter("selectedItem");var o=t?t.getKey():"";this.byId("selectedKeyIndicator").setText(o)},onValueHelpRequest:function(e){var t=e.getSource();var o=e.getSource().getValue(),a=this.getView();if(!this._pValueHelpDialog){this._pValueHelpDialog=i.load({id:a.getId(),name:"app.project1.view.ValueHelpDialog",controller:this}).then(function(e){a.addDependent(e);return e})}this._pValueHelpDialog.then(function(e){e.getBinding("items").filter([new n("name",s.Contains,o)]);e.open(o)})},onValueHelpDialogSearch:function(e){var t=e.getParameter("value");var o=new n("name",s.Contains,t);e.getSource().getBinding("items").filter([o])},onValueHelpDialogClose:function(e){var t,o=e.getParameter("selectedItem");e.getSource().getBinding("items").filter([]);if(!o){return}t=o.getDescription();this.byId("sourceInput").setValue(t)},onValueHelpRequest1:function(e){var t=e.getSource().getValue(),o=this.getView();if(!this._pValueHelpDialog1){this._pValueHelpDialog1=i.load({id:o.getId(),name:"app.project1.view.ValueHelp",controller:this}).then(function(e){o.addDependent(e);return e})}this._pValueHelpDialog1.then(function(e){e.getBinding("items").filter([new n("name",s.Contains,t)]);e.open(t)})},onValueHelpDialogSearch1:function(e){var t=e.getParameter("value");var o=new n("name",s.Contains,t);e.getSource().getBinding("items").filter([o])},onValueHelpDialogClose1:function(e){var t,o=e.getParameter("selectedItem");e.getSource().getBinding("items").filter([]);if(!o){return}t=o.getDescription();this.byId("targetInput").setValue(t)},showSameEntityConfirmationPopup:function(){var e=this;var t=sap.m.MessageBox.show("You have selected the same entity for both the source and target entities. Please select different entities",{icon:sap.m.MessageBox.Icon.WARNING,title:"Confirmation",actions:[sap.m.MessageBox.Action.OK],onClose:function(e){if(e===sap.m.MessageBox.Action.OK){}}});t.getBeginButton().setEnabled(false)}})});