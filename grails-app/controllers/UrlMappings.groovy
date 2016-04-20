class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                controller inList: [
                    "index"
                ]
            }
        }

        "/examples"(resources:"example")

        "/$action?"(controller: "index")

        "500"(view:"/error")
        "404"(view:"/notFound")
    }
}
