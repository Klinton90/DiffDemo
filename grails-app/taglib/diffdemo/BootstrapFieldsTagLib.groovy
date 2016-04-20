package diffdemo

import groovy.util.logging.Slf4j;

@Slf4j
class BootstrapFieldsTagLib{
    /**
     * Renders Bootstrap TextField
     * @attr label field Label
     * @attr id REQUIRED field id
     * @attr value field value
     * @attr error error text
     * @attr angError angular error variable
     * @attr class additional CSS Classes
     * @attr ng-show
     * @attr style
     */
    def btpText = {attrs, body ->
        def model = [
            label: attrs.get('label', ''),
            value: attrs.get('value', ''),
            error: attrs.get('error', ''),
            angError: attrs.angError.asBoolean() instanceof Boolean ? attrs.angError.asBoolean() : false,
            id: attrs.get('id', ''),
            addClass: attrs.get('class', '').toString(),
            ngShow: attrs.get('ng-show', '').toString(),
            "ng-show": 'fake',
            style: attrs.get('style', '').toString()
        ];

        HashMap<String, String> addons = new HashMap<String, String>();
        attrs.each{String key, val->
            if(!model.containsKey(key)){
                addons[key] = val.toString();
            }
        };
        model['addons'] = addons;

        out << body() << render(
            template: "/templates/btpTagLib/text",
            model: model
        );
    }

    /**
     * Renders Bootstrap TextArea
     * @attr label field Label
     * @attr id REQUIRED field id
     * @attr value field value
     * @attr error error text
     * @attr angError angular error variable
     * @attr class additional CSS Classes
     * @attr ng-show
     * @attr style
     */
    def btpTextArea = {attrs, body ->
        def model = [
            label: attrs.get('label', ''),
            value: attrs.get('value', ''),
            error: attrs.get('error', ''),
            angError: attrs.angError.asBoolean() instanceof Boolean ? attrs.angError.asBoolean() : false,
            id: attrs.get('id', ''),
            addClass: attrs.get('class', '').toString(),
            ngShow: attrs.get('ng-show', '').toString(),
            "ng-show": 'fake',
            style: attrs.get('style', '').toString()
        ];

        HashMap<String, String> addons = new HashMap<String, String>();
        attrs.each{String key, val->
            if(!model.containsKey(key)){
                addons[key] = val.toString();
            }
        };
        model['addons'] = addons;

        out << body() << render(
            template: "/templates/btpTagLib/textArea",
            model: model
        );
    }

    /**
     * Renders Bootstrap CheckBox
     * @attr label field Label
     * @attr id REQUIRED field id
     * @attr inline isFormInline
     * @attr style
     */
    def btpCheckbox = {attrs, body ->
        def model = [
            label: attrs.get('label', ''),
            id: attrs.get('id', ''),
            inline: attrs.inline.asBoolean() instanceof Boolean ? attrs.inline.asBoolean() : false,
            addClass: attrs.get('class', '').toString(),
            style: attrs.get('style', '').toString()
        ];

        HashMap<String, String> addons = new HashMap<String, String>();
        attrs.each{String key, val->
            if(!model.containsKey(key)){
                addons[key] = val.toString();
            }
        };
        model['addons'] = addons;

        out << body() << render(
            template: "/templates/btpTagLib/checkbox",
            model: model
        );
    }

    /**
     * Renders Bootstrap SelectBox
     * @attr label field Label
     * @attr id REQUIRED field id
     * @attr class additional CSS Classes
     * @attr value field value
     * @attr multiple {@code true} to render select as MultiSelect
     * @attr withFilter @{code true} to render additional text field
     * @attr optionsMapping to change fields for Options rendering
     *
     * @attr error error text
     * @attr angError angular error variable
     *
     * @attr options map of options with [id, name] keys
     * @attr optionsArray list of options
     *
     * @attr angularOptionsArray list of angular Options
     * @attr angularOptions map of angular Options
     * 
     * @attr ng-show
     * @attr style
     */
    def btpSelectBox = {attrs, body ->
        def optionsMapping = attrs.optionsMapping instanceof HashMap ? attrs.optionsMapping : new HashMap();
        def options = attrs.optionsMapping instanceof ArrayList<HashMap> ? attrs.optionsMapping : new ArrayList<HashMap>();

        if(optionsMapping.containsKey('orderBy') && options.size() > 0 && options[0].containsKey(optionsMapping.containsKey('orderBy'))){
            options.sort{a, b ->
                return a[optionsMapping.orderBy] <=> b[optionsMapping.orderBy];
            };
        }

        def model = [
            label: attrs.get('label', '').toString(),
            id: attrs.get('id', '').toString(),
            addClass: attrs.get('class', '').toString(),
            value: attrs.get('value', '').toString(),
            multiple: attrs.multiple.asBoolean() instanceof Boolean ? attrs.multiple.asBoolean() : false,
            withFilter: attrs.withFilter.asBoolean() instanceof Boolean ? attrs.withFilter.asBoolean() : false,
            optionsMapping : optionsMapping,

            error: attrs.get('error', ''),
            angError: attrs.angError.asBoolean() instanceof Boolean ? attrs.angError.asBoolean() : false,

            angularOptionsArray: attrs.get('angularOptionsArray', ''),
            angularOptions : attrs.get('angularOptions', ''),

            optionsArray : attrs.optionsArray instanceof ArrayList ? attrs.optionsArray : new ArrayList(),
            options : options,
            ngShow: attrs.get('ng-show', '').toString(),
            "ng-show": 'fake',
            style: attrs.get('style', '').toString()
        ];

        HashMap<String, String> addons = new HashMap<String, String>();
        attrs.each{String key, val->
            if(!model.containsKey(key)){
                addons[key] = val.toString();
            }
        };
        model['addons'] = addons;

        out << body() << render(
            template: "/templates/btpTagLib/selectBox",
            model: model
        );
    }

    /**
     * Renders Button for Grouping
     * @attr id REQUIRED field id
     * @attr name REQUIRED field name
     * @attr class additional CSS Classes
     * @attr style
     */
    def btpGrpButton = {attrs, body ->
        out << body() << render(template: "/templates/btpTagLib/grpButton", model: [
            name: attrs.get('name', ''),
            id  : attrs.get('id', ''),
            addClass: attrs.get('class', '').toString(),
            style: attrs.get('style', '').toString()
        ]);
    }
    
    /**
     * Renders Label with glyphicon with onHover tooltip
     * @attr label REQUIRED label
     * @attr for Label "for" attribute
     * @attr preToolip Text of toolip for icon BEFORE label text
     * @attr preTooltipIcon glyphClass for icon BEFORE label text
     * @attr postToolip Text of toolip for icon AFTER label text
     * @attr postTooltipIcon glyphClass for icon AFTER label text
     * @attr class Classes to add
     * @attr style
     */
    def btpLabelWithTooltip = {attrs, body ->
        out << body() << render(template: "/templates/btpTagLib/labelWithTooltip", model:[
            label: attrs.get('label', ''),
            forId: attrs.get('forId', ''),
            preTooltip: attrs.get('preTooltip', ''),
            preTooltipIcon: attrs.get('preTooltipIcon', ''),
            postTooltip: attrs.get('postTooltip', ''),
            postTooltipIcon: attrs.get('postTooltipIcon', ''),
            addClass: attrs.get('class', '').toString(),
            style: attrs.get('style', '').toString()
        ]);
    }
}
