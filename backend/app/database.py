from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from .config import sett


dbUrl = URL.create(
    drivername="mysql+pymysql",
    username=sett.dbUser,
    password=sett.dbPass,
    host=sett.dbHost,
    port=sett.dbPort,
    database=sett.dbName
)

dbEng = create_engine(dbUrl)

dbSess = sessionmaker(
    bind=dbEng,
    autoflush=False
)


class DbBase(DeclarativeBase):
    pass