<%@ page contentType="text/html;charset=UTF-8" %>
<% if(!inline){ %>
    <div class="checkbox">
<% } %>
<label id="${id}Grp" name="${id}Grp"
    <% if(inline){ %>
        class="checkbox-inline"
    <% } %>
>
    <input style="${style}" type="checkbox" id="${id}"
        <% addons.each{String key, String val-> %>
            ${key}="${val}"
        <% } %>
        <% if(name == null){ %>
            name="${id}"
        <% } %>
    >
    ${label}
</label>
<% if(!inline){ %>
    </div>
<% } %>