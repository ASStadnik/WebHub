from .database import dbSess
from .models import Category


cats = [
    "Программное обеспечение",
    "Оборудование",
    "Сеть и интернет",
    "Учётные записи",
    "Прочее",
    "Пожелания"
]

sess = dbSess()

for cat in cats:
    oldCat = sess.query(Category).filter(Category.name == cat).first()

    if oldCat is None:
        newCat = Category(name=cat)
        sess.add(newCat)

sess.commit()
sess.close()