from pydantic import BaseModel


class CommentAdd(BaseModel):
    text: str