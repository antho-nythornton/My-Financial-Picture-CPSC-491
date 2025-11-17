from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, constr
from dotenv import load_dotenv
from passlib.context import CryptContext
import mysql.connector
from mysql.connector import errors
from datetime import datetime
import os
from pathlib import Path
from datetime import datetime, timezone, date, timedelta
from typing import Optional

load_dotenv(Path(__file__).with_name(".env"))

DB_CONFIG = dict(
    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT", "3306")),
    user=os.getenv("DB_USER"),                
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
)

def ts() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

def today_str() -> str:
    return date.today().strftime("%Y-%m-%d")

def month_bounds(d: date | None = None) -> tuple[str, str]:
    """Return (first_day_str, last_day_str) for current month."""
    d = d or date.today()
    first = d.replace(day=1)
    if d.month == 12:
        next_month_first = d.replace(year=d.year + 1, month=1, day=1)
    else:
        next_month_first = d.replace(month=d.month + 1, day=1)
    last = next_month_first - timedelta(days=1)
    return first.strftime("%Y-%m-%d"), last.strftime("%Y-%m-%d")

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

app = FastAPI()

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
extra_origins = (os.getenv("ALLOWED_ORIGINS") or "").strip()
if extra_origins:
    allowed_origins += [o.strip() for o in extra_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_conn():
    try:
        return mysql.connector.connect(**DB_CONFIG, connection_timeout=5)
    except mysql.connector.Error as e:
        print(f"[DB ERROR] Connection failed: {e}")
        return None

class RegisterRequest(BaseModel):
    email: EmailStr
    password: constr(min_length=8)
    first_name: constr(strip_whitespace=True, min_length=1)
    last_name: constr(strip_whitespace=True, min_length=1)
    phone: constr(strip_whitespace=True) | None = None  

class RegisterResponse(BaseModel):
    message: str
    user_id: int | None = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    
class LoginResponse(BaseModel):
    message: str
    user_id: int
    first_name: str | None = None
    last_name: str | None = None
    
class QuickStartBase(BaseModel):
    bank_name: Optional[str] = None
    checking_balance: Optional[float] = None
    savings_balance: Optional[float] = None
    monthly_income: Optional[float] = None
    monthly_budget: Optional[float] = None
    savings_goal: Optional[str] = None
    savings_goal_amount: Optional[float] = None
    currency: Optional[str] = "USD"

class QuickStartPayload(QuickStartBase):
    user_id: int

class QuickStartResult(BaseModel):
    message: str
    inserted_institutions: int = 0
    inserted_budgets: int = 0
    inserted_goals: int = 0

class NeedsQuickStartResponse(BaseModel):
    user_id: int
    needs_quickstart: bool
    counts: dict
    missing: dict[str, bool]

@app.get("/healthz")
def healthz():
    try:
        conn = get_db_conn()
        cur = conn.cursor()
        cur.execute("SELECT 1")
        cur.fetchone()
        return {"status": "ok"}
    except Exception:
        raise HTTPException(status_code=500, detail="DB not reachable")
    finally:
        try:
            cur.close(); conn.close()
        except Exception:
            pass

@app.post("/register", response_model=RegisterResponse)
def register(user: RegisterRequest):
    try:
        conn = get_db_conn()
        cur = conn.cursor(dictionary=True)

        # Check if email exists
        cur.execute("SELECT ID FROM USERS WHERE EMAIL=%s", (user.email,))
        if cur.fetchone():
            raise HTTPException(status_code=409, detail="Email already registered")

        hashed_pw = pwd_context.hash(user.password)

        cur.execute(
            """
            INSERT INTO USERS (EMAIL, PASSWORD_HASH, FIRST_NAME, LAST_NAME, CREATED_AT, LAST_LOGIN)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (user.email, hashed_pw, user.first_name, user.last_name, ts(), None),
        )
        conn.commit()
        return RegisterResponse(message="User registered successfully", user_id=cur.lastrowid)

    except errors.Error as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        try:
            cur.close(); conn.close()
        except Exception:
            pass

@app.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    try:
        conn = get_db_conn()
        cur = conn.cursor(dictionary=True)

        cur.execute("SELECT ID, PASSWORD_HASH, FIRST_NAME, LAST_NAME FROM USERS WHERE EMAIL=%s", (payload.email,))
        row = cur.fetchone()
        if not row or not pwd_context.verify(payload.password, row["PASSWORD_HASH"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        cur2 = conn.cursor()
        cur2.execute("UPDATE USERS SET LAST_LOGIN=%s WHERE ID=%s", (ts(), row["ID"]))
        conn.commit()
        cur2.close()

        return LoginResponse(
            message="Login successful",
            user_id=row["ID"],
            first_name=row.get("FIRST_NAME"),
            last_name=row.get("LAST_NAME"),
        )

    except errors.Error:
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        try:
            cur.close(); conn.close()
        except Exception:
            pass

@app.get("/users/{user_id}/needs-quickstart", response_model=NeedsQuickStartResponse)
def needs_quickstart(user_id: int):
    try:
        conn = get_db_conn()
        if conn is None:
            raise HTTPException(status_code=500, detail="DB not reachable")
        cur = conn.cursor(dictionary=True)

        counts = {}

        cur.execute("SELECT COUNT(*) AS c FROM INSTITUTIONS WHERE USER_V_ID=%s", (user_id,))
        counts["institutions"] = int(cur.fetchone()["c"])

        cur.execute("SELECT COUNT(*) AS c FROM BUDGETS WHERE USER_ID=%s", (user_id,))
        counts["budgets"] = int(cur.fetchone()["c"])

        cur.execute("SELECT COUNT(*) AS c FROM GOALS WHERE USER_ID=%s", (user_id,))
        counts["goals"] = int(cur.fetchone()["c"])

        missing = {
            "institutions": counts["institutions"] == 0,
            "budgets": counts["budgets"] == 0,
            "goals": counts["goals"] == 0,
        }
        needs = any(missing.values())

        return NeedsQuickStartResponse(
            user_id=user_id,
            needs_quickstart=needs,
            counts=counts,
            missing=missing,
        )
    except errors.Error:
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        try:
            cur.close(); conn.close()
        except Exception:
            pass

def quickstart_core(payload: QuickStartPayload) -> QuickStartResult:
    try:
        conn = get_db_conn()
        if conn is None:
            raise HTTPException(status_code=500, detail="DB not reachable")
        cur = conn.cursor()

        inserted_institutions = 0
        inserted_budgets = 0
        inserted_goals = 0

        def safe_int(x):
            if x is None or x == "":
                return None
            try:
                return int(round(float(x)))
            except Exception:
                return None

        checking_amt = safe_int(payload.checking_balance)
        savings_amt = safe_int(payload.savings_balance)
        currency = payload.currency or "USD"
        bank = (payload.bank_name or "").strip() or None

        if checking_amt is not None:
            cur.execute(
                "SELECT ID FROM INSTITUTIONS WHERE USER_V_ID=%s AND `TYPE`='checking' LIMIT 1",
                (payload.user_id,)
            )
            row = cur.fetchone()
            if row:
                cur.execute(
                    "UPDATE INSTITUTIONS SET NAME=%s, BALANCE=%s, CURRENCY=%s WHERE ID=%s",
                    (bank or "Bank", checking_amt, currency, row[0])
                )
            else:
                cur.execute(
                    """
                    INSERT INTO INSTITUTIONS (USER_V_ID, NAME, `TYPE`, BALANCE, CURRENCY, CREATED_AT)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """,
                    (payload.user_id, bank or "Bank", "checking", checking_amt, currency, today_str()),
                )
                inserted_institutions += 1

        if savings_amt is not None:
            cur.execute(
                "SELECT ID FROM INSTITUTIONS WHERE USER_V_ID=%s AND `TYPE`='savings' LIMIT 1",
                (payload.user_id,)
            )
            row = cur.fetchone()
            if row:
                cur.execute(
                    "UPDATE INSTITUTIONS SET NAME=%s, BALANCE=%s, CURRENCY=%s WHERE ID=%s",
                    (bank or "Bank", savings_amt, currency, row[0])
                )
            else:
                cur.execute(
                    """
                    INSERT INTO INSTITUTIONS (USER_V_ID, NAME, `TYPE`, BALANCE, CURRENCY, CREATED_AT)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """,
                    (payload.user_id, bank or "Bank", "savings", savings_amt, currency, today_str()),
                )
                inserted_institutions += 1

        budget_amt = safe_int(payload.monthly_budget)
        if budget_amt is not None:
            start_date, end_date = month_bounds()
            cur.execute(
                """
                SELECT ID FROM BUDGETS
                WHERE USER_ID=%s AND DESCRIPTION_='Monthly Budget (QuickStart)' AND START_DATE=%s
                LIMIT 1
                """,
                (payload.user_id, start_date),
            )
            row = cur.fetchone()
            if row:
                cur.execute(
                    "UPDATE BUDGETS SET LIMIT_AMOUNT=%s, END_DATE=%s WHERE ID=%s",
                    (str(budget_amt), end_date, row[0]),
                )
            else:
                cur.execute(
                    """
                    INSERT INTO BUDGETS (USER_ID, CATEGORY_ID, LIMIT_AMOUNT, START_DATE, END_DATE, DESCRIPTION_)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """,
                    (payload.user_id, 0, str(budget_amt), start_date, end_date, "Monthly Budget (QuickStart)"),
                )
                inserted_budgets += 1

        # GOALS: by name (idempotent per name)
        goal_amt  = safe_int(payload.savings_goal_amount)
        goal_name = (payload.savings_goal or "").strip()
        if goal_name and goal_amt is not None:
            cur.execute(
                "SELECT ID FROM GOALS WHERE USER_ID=%s AND NAME_=%s LIMIT 1",
                (payload.user_id, goal_name),
            )
            row = cur.fetchone()
            if row:
                cur.execute(
                    "UPDATE GOALS SET TARGET_AMOUNT=%s WHERE ID=%s",
                    (goal_amt, row[0]),
                )
            else:
                cur.execute(
                    """
                    INSERT INTO GOALS (USER_ID, NAME_, TARGET_AMOUNT, DEADLINE)
                    VALUES (%s, %s, %s, %s)
                    """,
                    (payload.user_id, goal_name, goal_amt, None),
                )
                inserted_goals += 1

        conn.commit()
        return QuickStartResult(
            message="QuickStart data saved",
            inserted_institutions=inserted_institutions,
            inserted_budgets=inserted_budgets,
            inserted_goals=inserted_goals,
        )
    except errors.Error:
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        try:
            cur.close(); conn.close()
        except Exception:
            pass

@app.post("/users/{user_id}/quickstart", response_model=QuickStartResult)
@app.post("/users/{user_id}/quickstart/", response_model=QuickStartResult)
def quickstart_for_user(user_id: int, body: QuickStartBase):
    payload = QuickStartPayload(user_id=user_id, **body.dict())
    return quickstart_core(payload)

@app.post("/quickstart", response_model=QuickStartResult)
def quickstart(payload: QuickStartPayload):
    return quickstart_core(payload)

@app.get("/")
def root():
    return {"message": "FastAPI server is running!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True)