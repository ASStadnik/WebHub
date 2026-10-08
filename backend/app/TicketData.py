from pydantic import BaseModel


class TicketAdd(BaseModel):
    categoryId: int
    title: str
    text: str
    priority: str

class TicketStatus(BaseModel):
    status: str

class TicketPriority(BaseModel):
    priority: str