package diffdemo

import grails.converters.JSON
import groovy.util.logging.Slf4j
import org.grails.web.converters.marshaller.json.GroovyBeanMarshaller

@Slf4j
class BaseRestfulController<BRC> extends grails.rest.RestfulController<BRC> {

    public BaseRestfulController(Class<BRC> c) {
        super(c);
    }

    def index(Integer max){
        GroovyBeanMarshaller
        def resourceList = resource.findAllByIdGreaterThan(0);

        if(params.new != null && (params.new == true || params.new == "true")){
            def newResource = resource.newInstance();
            newResource.id = -1;
            newResource.name = "-- New --";
            resourceList.add(newResource);
        }

        String mType = params.mType ?: "simple";
        JSON.use(mType, {
            respond resourceList, model: [("${resourceName}Count".toString()): countResources()];
        });
    }

    def show(){
        String mType = params.mType ?: "simple";
        JSON.use(mType, {
            def res;
            if(mType == "deep"){
                res = resource.getFullTree(params.id as Integer);
            }else{
                res = queryForResource(params.id)
            }
            respond res;
        });
    }
}
