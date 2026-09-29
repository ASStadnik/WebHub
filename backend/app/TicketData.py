from pydantic import BaseModel


class TicketAdd(BaseModel):
    categoryId: int
    title: str
    text: str
    priority: str