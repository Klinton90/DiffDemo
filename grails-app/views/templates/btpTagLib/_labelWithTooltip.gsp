<%@ page contentType="text/html;charset=UTF-8" %>
<label for="${forId}" class="${addClass}" style="${style}">
    <% if(preTooltip.size() > 0){ %>
    <span aria-hidden="true" class="glyphicon ${preTooltipIcon.size() > 0 ? preTooltipIcon : 'glyphicon-exclamation-sign'} warn-visible text-danger" data-toggle="tooltip" data-original-title="${preTooltip}"></span>
    <% } %>
    ${label}
    <% if(postTooltip.size() > 0){ %>
        <span aria-hidden="true" class="glyphicon ${postTooltipIcon.size() > 0 ? postTooltipIcon : 'glyphicon-exclamation-sign'} warn-visible text-danger" data-toggle="tooltip" data-original-title="${postTooltip}"></span>
    <% } %>
</label>