import pytest
import mysql.connector
from mysql.connector import errors

@pytest.fixture(scope="module")
def db():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="password",
        database="MY_FINANCIAL_PICTURE"
    )
    yield conn
    conn.close()

def test_tables_exist(db):
    cursor = db.cursor()
    cursor.execute("SHOW TABLES;")
    tables = {row[0] for row in cursor.fetchall()}
    expected = {
        "USERS","BUDGETS","TRANSACTIONSTL",
        "TRANSACTIONS","INSTITUTIONS","GOALSTL","GOALS"
    }
    assert expected.issubset(tables)

def test_users_columns(db):
    cursor = db.cursor()
    cursor.execute("SHOW COLUMNS FROM USERS;")
    cols = {row[0] for row in cursor.fetchall()}
    expected = {"ID","EMAIL","PASSWORD_HASH","CREATED_AT","LAST_LOGIN"}
    assert expected.issubset(cols)

def test_primary_key_constraint(db):
    cursor = db.cursor()
    cursor.execute("INSERT INTO USERS (ID,EMAIL) VALUES (1,a@test.com);")
    db.commit()
    with pytest.raises(errors.IntegrityError):
        cursor.execute("INSERT INTO USERS(ID,EMAIL) VALUES(1, 'dup@test.com');")
        db.commit()
def test_foreign_key_budget_user(db):
    cursor = db.cursor()
    cursor.execute("INSERT INTO USERS(ID, EMAIL) VALUES (2, 'b@test.com');")
    db.commit()
    cursor.execute("""  INSERT INTO BUDGETS (ID, USER_ID, CATEGORY_ID, LIMIT_AMOUNT, START_DATE, END_DATE, DESCRIPTION_)
                    VALUES (1,2,3,10,'1000','2025-01-01','2025-12-31', 'Groceries');
    """)
    db.commit()
    cursor.execute("SELECT * FROM BUDGETS WHERE ID=1;")
    assert cursor.fetchone() is not None
    with pytest.raises(errors.IntegrityError):
        cursor.execute("""
                        INSERT INTO BUDGETS (ID,USER_ID,CATEGORY_ID, LIMIT_AMOUNT, START_DATE, END_DATE, DESCRIPTION_)
                        VALUES(2,999,20,'500','2025-12-31','INVALID USER TEST');
                        """)
        db.commit()
def test_transaction_foreign_keys(db):
    cursor = db.cursor()
    cursor.execute("INSERT INTO TRANSACTIONTL (ID,ACCOUNT_ID,NAME_) VALUES (1,100, 'Category1');")
    db.commit()
    cursor.execute("""
                    INSERT INTO TRANSACTIONS (ID, ACCOUNT_ID, USER_ID, CATEGORY_ID, AMOUNT_, DESCRIPTION_, DATE_, TYPE_, IS_RECURRING_, CREATED_AT)
                    VALUES(1, 200, 2, 1, 500, 'Test Transaction', '2025-09-20', 'Debit','No','2025-09-20');
    """)
    db.commit()
    cursor.execute("SELECT * FROM TRANSACTIONS WHERE ID=1;")
    assert cursor.fetchone() is not None
    with pytest.raises(errors.IntegrityError):
        cursor.execute("""
                        INSERT INTO TRANSACTIONS (ID, ACCOUNT_ID, USER_ID, CATEGORY_ID, AMOUNT_)
                        VALUES (2, 300, 999, 1, 100);
        """)
        db.commit()
def test_goal_foreign_key(db):
    cursor = db.cursor()
    cursor.execute("""
                    INSERT INTO GOALS (ID,USER_ID,NAME_,TARGET_AMOUNT,DEADLINE)
                    VALUES(1,2,'Save For Car' , 2000, '2025-12-31');
                    """)
    db.commit()
    cursor.execute("SELECT * FROM GOALS WHERE ID=1;")
    assert cursor.fetchone() is not None 
    with pytest.raises(errors.IntegrityError):
        cursor.execute("""
                        INSERT INTO GOALS (ID,USER_ID,NAME_,TARGET_AMOUNT,DEADLINE)
                        VALUES(2,999,'Invalid Goal',1000,'2025-12-31'); 
                        """)
        db.commit()

