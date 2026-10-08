
import bcrypt
import jwt
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from .database import dbSess
from .models import User, Ticket, Category
from .TicketData import TicketAdd, TicketStatus, TicketPriority
from .UserData import UserReg, UserLog, PassChange
from datetime import datetime, timedelta, timezone
from .config import sett
app = FastAPI(
    title="WebHub API"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
#get

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

security = HTTPBearer()

def checkToken(auth: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = auth.credentials

        data = jwt.decode(
            token,
            sett.jwtKey,
            algorithms=["HS256"]
        )

        return data

    except:
        raise HTTPException(
            status_code=401,
            detail="Неверный токен"
        )


def checkAdmin(userData = Depends(checkToken)):
    if userData["role"] != "ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Нет доступа"
        )

    return userData

#Админские запросы
@app.get("/api/admin/test")
def adminTest(userData = Depends(checkAdmin)):
    return {
        "message": "Доступ администратора разрешён"
    }

@app.get("/api/admin/tickets")
def getAdminTickets(userData = Depends(checkAdmin)):
    sess = dbSess()

    tickets = sess.query(Ticket).order_by(
        Ticket.createdAt.desc()
    ).all()

    result = []

    for ticket in tickets:
        user = sess.query(User).filter(
            User.id == ticket.userId
        ).first()

        category = sess.query(Category).filter(
            Category.id == ticket.categoryId
        ).first()

        result.append({
            "id": ticket.id,
            "userId": ticket.userId,
            "userName": user.name,
            "userLogin": user.login,
            "categoryId": ticket.categoryId,
            "category": category.name,
            "title": ticket.title,
            "text": ticket.text,
            "status": ticket.status,
            "priority": ticket.priority,
            "createdAt": ticket.createdAt
        })

    sess.close()

    return result

@app.patch("/api/admin/tickets/{ticketId}/status")
def changeTicketStatus(
    ticketId: int,
    data: TicketStatus,
    userData = Depends(checkAdmin)
):
    if data.status not in ["NEW", "IN_PROGRESS", "DONE"]:
        raise HTTPException(
            status_code=400,
            detail="Неверный статус"
        )

    sess = dbSess()

    ticket = sess.query(Ticket).filter(
        Ticket.id == ticketId
    ).first()

    if ticket is None:
        sess.close()
        raise HTTPException(
            status_code=404,
            detail="Заявка не найдена"
        )

    ticket.status = data.status

    sess.commit()
    sess.close()

    return {
        "message": "Статус изменён"
    }

@app.patch("/api/admin/tickets/{ticketId}/priority")
def changeTicketPriority(
    ticketId: int,
    data: TicketPriority,
    userData = Depends(checkAdmin)
):
    if data.priority not in ["LOW", "NORMAL", "HIGH"]:
        raise HTTPException(
            status_code=400,
            detail="Неверный приоритет"
        )

    sess = dbSess()

    ticket = sess.query(Ticket).filter(
        Ticket.id == ticketId
    ).first()

    if ticket is None:
        sess.close()
        raise HTTPException(
            status_code=404,
            detail="Заявка не найдена"
        )

    ticket.priority = data.priority

    sess.commit()
    sess.close()

    return {
        "message": "Приоритет изменён"
    }

@app.post("/api/admin/users")
def addUser(data: UserReg, userData = Depends(checkAdmin)):
    sess = dbSess()

    oldUser = sess.query(User).filter(
        User.login == data.login
    ).first()

    if oldUser is not None:
        sess.close()
        raise HTTPException(
            status_code=400,
            detail="Такой логин уже существует"
        )

    passHash = bcrypt.hashpw(
        data.userPass.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    user = User(
        name=data.name,
        login=data.login,
        passHash=passHash,
        role="USER"
    )

    sess.add(user)
    sess.commit()
    sess.close()

    return {
        "message": "Пользователь создан"
    }


@app.get("/api/admin/users")
def getAdminUsers(userData = Depends(checkAdmin)):
    sess = dbSess()

    users = sess.query(User).order_by(
        User.id
    ).all()

    result = []

    for user in users:
        result.append({
            "id": user.id,
            "name": user.name,
            "login": user.login,
            "role": user.role
        })

    sess.close()

    return result

@app.delete("/api/tickets/{ticketId}")
def deleteTicket(ticketId: int, userData = Depends(checkToken)):
    sess = dbSess()

    ticket = sess.query(Ticket).filter(
        Ticket.id == ticketId,
        Ticket.userId == userData["id"]
    ).first()

    if ticket is None:
        sess.close()
        raise HTTPException(
            status_code=404,
            detail="Заявка не найдена"
        )

    if ticket.status != "NEW":
        sess.close()
        raise HTTPException(
            status_code=400,
            detail="Можно удалить только новую заявку"
        )

    sess.delete(ticket)
    sess.commit()
    sess.close()

    return {
        "message": "Заявка удалена"
    }

@app.patch("/api/password")
def changePass(data: PassChange, userData = Depends(checkToken)):
    sess = dbSess()

    user = sess.query(User).filter(
        User.id == userData["id"]
    ).first()

    if user is None:
        sess.close()
        raise HTTPException(
            status_code=404,
            detail="Пользователь не найден"
        )

    oldOk = bcrypt.checkpw(
        data.oldPass.encode("utf-8"),
        user.passHash.encode("utf-8")
    )

    if not oldOk:
        sess.close()
        raise HTTPException(
            status_code=400,
            detail="Старый пароль неверный"
        )

    newHash = bcrypt.hashpw(
        data.newPass.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    user.passHash = newHash

    sess.commit()
    sess.close()

    return {
        "message": "Пароль изменён"
    }

@app.get("/api/me")
def getMe(data = Depends(checkToken)):
    return {
        "id": data["id"],
        "login": data["login"],
        "role": data["role"]
    }

#Категории список
@app.get("/api/categories")
def getCategories():
    sess = dbSess()
    cats = sess.query(Category).order_by(Category.id).all()
    data = []
    for cat in cats:
        data.append({
            "id": cat.id,
            "name": cat.name
        })
    sess.close()
    return data

#Вывод заявок пользователя
@app.get("/api/tickets")
def getTickets(userData = Depends(checkToken)):
    sess = dbSess()

    tickets = sess.query(Ticket).filter(
        Ticket.userId == userData["id"]
    ).order_by(Ticket.createdAt.desc()).all()

    data = []

    for ticket in tickets:
        cat = sess.query(Category).filter(
            Category.id == ticket.categoryId
        ).first()

        data.append({
            "id": ticket.id,
            "categoryId": ticket.categoryId,
            "category": cat.name,
            "title": ticket.title,
            "text": ticket.text,
            "status": ticket.status,
            "priority": ticket.priority,
            "createdAt": ticket.createdAt
        })

    sess.close()

    return data


#Вход пользователя
@app.post("/api/login")
def logUser(data: UserLog):
    sess = dbSess()

    user = sess.query(User).filter(User.login == data.login).first()

    if user is None:
        sess.close()
        raise HTTPException(
            status_code=401,
            detail="Неверный логин или пароль"
        )

    checkPass = bcrypt.checkpw(
        data.userPass.encode("utf-8"),
        user.passHash.encode("utf-8")
    )

    if not checkPass:
        sess.close()
        raise HTTPException(
            status_code=401,
            detail="Неверный логин или пароль"
        )

    userData = {
        "id": user.id,
        "name": user.name,
        "login": user.login,
        "role": user.role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=2)
    }
    tokenData = {
        "id": user.id,
        "login": user.login,
        "role": user.role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=2)
    }

    token = jwt.encode(
        tokenData,
        sett.jwtKey,
        algorithm="HS256"
    )

    sess.close()

    return {
        "message": "Вход выполнен",
        "token": token,
        "user": userData
    }



#Создание заявки
@app.post("/api/tickets")
def addTicket(data: TicketAdd, userData = Depends(checkToken)):
    sess = dbSess()

    cat = sess.query(Category).filter(Category.id == data.categoryId).first()

    if cat is None:
        sess.close()
        raise HTTPException(
            status_code=400,
            detail="Категория не найдена"
        )

    newTicket = Ticket(
        userId=userData["id"],
        categoryId=data.categoryId,
        title=data.title,
        text=data.text,
        priority=data.priority,
        status="NEW"
    )

    sess.add(newTicket)
    sess.commit()
    sess.refresh(newTicket)

    ticketId = newTicket.id

    sess.close()

    return {
        "message": "Заявка создана",
        "id": ticketId
    }