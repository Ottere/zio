# -*- coding: utf-8 -*-
from flask import Flask, render_template, request,redirect, url_for, flash,jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import and_
import json
app = Flask(__name__)
app.secret_key = "Secret Key"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///sitemap.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class sitemap(db.Model):
    __tablename__ = 'sitemap'
    id = db.Column(db.Integer,primary_key = True,autoincrement=True)
    title = db.Column(db.String(255), nullable = False)
    url = db.Column(db.String(255), nullable = True)
    depth = db.Column(db.Integer, nullable = False)
    pid = db.Column(db.Integer, nullable = False)
    sortseq = db.Column(db.Integer, unique = True, nullable = False)
    describe = db.Column(db.String(255), unique = True, nullable = True)
    favState = db.Column(db.String(255),nullable=False)

    def __init__(self, title,url,depth,pid,sortseq,describe,favState):
        self.title = title
        self.url = url
        self.depth = depth
        self.pid = pid
        self.sortseq = sortseq
        self.describe = describe
        self.favState = favState

class searchLog(db.Model):
    __tablename__='searchLog'
    id = db.Column(db.Integer,primary_key = True,autoincrement=True)
    stitle = db.Column(db.String(255),nullable=False)

    def __init__(self,stitle):
        self.stitle=stitle

class favorite(db.Model):
    __tablename__='favorite'
    id = db.Column(db.Integer,primary_key = True)
    ftitle = db.Column(db.String(255),nullable=False)
    fdescribe = db.Column(db.String(255),nullable=False)
    # state = db.Column(db.String(255),nullable=False)

    def __init__(self,id,ftitle,fdescribe): #state
        self.id=id
        self.ftitle = ftitle
        self.fdescribe =fdescribe
        # self.state = state

@app.route("/")
def index():
    onedepth_data = sitemap.query.filter(sitemap.depth==1).order_by(sitemap.id.desc()).all()
    twodepth_data = sitemap.query.filter(sitemap.pid==1).order_by(sitemap.id.desc()).all()
    return render_template("tem_sitemap.html",sitemap_one = onedepth_data,sitemap_two =twodepth_data)

@app.route("/admin")
def admin():
    all_data = sitemap.query.order_by(sitemap.id.desc()).all() # selelct * from sitmemap
    return render_template("admin.html",sitemap = all_data)
@app.route("/search",methods=['POST','GET'])
def search():
    searchtxt = request.form['txtsearch']
    item = searchLog.query.filter(searchLog.stitle==searchtxt).first()
    if searchtxt != '' and item == None :
        inputDb = searchLog(searchtxt) 
        db.session.add(inputDb)
        db.session.commit()

    list_txt=searchtxt.split()
    if searchtxt=='':
        search_db = sitemap.query.filter(sitemap.depth==1).order_by(sitemap.id.asc()).all()
        query_list=[]
        for i in search_db :
            query_list.append({'title' : i.title, 'id' : i.id ,'describe' : i.describe,'favState' : i.favState})
        json_list = json.dumps(query_list,ensure_ascii=False) #한글 깨짐 방지
        return json_list
    elif len(list_txt) == 1:
        search_db = sitemap.query.filter(sitemap.title.contains(searchtxt)).order_by(sitemap.id.desc()).all()
        query_list=[]
        for i in search_db :
            query_list.append({'title' : i.title, 'id' : i.id ,'describe' : i.describe,'favState' : i.favState})
        json_list = json.dumps(query_list,ensure_ascii=False) #한글 깨짐 방지
        return json_list
    elif len(list_txt) > 1:
        search_db = sitemap.query.filter(and_(sitemap.title.contains(list_txt[0]),sitemap.title.contains(list_txt[1]))).all()
        query_list=[]
        for i in search_db :
            query_list.append({'title' : i.title, 'id' : i.id ,'describe' : i.describe,'favState' : i.favState})
        json_list = json.dumps(query_list,ensure_ascii=False) #한글 깨짐 방지
        return json_list

