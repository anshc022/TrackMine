from flask_sqlalchemy import SQLAlchemy
import uuid

db = SQLAlchemy()

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    invitation_code = db.Column(db.String(36), unique=True, nullable=False)
    users = db.relationship('User', secondary='user_project', back_populates='projects')

    def __init__(self, name, invitation_code=None):
        self.name = name
        self.invitation_code = invitation_code or str(uuid.uuid4())  # Generate if not provided


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    projects = db.relationship('Project', secondary='user_project', back_populates='users')  # Define the relationship

user_project = db.Table('user_project',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('project_id', db.Integer, db.ForeignKey('project.id'))
)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())
