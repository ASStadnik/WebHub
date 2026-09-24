from sqlalchemy import Column, Integer, String, ForeignKey, DateTime

from .database import DbBase
from datetime import datetime


class User(DbBase):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    login = Column(String(50), unique=True, nullable=False)
    passHash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="USER")

class Category(DbBase):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), unique=True, nullable=False)

class Ticket(DbBase):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    userId = Column(Integer, ForeignKey("users.id"), nullable=False)
    categoryId = Column(Integer, ForeignKey("categories.id"), nullable=False)
    title = Column(String(100), nullable=False)
    text = Column(String(500), nullable=False)
    status = Column(String(20), nullable=False, default="NEW")
    priority = Column(String(20), nullable=False, default="NORMAL")
    createdAt = Column(DateTime, default=datetime.now, nullable=False)

class Comment(DbBase):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    ticketId = Column(Integer, ForeignKey("tickets.id"), nullable=False)
    userId = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(String(500), nullable=False)
    createdAt = Column(DateTime, default=datetime.now, nullable=False)