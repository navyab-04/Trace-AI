from typing import List, Optional
from pydantic import BaseModel

class GraphNode(BaseModel):
    id: str
    label: str
    type: str # Person, Organization, Project, Event, Publication, Product, Patent, Public Profile

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    relationship_type: str # WORKED_AT, PARTICIPATED_IN, AUTHORED, CREATED, CONTRIBUTED_TO, ASSOCIATED_WITH, PUBLISHED, ATTENDED
    confidence: float

class RelationshipGraphResponse(BaseModel):
    investigation_id: str
    nodes: List[GraphNode]
    edges: List[GraphEdge]
