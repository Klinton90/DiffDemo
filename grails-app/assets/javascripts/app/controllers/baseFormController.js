//= require app/app.js
//= require difflib.js
//= require diffview.js
//= require_self

angular.module('diffdemo').controller('baseFormController', ['$scope', '$http', 'resUtil', function($scope, $http, resUtil) {
    var $ctrl = this;
    $ctrl.incEntities = {};
    $ctrl.entMapping = {};
    
    this.getEntName = function(formName){
        return this.entMapping[formName] || formName;
    };

    this.getEntList = function(name, force, params, cb){
        if(params == null){
            params = {};
        }
        var entName = this.getEntName(name);
        if(resUtil[entName] == null){
            console.log("Resource '" + entName + "' doesn't exist");
            return;
        }
        var listName = entName+"List";
        if(force == true || !$scope.hasOwnProperty(listName)){
            $scope[listName] = {};
            var res = resUtil[entName].query(params, function(){
                $scope[listName] = res;
                if(cb != null){
                    cb(res);
                }
            });
        }else{
            if(cb != null){
                cb($scope[listName]);
            }
        }
    };

    this.findIndex = function(hash, needle, prop){
        if(!angular.isString(prop)){
            prop = 'id';
        }
        var result = -1;
        if(hash != null){
            for(var i = 0; i < hash.length; i++){
                if(hash[i] != null && hash[i][prop] === needle[prop]){
                    result = i;
                    break;
                }
            }
        }
        
        return result;
    };

    this.replaceInList = function(hash, needle, prop){
        if(hash == null){
            hash = [];
        }
        var idx = $ctrl.findIndex(hash, needle, prop);
        var _needle = angular.copy(needle);
        if(idx >= 0){
            hash[idx] = _needle;
        }else{
            hash.push(_needle);
        }
        return hash;
    };

    this.removeFromList = function(hash, needle, prop){
        var ind = $ctrl.findIndex(hash, needle, prop);
        if(ind >= 0){
            hash.splice(ind, 1);
        }
    };

    this.getSaveName = function(id){
        return id == -1 ? "Create" : "Update" ;
    };

    this.formSanityCheck = function(formNames){
        var ictrl = this;
        if(angular.isString(formNames)){
            formNames = [formNames];
        }
        var proceed = true;
        var dirtyForms = [];
        for(var i = 0; i < formNames.length; i++){
            var formName = ictrl.getEntName(formNames[i]);
            if(!(formName == "" || ($scope["form_"+formName] != null && !$scope["form_"+formName].$dirty))){
                dirtyForms.push(formName);
            }
        }

        if(dirtyForms.length > 0){
            proceed = confirm('Data has been changed. If you proceed, data will be lost. Please confirm.');
            if(proceed){
                angular.forEach(dirtyForms, function(formName){
                    $scope["form_"+formName].$setPristine();
                });
            }
        }

        if(proceed){
            angular.forEach(formNames, function(formName){
                $ctrl.clearFormErrors(formName);
            });
        }

        return proceed;
    };

    this.recalcDirtyForm = function(formName){
        var dirty = false;
        var keys = Object.keys($scope["form_"+this.getEntName(formName)]);
        for(var i = 0; i < keys.length; i++){
            var key = keys[i];
            if(key.indexOf(formName) == 0 && $scope["form_"+this.getEntName(formName)][key].$dirty){
                dirty = true;
                break;
            }
        }
        if(!dirty){
            $scope["form_"+this.getEntName(formName)].$setPristine();
        }
        return dirty;
    };

    this.clearFormErrors = function(formName){
        if(formName != null && formName.length > 0){
            angular.forEach($scope, function(val, key){
                if(key.indexOf(formName) >= 0 && key.indexOf("Err") >= 0){
                    $scope[key] = "";
                }
            });
        }
    };

    this.saveForm = function(formName, formModel, adForms, successCb, errorCb, partial){
        var ictrl = this;
        formName = ictrl.getEntName(formName);
        
        var action;
        if(formModel.id == -1 || formModel.id == null){
            delete formModel.id;
            action = "save";
        }else{
            action = "update";
        }
        
        if(angular.isArray(adForms)){
            angular.forEach(adForms, function(adFormName){
                $ctrl.clearFormErrors(ictrl.getEntName(adFormName));
            });
        }
        $ctrl.clearFormErrors(formName);
        $scope.adErrors = "";
        delete $scope.htmlError;
        
        resUtil[formName][action]({}, formModel,
            function(response){
                if(!partial){
                    $scope["form_"+formName].$setPristine();
                }
                if(successCb != null){
                    successCb(response);
                }
            },
            function(response){
                if(response.data.errors != null){
                    angular.forEach(response.data.errors, function(error){
                        var fieldParts = error.field.split(".");
                        var cnt = fieldParts.length;
                        if(cnt == 1){
                            $scope[formName+"_"+error.field+"Err"] = error.message;
                        }else{
                            var subFormName = fieldParts[cnt - 2];
                            if(subFormName.substr(-3, 1) == "[" && subFormName.substr(-1) == "]"){
                                subFormName = subFormName.substr(0, subFormName.length - 3);
                            }
                            if(angular.isArray(adForms) && adForms.indexOf(ictrl.getEntName(subFormName)) >= 0){
                                $scope[subFormName+"_"+fieldParts[cnt - 1]+"Err"] = error.message;
                            }else{
                                $scope.adErrors += error.message;
                            }
                        }
                    });
                }else{
                    $scope.htmlError = response.data;
                }
                if(errorCb != null){
                    errorCb(response.data);
                }
            }
        );
    };

    this.afterSaveForm = function(formName, response){
        var that = this;
        angular.forEach(this.incEntities[formName], function(form){
            if(form.source != null && $scope[form.source].name != "" && $scope[form.source].model != null && form.name == $scope[form.source].name){
                if(form.type == "single"){
                    if($scope[form.source].model.id == -1){
                        $scope[form.source] = {name: "", model: {}};
                    }else{
                        that.refreshList($scope[form.source], response[$scope[form.source].name]);
                        $scope["form_" + that.getEntName($scope[form.source].name)].$setPristine();
                    }
                }else{
                    $scope["form_" + that.getEntName($scope[form.source].name)].$setPristine();
                }
                that.afterSaveForm(form.name, response[form.name]);
            }
        });
    };
    
    this.prepareDependentForms = function(requiredStruct, dependentForms){
        var that = this;
        var result = [];
        dependentForms = angular.isArray(dependentForms) ? dependentForms : [];
        if(requiredStruct != null && dependentForms.indexOf(requiredStruct.name) == -1){
            dependentForms.push(requiredStruct.name);
        }
        angular.forEach(dependentForms, function(formName){
            if(formName.length > 0){
                result.push(that.getEntName(formName));
            }
        });
        
        return result;
    };

    this.saveSingleForm = function(force, struct, parentStruct, dependentForms, success){
        var that = this;
        var data = angular.copy(struct.model);
        that.updateInternalEnt(struct.name, data);

        var _dependentForms = that.prepareDependentForms(parentStruct, dependentForms);

        that.saveForm(struct.name, data, _dependentForms, function(response){
            that.afterSaveForm(struct.name, response);
            that.refreshList(struct, response);

            if(parentStruct != null){
                if(force && parentStruct.model[struct.name] != null && parentStruct.model[struct.name].id != struct.model.id){
                    var subData = {id: parentStruct.model.id};
                    subData[struct.name] = {id: struct.model.id};
                    that.saveForm(parentStruct.name, subData, [], function(subResponse){
                        that.afterSingleFormSave(force, struct, parentStruct, _dependentForms, response);
                    }, null, true);
                }else{
                    that.afterSingleFormSave(force, struct, parentStruct, _dependentForms, response);
                }
            }
            
            if(success != null){
                success(response);
            }
        });
    };

    this.afterSingleFormSave = function(force, struct, parentStruct, dependentForms, response){
        var that = this;
        var curModel = parentStruct.model[struct.name];
        if(curModel != null && (force || curModel.id == struct.model.id)){
            $scope["form_"+that.getEntName(parentStruct.name)][parentStruct.name+"_"+struct.name].$setPristine();
            that.recalcDirtyForm(parentStruct.name);
        }
        //if(force || curModel == null || curModel.id == struct.model.id){
        if(force || (curModel != null && curModel.id == struct.model.id)){
            parentStruct.model[struct.name] = angular.copy(response);
        }
        if(force){
            angular.forEach(dependentForms, function(formName){
                if(formName.length > 0){
                    that.getEntList(formName, true, {new: true, mType: "nameId"});
                }
            });
        }
    };

    this.updateInternalEnt = function(formName, tmpEnt){
        var that = this;
        var includes = that.incEntities[formName];
        if(includes != null && includes.length > 0){
            angular.forEach(includes, function(form){
                if(form.source != null && $scope[form.source] != null) {
                    if (form.type == "multiple") {
                        if (form.name == $scope[form.source].name) {
                            that.replaceInList(tmpEnt[form.name], $scope[form.source].model);
                            if ($scope[form.source].model.id != -1) {
                                that.updateInternalEnt(form.name, tmpEnt[form.name]);
                            }
                        }
                        angular.forEach(tmpEnt[form.name], function (item) {
                            delete item[formName];
                        });
                    } else {
                        if (form.name == $scope[form.source].name) {
                            if ($scope[form.source].model.id == -1) {
                                tmpEnt[form.name] = {id: 0};
                                $scope[form.source] = {name: "", model: {}};
                                $scope["form_"+that.getEntName(form.name)].$setPristine();
                            } else {
                                tmpEnt[form.name] = angular.copy($scope[form.source].model);
                                that.updateInternalEnt(form.name, tmpEnt[form.name]);
                            }
                        } else if ($scope[form.name + "Tmp"] != null) {
                            if (tmpEnt[form.name] == null || tmpEnt[form.name].id != $scope[form.name + "Tmp"].id) {
                                if ($scope[form.name + "Tmp"].id == null || $scope[form.name + "Tmp"].id == -1) {
                                    tmpEnt[form.name] = {id: 0};
                                } else {
                                    tmpEnt[form.name] = angular.copy($scope[form.name + "Tmp"]);
                                }
                            }
                        } else {
                            tmpEnt[form.name] = {id: 0};
                        }
                    }
                }
            });
        }
    };

    this.canReloadSingleForm = function(model, name, changed, struct, parentStruct, dependentForms){
        var that = this;
        var result = true;
        var formName = name.substring(parentStruct.name.length + 1);

        var _dependentForms = that.prepareDependentForms(struct, dependentForms);
        
        if((changed && formName == struct.name) || (!changed && formName != struct.name)){
            result = that.formSanityCheck(_dependentForms);
        }
        return result;
    };

    this.loadSingleForm = function(model, name, changed, struct, parentStruct, success){
        var that = this;
        var formName = name.substring(parentStruct.name.length + 1);
        var curModel = $scope[formName+'Tmp'];
        
        if(changed || (curModel != null && curModel.id > 0 && formName != struct.name) /*|| Object.keys(model).length > 0*/){
            if(changed){
                $scope["form_"+that.getEntName(parentStruct.name)][name].$setDirty();
            }

            struct.name = formName;
            if(model.id > 0){
                resUtil[that.getEntName(formName)].get({id: model.id, mType: "deep"}, function(response){
                    struct.model = response;
                    angular.forEach(that.incEntities[formName], function(form){
                        if(form.type == "single"){
                            $scope[form.name+'Tmp'] = angular.copy(struct.model[form.name]);
                        }
                    });
                });
            }else{
                struct.model = angular.copy(model);
                angular.forEach(that.incEntities[formName], function(form){
                    $scope[form.name+"Tmp"] = {};
                });
            }
            angular.forEach(that.incEntities[formName], function(form){
                if(form.type == "single"){
                    that.getEntList(form.name, false, {new: form.source != null, mType: "nameId"});
                }
            });

            if(success != null){
                success();
            }
        }
    };

    this.refreshList = function(formStruct, response){
        this.replaceInList($scope[this.getEntName(formStruct.name)+"List"], response);
        $scope[formStruct.name+'Tmp'] = angular.copy(response);
        formStruct.model = response;
    };

    this.loadMultiForm = function(model, name, tmpModel, struct, dependentForms, success){
        var that = this;
        var _dependentForms = that.prepareDependentForms(struct, dependentForms);
        
        if(model != null && model.id != null) {
            struct.name = name;
            if ($ctrl.formSanityCheck(_dependentForms)) {
                struct.model = model;

                if(success != null){
                    success();
                }
            } else {
                tmpModel = [struct.model];
            }
        }
    };

    this.newMultiItem = function(name, tmpModel, struct, dependentForms, namingField, success){
        var that = this;
        var _dependentForms = that.prepareDependentForms(struct, dependentForms);
        
        if($ctrl.formSanityCheck(_dependentForms)){
            var item = {
                id: -1,
                value: ''
            };
            if(namingField == null){
                namingField = "name";
            }
            item[namingField] = "-- New --";
            struct.model = item;
            struct.name = name;
            tmpModel[0] = {};

            $ctrl.clearFormErrors(name);

            if(success != null){
                success();
            }
        }
    };

    this.submitMultiForm = function(tmpModel, struct, parentStruct, success){
        var tmp = angular.copy(struct.model);
        tmp[parentStruct.name] = {id: parentStruct.model.id};

        $ctrl.saveForm(struct.name, tmp, [], function(response){
            var tmp = $ctrl.replaceInList(parentStruct.model[struct.name], response);
            parentStruct.model[struct.name] = null;
            parentStruct.model[struct.name] = tmp;
            tmpModel = [angular.copy(response)];
            struct.model = response;
            $scope[parentStruct.name+"Tmp"] = angular.copy(parentStruct.model);

            if(success != null){
                success();
            }
        });
    };

    this.deleteMultiForm = function(struct, parentStruct, success){
        resUtil[struct.name].delete({id: struct.model.id}, function(){
            $ctrl.removeFromList(parentStruct.model[struct.name], struct.model);
            $scope["form_"+$ctrl.getEntName(struct.name)].$setPristine();
            struct.name = "";
            struct.model = {};
            $scope[parentStruct.name+"Tmp"] = angular.copy(parentStruct.model);

            if(success != null){
                success();
            }
        },
        function(response){
            if(response.data.errors != null){
                angular.forEach(response.data.errors, function(error){
                    $scope.adErrors += error.message;
                });
            }else{
                $scope.htmlError = response;
            }
        });
    };

    this.getDiffOutput = function(res1, res2, name1, name2){
        res1 = res1 ? res1 : "";
        res2 = res2 ? res2 : "";
        var data1 = difflib.stringAsLines(res1);
        var data2 = difflib.stringAsLines(res2);

        var sm = new difflib.SequenceMatcher(data1, data2);
        var opcodes = sm.get_opcodes();

        return diffview.buildView({
            baseTextLines: data1,
            newTextLines: data2,
            opcodes: opcodes,
            // set the display titles for each resource
            baseTextName: name1 != null ? name1 : "Value 1",
            newTextName: name2 != null ? name2 : "Value 2",
            viewType: 0
        });
    };
}]);
