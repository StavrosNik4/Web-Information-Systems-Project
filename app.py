# BEGIN CODE HERE
import math

import flask
from flask import Flask, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from pymongo import TEXT
from selenium import webdriver
from selenium.webdriver.common.by import By

# END CODE HERE

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://127.0.0.1:27017/pspi"
CORS(app)
mongo = PyMongo(app)
mongo.db.products.create_index([("name", TEXT)])


@app.route("/search", methods=["GET"])
def search():
    # BEGIN CODE HERE
    # params search
    name = request.args.get("name")
    doc = mongo.db.products.find({"$text": {"$search": f"\"{name}\""}})
    if doc is None:
        return "Name does not exist"

    my_dict = {}
    for i, row in enumerate(doc):
        del row['_id']
        my_dict[str(i)] = row
    return str(list(my_dict.values()))
    # END CODE HERE


@app.route("/add-product", methods=["POST"])
def add_product():
    # BEGIN CODE HERE
        product_coll = mongo.db.products
        body = flask.request.get_json()
        cntr = 0
        for result in mongo.db.products.find({}): #maybe possible with a 'find' statement but whatever
            cntr = cntr + 1
            if result['name'] == body['name']:
                body['_id'] = result['_id']
                body['id'] = str(cntr)
                product_coll.find_one_and_replace(result,body)
                return "updated!"
        body['id'] = str(cntr + 1)
        product_coll.insert_one(body)
        return "success"
    # END CODE HERE


@app.route("/content-based-filtering", methods=["POST"])
def content_based_filtering():
    # BEGIN CODE HERE
    ret = []
    product_coll = mongo.db.products
    body = flask.request.get_json()
    query_vector = (body['production_year'],body['price'],body['color'],body['size'])

    def vector_length(vector_a:tuple):
        ret = 0
        for i in vector_a:
            ret += math.pow(i,2)
    return math.sqrt(ret)

    def cosine_sim(vector_a :tuple,vector_b:tuple):
        return (sum(p*q for p,q in zip(vector_a, vector_b)) )/ (vector_length(vector_a) * vector_length(vector_b))

    for result in mongo.db.products.find({}): #maybe possible with a 'find' statement but whatever
        vector =  (result['production_year'],result['price'],result['color'],result['size'])
        if cosine_sim(vector,query_vector) > 0.7:
            ret.append(result['name'])
    return ret
    # END CODE HERE


@app.route("/crawler", methods=["GET"])
def crawler():
    # BEGIN CODE HERE

    semester = request.args.get('semester', type=int)
    if 0 < semester < 9:
        url = f"https://qa.auth.gr/el/x/studyguide/600000438/current"
        driver = webdriver.Chrome()
        driver.get(url)
        course_names = []
        # Find all links inside a table with id="exam[semester]"
        table = driver.find_element(By.ID, "exam" + str(semester))
        courses = table.find_elements(By.TAG_NAME, "a")
        for course in courses:
            course_names.append(course.text)
        driver.quit()
        return {"courses": course_names}
    return {"courses": ""}
    # END CODE HERE
