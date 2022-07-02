#API ENDPOINTS
from flask import Blueprint

views=Blueprint("views",__name__)


@views.route('/')
@views.route('/index')
def index():
    return "Hello world"