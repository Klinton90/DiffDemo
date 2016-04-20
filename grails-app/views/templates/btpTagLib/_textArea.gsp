<%@ page contentType="text/html;charset=UTF-8" %>
<div id="${id}Grp" name="${id}Grp" class="form-group" ${angError ? "ng-class="+"{true:'has-error',false:''}[${id}Err!=null&&${id}Err.length>0]" : ""}
    <% if(ngShow != null && ngShow.size() > 0){%>
    ng-show="${ngShow}"
    <% } %>
>
    <% if(label.size() > 0){ %>
        <label for="${id}">${label}</label>
    <% } %>
    <textarea type="text" class="form-control ${addClass}" style="resize: vertical; ${style}" id="${id}"
        <% addons.each{String key, String val-> %>
            ${key}="${val}"
        <% } %>
        <% if(name == null){ %>
            name="${id}"
        <% } %>
    >
        ${value}
    </textarea>
    <span id="${id}Validation" name="${id}Validation" class="help-block">
        ${error}
        ${angError ? "{{"+id+"Err}}" : ""}
    </span>
</div>