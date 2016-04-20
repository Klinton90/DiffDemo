package diffdemo

import grails.converters.JSON
import org.grails.core.util.IncludeExcludeSupport
import org.grails.web.converters.exceptions.ConverterException
import org.grails.web.converters.marshaller.IncludeExcludePropertyMarshaller
import org.grails.web.json.JSONWriter

public class NameIdMarshaller extends IncludeExcludePropertyMarshaller<JSON> {

    public boolean supports(Object object) {
        return object instanceof GroovyObject;
    }

    public void marshalObject(Object o, JSON json) throws ConverterException {
        JSONWriter writer = json.getWriter();


        Class<? extends Object> clazz = o.getClass();
        List<String> excludes = json.getExcludes(clazz);
        List<String> includes = json.getIncludes(clazz);
        IncludeExcludeSupport<String> includeExcludeSupport = new IncludeExcludeSupport<String>();
        try {
            writer.object();
            writer.key("id");
            json.convertAnother(o.id);
            writer.key("name");
            json.convertAnother(o.name);
            writer.endObject();
        }
        catch (ConverterException ce) {
            throw ce;
        }
        catch (Exception e) {
            throw new ConverterException("Error converting Bean with class " + clazz.getName(), e);
        }
    }

    private boolean shouldInclude(IncludeExcludeSupport<String> includeExcludeSupport, List<String> includes, List<String> excludes, Object o, String name) {
        return includeExcludeSupport.shouldInclude(includes,excludes, name) && shouldInclude(o,name);
    }

}
