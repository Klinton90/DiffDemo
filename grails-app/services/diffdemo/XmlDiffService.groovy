package diffdemo

import com.silly_diff.Helpers.DbDiffHelper
import com.silly_diff.Helpers.XmlDiffHelper
import com.silly_diff.Infostructure.AbstractDiffHelper
import com.silly_diff.Util.XmlUtil
import groovy.json.JsonSlurper
import groovy.util.logging.Slf4j
import groovy.util.slurpersupport.NodeChild

@Slf4j
class XmlDiffService {

    public HashMap<String, Object> testXml(Map<String, Object> params){
        XmlSlurper xs = new XmlSlurper();
        HashMap<String, Object> result = [
            passed: false,
            out1: "",
            out2: "",
            prep1: "",
            prep2: ""
        ];

        NodeChild xml1;
        try{
            xml1 = xs.parseText(params.xml1.toString());
        }catch(Exception e){
            throw new CustomException("XML input 1 is malformed. Please verify your inputs. Original message: '${e.getMessage()}'.");
        }

        NodeChild xml2;
        try{
            xml2 = xs.parseText(params.xml2.toString());
        }catch(Exception e){
            throw new CustomException("XML input 2 is malformed. Please verify your inputs. Original message: '${e.getMessage()}'.");
        }

        List<NodeChild> tst1 = XmlUtil.walkXmlByPath(params.xmlPath.toString(), xml1);
        List<NodeChild> tst2 = XmlUtil.walkXmlByPath(params.xmlPath.toString(), xml2);

        XmlDiffHelper diffHelper = new XmlDiffHelper(tst1, tst2);
        diffHelper.setupFromConfig(_prepareXmlDiffConfig(params));
        diffHelper.calcDiff();

        result.passed = diffHelper.isSimilar();
        result.prep1 = AbstractDiffHelper.getOutputListAsString(tst1);
        result.prep2 = AbstractDiffHelper.getOutputListAsString(tst2);
        result.out1 = AbstractDiffHelper.getOutputListAsString(diffHelper.outputList1);
        result.out2 = AbstractDiffHelper.getOutputListAsString(diffHelper.outputList2);

        return result;
    }

    protected Map<String, Object> _prepareXmlDiffConfig(Map<String, Object> params){
        HashMap<String, String> invs = new HashMap<String, String>();
        ArrayList<String> ias = new ArrayList<String>();
        ArrayList<String> ins = new ArrayList<String>();

        String ignoredElements = params.ignoredElements.toString();
        if(ignoredElements.size() > 0){
            ignoredElements.split(",").each{String _ie->
                String ie = _ie.trim();
                if(ie.contains("=")){
                    String[] inv = ie.split("=").collect{it.trim()};
                    if(inv.size() == 2){
                        invs.put(inv[0], inv[1]);
                    }
                }else if(ie.contains("@")){
                    ias.add(ie);
                }else{
                    ins.add(ie);
                }
            };

        }

        return [
            orderlySafeMode: params.orderlySafeMode,
            needleHelper: params.needleHelper.toString().size() > 0 ? params.needleHelper.toString().split(",") : new ArrayList<String>(),
            showErrors: false,
            orderlySafeChildrenMode: params.orderlySafeChildrenMode,
            "ignoreNodesWValues": invs,
            "ignoreAttrs": ias,
            "ignoreNodes": ins,
        ];
    }
}
