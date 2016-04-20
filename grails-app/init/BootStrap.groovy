import diffdemo.NameIdMarshaller
import grails.converters.JSON
import grails.util.Holders
import org.grails.web.converters.marshaller.json.DomainClassMarshaller

class BootStrap {
    def init = { servletContext ->
        JSON.createNamedConfig("simple"){
            it.registerObjectMarshaller(new DomainClassMarshaller(false, Holders.getGrailsApplication()));
        }
        JSON.createNamedConfig("nameId"){
            it.registerObjectMarshaller(new NameIdMarshaller());
        }
    }
}
