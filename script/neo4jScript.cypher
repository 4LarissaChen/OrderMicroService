:begin

MATCH (arch:Architecture) -[:INCLUDEARTIFACT]- (asset:AssetArtifact) --> (lom:LOMView) -[*]-> (loc:Location) REMOVE loc:Location SET loc:OMLocation  RETURN count(loc);

MATCH (arch:Architecture) -[:INCLUDEARTIFACT]- (asset:AssetArtifact) --> (pom:POMView) -[*]-> (loc:Location) REMOVE loc:Location SET loc:OMLocation  RETURN count(loc);

// scripts for orphan elements
// 1. create element node and add relationships between arch and element

MATCH (arch:Architecture) MERGE (arch)-[:INCLUDEELEMENT]->(:Element {_id:'element_' + arch._id});

// 2. add relationships between element and reused elements 
//(Actor, DU, LogicalComponent, LogicalNode, OMLocation, PhysicalComponent, PhysicalNode, TargetSystem)

MATCH (element:Element)<--(arch:Architecture)-->(:AssetArtifact)-[rels *1..]->(actorNode:Actor) WITH DISTINCT actorNode, element MERGE (element)-[:CONTAINACTOR]->(actorNode);

MATCH (element:Element)<--(arch:Architecture)-->(:AssetArtifact)-[rels *1..]->(duNode:DU) WITH DISTINCT duNode, element MERGE (element)-[:CONTAINDU]->(duNode);

MATCH (element:Element)<--(arch:Architecture)-->(:AssetArtifact)-[rels *1..]->(lcNode:LogicalComponent) WITH DISTINCT lcNode, element MERGE (element)-[:CONTAINLC]->(lcNode);

MATCH (element:Element)<--(arch:Architecture)-->(:AssetArtifact)-[rels *1..]->(lnNode:LogicalNode) WITH DISTINCT lnNode, element MERGE (element)-[:CONTAINLN]->(lnNode);

MATCH (element:Element)<--(arch:Architecture)-->(:AssetArtifact)-[rels *1..]->(llNode:OMLocation) WITH DISTINCT llNode, element MERGE (element)-[:CONTAINLL]->(llNode);

MATCH (element:Element)<--(arch:Architecture)-->(:AssetArtifact)-[rels *1..]->(pcNode:PhysicalComponent) WITH DISTINCT pcNode, element MERGE (element)-[:CONTAINPC]->(pcNode);

MATCH (element:Element)<--(arch:Architecture)-->(:AssetArtifact)-[rels *1..]->(pnNode:PhysicalNode) WITH DISTINCT pnNode, element MERGE (element)-[:CONTAINPN]->(pnNode);

MATCH (element:Element)<--(arch:Architecture)-->(:AssetArtifact)-[rels *1..]->(tsNode:TargetSystem) WITH DISTINCT tsNode, element MERGE (element)-[:CONTAINTS]->(tsNode);

MATCH p = (pom:POMView)-[ref]->(lom:LOMView) DELETE ref RETURN COUNT(p);

MATCH (n:OMLocation)-[:MXGRAPH]->(m:UI) SET m.style = "shape=corner;whiteSpace=wrap;html=1;fillColor=none;container=1;align=center;verticalAlign=top;strokeWidth=4;strokeColor=#CCCCCC;fillColor=none;dx=450;dy=300;" RETURN COUNT(n);

MATCH (:Architecture)-->(:AssetArtifact)-->(n)-->(loc:OMLocation)-[*]->(m) WHERE labels(n)[0] IN ["LOMView", "POMView"] AND labels(m)[0] IN ["Actor", "LogicalNode", "PhysicalNode"] WITH * MATCH (n)-[rel]->(m) DELETE rel RETURN COUNT(rel);

MATCH (:Architecture)-->(:AssetArtifact)-->(n)-[rel]->(m) WHERE labels(n)[0] IN ["LOMView", "POMView"] AND labels(m)[0] IN ["DU", "LogicalComponent", "PhysicalComponent"] DELETE rel RETURN COUNT(rel);

MATCH (:Architecture)-->(:AssetArtifact)-->(ins:POMView)-[*]->(pn:PhysicalNode)-->(ln:LogicalNode)-[ref:MXGRAPH]->(ui:UI) WHERE ref.instanceId = ins._id AND NOT EXISTS(ui.geo) AND NOT EXISTS(ui.style) SET ui.geo = "{\"x\":10,\"y\":38,\"width\":40,\"height\":110}" SET ui.style = "swimlane;fontStyle=0;childLayout=stackLayout;horizontal=1;startSize=26;fillColor=none;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;swimlaneFillColor=#ffffff;" RETURN COUNT(ui);

MATCH (n)-[ref:MXGRAPH]->(ui:UI) WHERE NOT EXISTS(ref.instanceId) DETACH DELETE ui RETURN COUNT(ui);

MATCH (ts:TargetSystem)<-[:CONTAINTS]-(ele:Element) OPTIONAL MATCH (ts)-->(ui:UI) WITH *, CASE WHEN ui IS NULL THEN ts ELSE null END AS del DETACH DELETE del

:commit
exit