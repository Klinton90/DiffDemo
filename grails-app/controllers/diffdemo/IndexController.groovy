package diffdemo

import grails.converters.JSON
import groovy.json.JsonSlurper
import groovy.util.logging.Slf4j

@Slf4j
class IndexController {

    HashMap<String, Object> viewModel = ["title":"Silly_Diff Demo App"];

    static responseFormats = ['json'];

    XmlDiffService xmlDiffService

    def index(){
        return viewModel;
    }

    def _ajaxAction(){
        render viewModel as JSON;
    }

    def testXml(){
        HashMap<String, Object> viewModel = new HashMap<String, String> ();

        Map<String, Object> params = request.JSON;

        if(params.xml1.toString().size() > 0 && params.xml2.toString().size() > 0){
            try{
                viewModel['result'] = xmlDiffService.testXml(params);
            }catch(CustomException e){
                log.info(e.getMessage());
                viewModel['errors'] = e.getMessage();
                response.status = 404;
            }
        }else{
            viewModel['errors'] = "XML1 and XML2 parameters are required!";
            response.status = 404;
        }

        render viewModel as JSON;
    }

    protected List _getAllItems() {
        JsonSlurper js = new JsonSlurper();
        InputStream file = getClass().classLoader.getResourceAsStream('data/examples.json');
        def allItems = js.parseText(file.getText());

        return allItems.toList();
    }
    
    protected String _getXmlExample(int id, String type){
        return getClass().classLoader.getResourceAsStream("data/xml/${type}_${id}.xml").getText();
    }

    def list(){
        def allItems = _getAllItems();

        String mType = params.mType ?: "simple";
        JSON.use(mType, {
            respond(allItems);
        });
    }

    def show(){
        int id = Integer.parseInt(params.id.toString());
        def allItems = _getAllItems();
        def item = allItems.find{_item->
            return _item["id"] == id;
        };
        
        item["xml1"] = _getXmlExample(id, "xml1");
        item["xml2"] = _getXmlExample(id, "xml2");

        String mType = params.mType ?: "simple";
        JSON.use(mType, {
            respond(item);
        });
    }
}
