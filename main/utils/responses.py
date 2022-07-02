from http.client import UNAUTHORIZED
from flask import make_response, jsonify


#HTTP RESPONSES

#reference http_codes
#200-ok(successful request)
#201-created(i.e data added etc)
#204-successful request, no data returned
#400-bad request(server can't handle the request due to client error)
#403-not authorized(valid request but client is unauthorized)
#404-not found(resource doesn't exist in the server)
#422-Unprocessable entity(request can't be processed due to semantic error)
#500-internal server error(error in the application or unexpected condition in the application)
INVALID_FIELD_NAME_SENT_422={
    "http_code":422,
    "code":"invalidInput",
    "message":"Invalid fields found"
}
INVALID_INPUT_422={
    "http_code":422,
    "code":"invalidInput",
    "message":"Invalid Input"
}
MISSING_PARAMETERS_422={
    "http_code":422,
    "code":"missingParameter",
    "message":"Missing Parameter"
}
BAD_REQUEST_400={
    "http_code":400,
    "code":"badRequest",
    "message":"Bad request"
}
SERVER_ERROR_500={
    "http_code":500,
    "code":"serverError",
    "message":"Server Error"
}
SERVER_ERROR_404={
    "http_code":404,
    "code":"notFound",
    "message":"Resource Not Found"
}
UNAUTHORIZED_403={
    "http_code":403,
    "code":"notAuthorized",
    "message":"You are not authorized"
}
SUCCESS_200={
    "http_code":200,
    "code":"success"
}
SUCCESS_201={
    "http_code":201,
    "code":"success"
}
SUCCESS_204={
    "http_code":204,
    "code":"success"
}

#creating starndard response from the api
def response_with(response,value=None,message=None,error=None,headers={},pagination=None):
    """
    Formatting responses appropriately. this function will be used at the api endpoints

    Args:
        response (http response dictionary for  default or response name(string) for custom errors): default http response dictionary(containing http code, code and message) or custom error
        
        value (int, optional): custom error value set when defining custom response(added for custom response). Defaults to None.
        
        message (string, optional): custom response message for custom responses(added for custom response). Defaults to None.
        
        error (string, optional): error code to return on the custom response(added for custom response). Defaults to None.
        
        headers (dict, optional): response headers added for custom responses. Defaults to {}.
        
        pagination (int, optional): set when there is need to load the next page. Defaults to None.

    Returns:
        response object: formatted response object to serve data at the api endpoint.
    """
    result={}
    if value is not None:
        result.update(value)
    if response.get('message',None) is not None:
        result.update({"message":response["message"]})
    result.update({"code":response["code"]})
    
    if error is not None:
        result.update({'errors':error})
    if pagination is not None:
        result.update({"pagination":pagination})
    headers.update({"Access-Allow-Origin":"*"})
    headers.update({"server":"FLASK REST API"})
    return make_response(jsonify(result),response["http_code"],headers)