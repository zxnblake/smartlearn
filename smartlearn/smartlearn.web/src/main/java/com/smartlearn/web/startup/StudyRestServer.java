package com.smartlearn.web.startup;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class StudyRestServer {
    private static Logger logger = LoggerFactory.getLogger(StudyRestServer.class);

    @Value("${gremlin.server.url}")
    private String gremlinServerUrl;

    private HttpServletRequest request;

    @Autowired
    public StudyRestServer(HttpServletRequest request) {
        this.request = request;
    }

    /******************************************************************************
     Namespace api
     ******************************************************************************/
    @PostMapping(value = "/namespace/create")
     public String createNamespace(@RequestBody String body) {
//        JSONObject object = JSON.parseObject(body);
//        String space = putNs2Request(object.getString("namespace")).trim();
//        String type = object.getString("storeType");
//        String cluster = object.getString("cluster").trim();
//        String connList = object.getString("connections").trim();
//        ESStoreConn storeConn = new ESStoreConn(cluster, connList);
//        String description = object.getString("description");
//        String creator = GraphUserContext.getGraphUserContext().getPin().trim();
//        String manager = object.getString("manager").trim();
//        if (checkNsIsExists(space)) {
//            GraphRestResult restResult = new GraphRestResult();
//            restResult.setCode(140);
//            restResult.setMessage(String.format("Namespace [%s] is already existed!", space));
//            return restResult.toString();
//        }
//        Namespace namespace = systemGraphManager.createNamespace(space, type, storeConn, description, creator, null);
//        systemGraphManager.addNsUser(space, NsUserRole.Admin.toString(), manager);
//        if (namespace == null) {
//            throw new GraphException("namespace create failed, namespace:" + space);
//        }
//        return GraphRestResult.make(namespace).toString();
        return null;
    }

    @GetMapping(value = "/namespace/list")
    public String listNamespace(@RequestParam(value = "userId") String userId,
                                @RequestParam(value = "namespace") String namespace) {
//        List<Object> keys = new ArrayList<>();
//        List<Namespace> namespaces = new ArrayList<>();
//        List<ExecutionResult.SpaceTable> spaceTables = new ArrayList<>();
//        if (userId != null && GraphUserContext.getGraphUserContext().getPin().equals(userId)) {
//            namespaces = getNsList(userId, namespace.trim());
//        }
//
//        for (Namespace space : namespaces) {
//            ExecutionResult.SpaceTable spaceTable = ExecutionResult.copy(space);
//            List<User> manager = systemGraphManager.getNamespaceDataManager().getUserIdByNs(space.getName().trim());
//            spaceTable.setManager(manager);
//            spaceTables.add(spaceTable);
//        }
//        keys = ExecutionResult.copy(namespaces);
//        return GraphRestResult.createGraphRestResult(keys);
        return null;
    }
}
