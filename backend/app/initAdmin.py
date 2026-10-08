import bcrypt

from .database import dbSess
from .models import User


sess = dbSess()

admin = sess.query(User).filter(
    User.login == "admin"
).first()

if admin is None:
    passHash = bcrypt.hashpw(
        "12345".encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    admin = User(
        name="Администратор",
        login="admin",
        passHash=passHash,
        role="ADMIN"
    )

    sess.add(admin)
    sess.commit()

    print("Администратор создан")
else:
    print("Администратор уже существует")

sess.close()