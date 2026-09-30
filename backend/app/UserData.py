from pydantic import BaseModel


class UserReg(BaseModel):
    name: str
    login: str
    userPass: str

class UserLog(BaseModel):
    login: str
    userPass: str

class PassChange(BaseModel):
    oldPass: str
    newPass: str