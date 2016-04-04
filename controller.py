from bottle import get, post, template, run, static_file, request
import json

import codecs
import sqlite3

db = sqlite3.connect('linkedin')

# db = MySQLdb.connect(host="localhost", user="root", passwd="root", db="mysql")

cur = db.cursor()

# cur.execute('create database if not exists linkedin')
#
# cur.execute('use linkedin')

create_table_qry = 'CREATE TABLE if not EXISTS companies (name VARCHAR (255), id INT, image_url VARCHAR (255), subline VARCHAR(255), url VARCHAR(255));'
cur.execute(create_table_qry)

db.commit()


@get('/')
def index():
    return template('autocomplete.html')


@post('/get_data')
def get_data():

    check_name = request.json.get('name')

    table_qry = "SELECT name, image_url, url from companies where name like '%s';" % (check_name + '%')
    cur.execute(table_qry)
    res = cur.fetchall()
    list_to_return = []
    stmt = [a[0] + ', ' + a[1] + ', ' + a[2] for a in res]
    for a in stmt:
        result = a
        string = str(result)
        u = unicode(string, "utf-8", errors='ignore')
        r = u.split(',')
        list_to_return.append(r)
        print list_to_return
    return json.dumps(list_to_return, encoding="utf-8")


@post('/save')
def post_data():
    data_arr = request.json.get('companies')
    company_obj = {}
    list_to_return = []
    for i in range(len(data_arr)):
        company_obj['displayName'] = data_arr[i]['name']
        company_obj['id'] = data_arr[i]['id']
        company_obj['image_url'] = data_arr[i]['imageUrl']
        company_obj['subline'] = data_arr[i]['subLine']
        company_obj['url'] = data_arr[i]['url']
        save_data(company_obj)
        list_to_return.append(company_obj)
    return json.dumps(list_to_return)


def save_data(company_obj):
    check_qry = "SELECT * from companies where name = '%s';" % (company_obj['displayName'])
    cur.execute(check_qry)
    res = cur.fetchall()
    if not res:
        insert_qry = "INSERT INTO companies values ('%s', '%s', '%s', '%s', '%s');" % (company_obj['displayName'], company_obj['id'],
                                                                                       company_obj['image_url'], company_obj['subline'], company_obj['url'] )
        cur.execute(insert_qry)
        db.commit()


@get('/js/<filename:re:.*\.js>')
def javascripts(filename):
    return static_file(filename, root='js')


@get('/css/<filename:re:.*\.css>')
def stylesheets(filename):
    return static_file(filename, root='css')


run(host='localhost', port=8000, debug=True)