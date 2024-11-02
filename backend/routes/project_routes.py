from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.model import Project, User, db
import uuid 

project_bp = Blueprint('project', __name__)

@project_bp.route('/create', methods=['POST'])
@jwt_required()
def create_project():
    name = request.json.get('name')
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if not name:
        return jsonify({'error': 'Project name is required'}), 400

    new_project = Project(name=name)  # No need to pass invitation_code here
    new_project.users.append(user)

    db.session.add(new_project)
    db.session.commit()

    return jsonify({
        'message': 'Project created successfully', 
        'invitation_code': new_project.invitation_code  # Send the invitation code as response
    }), 201


@project_bp.route('/join', methods=['POST'])
@jwt_required()
def join_project():
    invitation_code = request.json.get('invitation_code')
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if not invitation_code:
        return jsonify({'error': 'Invitation code is required'}), 400

    project = Project.query.filter_by(invitation_code=invitation_code).first()

    if project:
        if user in project.users:
            return jsonify({'message': 'You are already a member of this project'}), 200

        project.users.append(user)
        db.session.commit()
        return jsonify({'message': 'Joined project successfully'}), 200
    return jsonify({'error': 'Invalid invitation code'}), 404


@project_bp.route('/list', methods=['GET'])
@jwt_required()
def list_projects():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if user is None:
        return jsonify({'error': 'User not found'}), 404

    projects = user.projects
    project_list = [{'id': project.id, 'name': project.name} for project in projects]

    return jsonify(projects=project_list), 200

@project_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()

    if user:
        user_data = {
            'username': user.username,
            # Add more fields as needed (e.g., email, phone, etc.)
        }
        return jsonify(user_data=user_data), 200
    return jsonify({'error': 'User not found'}), 404
@project_bp.route('/details/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project_details(project_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    project = Project.query.get(project_id)

    if not project:
        return jsonify({'error': 'Project not found'}), 404

    # Check if the user is part of the project
    if user not in project.users:
        return jsonify({'error': 'You are not part of this project'}), 403

    # Gather project details
    project_details = {
        'id': project.id,
        'name': project.name,
        'invitation_code': project.invitation_code,
        'users': [{'username': u.username} for u in project.users]
    }
    return jsonify(project_details=project_details), 200
