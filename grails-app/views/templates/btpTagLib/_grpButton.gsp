<%@ page contentType="text/html;charset=UTF-8" %>
<div class="form-group">
    <label>Selected ${name}: <em>{{testCreator.triggerGrp('${id}')}}</em></label>
    <button style="${style}" type="button" class="btn btn-block ${addClass}" ng-click="testCreator.loadList2('${id}', '${name}')">{{testCreator.triggerGrp('${id}', true)}} ${name}</button>
</div>