@app.route('/recently',methods=['GET','POST'])
def recently_Search():
    search_data = db.session.query(searchLog.stitle).order_by(searchLog.id.desc()).all()
    # .order_by(searchLog.id.desc()).all()
    query_list=[]
    for i in search_data :
        query_list.append({'stitle':i.stitle})
    json_list = json.dumps(query_list,ensure_ascii=False) #한글 깨짐 방지
    return json_list

@app.route('/favorite',methods=['GET','POST'])
def favorite_list():
    favorite_data = favorite.query.all()
    query_list=[]
    for i in favorite_data :
        query_list.append({'id' : i.id, 'title' : i.ftitle,'describe':i.fdescribe}) #'state' : i.state
    json_list = json.dumps(query_list,ensure_ascii=False)
    return json_list
@app.route("/insert_favorite",methods=['POST','GET'])
def favorites():
    ftitle=request.form['titlename']
    fdes=request.form['desname']
    fid=request.form['titleid']
    db_update = sitemap.query.get(fid)
    favorite_data = favorite.query.filter(favorite.id==fid).first()
    if favorite_data == None:
        db_update.favState ='yes'
        inputFa=favorite(id=fid,ftitle=ftitle, fdescribe=fdes) #state=state
        db.session.add(inputFa)
        db.session.commit()
    return 'OK'
@app.route("/delete_favorite",methods=['POST','GET'])
def del_favorite():
    fid=request.form['titleid']
    db_delete = sitemap.query.get(fid)
    db_delete.favState = 'no'
    delete_fav = favorite.query.get(fid)
    db.session.delete(delete_fav)
    db.session.commit()
    return 'DEL'
@app.route('/click',methods=['GET','POST'])
def click():
    value = request.form['pid']
    li = db.session.query(sitemap).filter_by(pid=value).order_by(sitemap.sortseq).all()
    query_list=[]
    for i in li :
        query_list.append({'title' : i.title, 'id' : i.id ,'describe' : i.describe,'favState' : i.favState})
    json_list = json.dumps(query_list,ensure_ascii=False) #한글 깨짐 방지
    return json_list

@app.route('/urlclick',methods=['GET','POST'])
def urlclick():
    uid = request.form['urlid']
    url = db.session.query(sitemap).filter_by(id = uid).one()
    a={'url' : url.url}
    json_url = json.dumps(a)
    return json_url

@app.route("/insert",methods=['POST'])
def insertUser():
    if request.method == 'POST':
        title = request.form[u'title']
        url = request.form['url']
        depth = request.form['depth']
        pid = request.form['pid']
        sortseq = request.form['sortseq']
        describe = request.form['describe']
        favState = 'no'
        
        inputUser = sitemap(title,url,depth,pid,sortseq,describe,favState) 
        db.session.add(inputUser)
        db.session.commit()

        flash(u"db가 성공적으로 등록되었습니다.","success")
        return redirect(url_for('admin'))

@app.route('/update', methods=['GET','POST'])
def update():
    if request.method == 'POST':
        inputUser = sitemap.query.get(request.form.get('id'))
        inputUser.title = request.form[u'title']
        inputUser.url = request.form['url']
        inputUser.depth = request.form['depth']
        inputUser.pid = request.form['pid']
        inputUser.sortseq = request.form['sortseq']
        inputUser.describe = request.form['describe']
        db.session.commit()

        flash(u"db가 성공적으로 수정되었습니다.","success")
        flash(u"수고하셨습니다.","success")

        return redirect(url_for('admin'))

@app.route('/delete/<id>', methods=['GET','POST'])
def delete(id):
    deleteUser = sitemap.query.get(id)
    db.session.delete(deleteUser)
    db.session.commit()
    flash(u"db가 성공적으로 삭제되었습니다.","success")
    return redirect(url_for('admin'))