from fastapi import FastAPI, HTTPException, Depends,Response
from typing import Optional, List
from pydantic import BaseModel
from uuid import UUID, uuid4
from fastapi.middleware.cors import CORSMiddleware
import databases
import sqlalchemy
from databases import Database
from sqlalchemy import Column, String, Boolean

# from fastapi_sessions.frontends.implementations import SessionCookie, CookieParameters
# from fastapi_sessions.backends.implementations import InMemoryBackend
# from fastapi_sessions.session_verifier import SessionVerifier



DATABASE_URL = "sqlite:///./todos.db"

app = FastAPI()

# Add CORS Middleware
origins = [
    "http://localhost:5173",
    "localhost:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
database = Database(DATABASE_URL)

metadata = sqlalchemy.MetaData()

todos = sqlalchemy.Table(
    "todos",
    metadata,
    sqlalchemy.Column("id", String, primary_key=True),
    sqlalchemy.Column("title", String),
    sqlalchemy.Column("completed", Boolean),
)

# Dependency to get database connection
async def get_database():
    async with database:
        yield database

# Model
class TodoItem(BaseModel):
    id: UUID
    title: str
    completed: bool = False

class UpdateTodo(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None

# CRUD operations

# Create todo
@app.post('/todos/new')
async def post_todo(todo: TodoItem, db: Database = Depends(get_database)):
    query = todos.insert().values(id=str(todo.id), title=todo.title, completed=todo.completed)
    await db.execute(query)
    return {"data": "Todo added."}

# Read all todos
@app.get('/todos')
async def get_all_todos(db: Database = Depends(get_database)):
    query = todos.select()
    return await db.fetch_all(query)

# Read todo by ID
@app.get('/todos/{id}')
async def get_todo(id: UUID, db: Database = Depends(get_database)):
    query = todos.select().where(todos.c.id == str(id))
    todo = await db.fetch_one(query)
    if todo:
        return todo
    else:
        raise HTTPException(status_code=404, detail="Todo not found")

# Update todo
@app.put("/todos/edit/{id}")
async def update_todo(id: UUID, todo: UpdateTodo, db: Database = Depends(get_database)):
    query = todos.select().where(todos.c.id == str(id))
    existing_todo = await db.fetch_one(query)
    if existing_todo:
        title = todo.title if todo.title is not None else existing_todo['title']
        completed = todo.completed if todo.completed is not None else existing_todo['completed']
        update_query = todos.update().where(todos.c.id == str(id)).values(title=title, completed=completed)
        await db.execute(update_query)
        return {"id": str(id), "title": title, "completed": completed}
    else:
        raise HTTPException(status_code=404, detail="Todo not found")

# Delete todo
@app.delete("/todos/delete/{id}")
async def delete_todo(id: UUID, db: Database = Depends(get_database)):
    query = todos.delete().where(todos.c.id == str(id))
    result = await db.execute(query)
    if result:
        return {"msg": "Todo has been deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Todo not found")
    

# class SessionData(BaseModel):
#     username: str

# cookie_params = CookieParameters()

# # Uses UUID
# cookie = SessionCookie(
#     cookie_name="cookie",
#     identifier="general_verifier",
#     auto_error=True,
#     secret_key="DONOTUSE",
#     cookie_params=cookie_params,
# )

# backend = InMemoryBackend[UUID, SessionData]()

# class BasicVerifier(SessionVerifier[UUID, SessionData]):
#     def __init__(
#         self,
#         *,
#         identifier: str,
#         auto_error: bool,
#         backend: InMemoryBackend[UUID, SessionData],
#         auth_http_exception: HTTPException,
#     ):
#         self._identifier = identifier
#         self._auto_error = auto_error
#         self._backend = backend
#         self._auth_http_exception = auth_http_exception

#     @property
#     def identifier(self):
#         return self._identifier

#     @property
#     def backend(self):
#         return self._backend

#     @property
#     def auto_error(self):
#         return self._auto_error

#     @property
#     def auth_http_exception(self):
#         return self._auth_http_exception

#     def verify_session(self, model: SessionData) -> bool:
#         """If the session exists, it is valid"""
#         return True


# verifier = BasicVerifier(
#     identifier="general_verifier",
#     auto_error=True,
#     backend=backend,
#     auth_http_exception=HTTPException(status_code=403, detail="invalid session"),
# )

# @app.post("/create_session/{name}")
# async def create_session(name: str, response: Response):

#     session = uuid4()
#     data = SessionData(username=name)

#     await backend.create(session, data)
#     cookie.attach_to_response(response, session)

#     return f"created session for {name}"


# @app.get("/whoami", dependencies=[Depends(cookie)])
# async def whoami(session_data: SessionData = Depends(verifier)):
#     return session_data

# @app.post("/delete_session")
# async def del_session(response: Response, session_id: UUID = Depends(cookie)):
#     await backend.delete(session_id)
#     cookie.delete_from_response(response)
#     return "deleted session"

# users = {
#     "user1": {"email": "user1@example.com", "password": "password1"},
#     "user2": {"email": "user2@example.com", "password": "password2"}
# }

# @app.post("/login")
# async def login(email: str, password: str, response: Response):
#     # Check if the provided email exists in valid_credentials
#     for username, credentials in users.items():
#         if credentials["email"] == email and credentials["password"] == password:
#             # Generate a session token (you can use JWT or a random string)
#             session_token = str(uuid4())
            
#             # Set the session token in a cookie
#             response.set_cookie(key="session_token", value=session_token)
            
#             # Return a success message along with the token
#             return {"message": "Login successful", "token": session_token}
    
#     # If email or password is invalid, raise HTTPException with status code 401
#     raise HTTPException(status_code=401, detail="Invalid email or password")