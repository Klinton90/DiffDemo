<%@ page contentType="text/html;charset=UTF-8" %>
<div class="form-group" ${angError ? "ng-class="+"{true:'has-error',false:''}[${id}Err!=null&&${id}Err.length>0]" : ""}
    <% if(ngShow != null && ngShow.size() > 0){%>
    ng-show="${ngShow}"
    <% } %>
>
    <% if(label.size() > 0){ %>
        <label for="${id}">${label}</label>
    <% } %>
    <% if(withFilter){ %>
        <input type="text" class="form-control" id="${id}Filter" ng-model="${id}Filter" placeholder="Start typing ${label}…">
    <% } %>
    <select class="form-control ${addClass}" id="${id}" ${multiple == true ? "multiple" : ""} style="${style}"
            <% if(name == null){ %>
                name="${id}"
            <% } %>
            <% addons.each{String key, String val-> %>
                ${key}="${val}"
            <% } %>
            <% if(angularOptionsArray.size() > 0){ %>
                ng-options="option for option in ${angularOptionsArray}" value="{{option}}"
            <% }else if(angularOptions.size() > 0){ %>
                ng-options="option.${optionsMapping.get('name', 'name')} for option in ${angularOptions} | orderBy:'${optionsMapping.get('orderBy', optionsMapping.get('orderBy', optionsMapping.get('name', 'name')))}' ${optionsMapping.containsKey('filter') ? ' | ' + optionsMapping.filter.toString().replace('-filterName-', id.toString()+'Filter') : ''} track by option.${optionsMapping.get('id', 'id')}"
            <% } %>
    >
        <% if(optionsArray.size() > 0){ %>
            <% for(int i = 0; i < optionsArray.size(); i++){ %>
                <option value="${optionsArray[i]}">
                    ${optionsArray[i]}
                </option>
            <% } %>
        <% }else if(options.size() > 0){ %>
            <% for(int i = 0; i < options.size(); i++){ %>
                <option value="${options[i][optionsMapping.get('id', 'id')]}">
                    ${options[i][optionsMapping.get('name', 'name')]}
                </option>
            <% } %>
        <% } %>
    </select>
    <span id="${id}Validation" name="${id}Validation" class="help-block">
        ${error}
        ${angError ? "{{"+id+"Err}}" : ""}
    </span>
</div>