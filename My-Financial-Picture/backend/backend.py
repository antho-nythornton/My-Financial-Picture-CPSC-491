from fastapi import FastAPI
import mysql.connector
from mysql.connector import Error

app = FastAPI()

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="password",
            database="financial_db"
        )
        return connection
    except Error as e:
        print("Database connection failed: ", e)
        return None

@app.get("/")
def root():
    return {"message": "FastAPI server is running!"}


@app.get("/test")
def test_connection():
    connection_ = get_db_connection()
    if not connection_:
        return {"message": "Database connection failed"}
    
    cursor = connection_.cursor(dictionary=True)
    cursor.execute("SELECT * FROM your_table LIMIT 5")
    result = cursor.fetchall()
    cursor.close()
    connection_.close()
    return result
