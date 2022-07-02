#AUTHENTICATION SYSTEM.(AUTH ENDPOINTS)

from flask import Blueprint

auth=Blueprint('auth',__name__)

@auth.route('/login')
def login():
    return "Login to continue"

@auth.route('/register')
def register():
    return "Sign up to continue"