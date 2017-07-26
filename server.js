/**
 * Created by norway on 14-4-5.
 */
/**
 * Module dependencies.
 * 模块依赖
 */
var express = require('express');

// var conf = require('./conf');

// var router = require('./routes/router');

// var http = require('http');

var path = require('path');

var ejs = require('ejs');

// var log4js = require('./log4js');
//var log4js = require('log4js');
// var logger = log4js.getLogger('server');
// logger.setLevel('INFO');

// var SessionStore = require('session-mongoose')(express);
// var store = new SessionStore({url: conf.sessionDBUrl, interval: 120000});

var app = express();

// app.configure(function () {
    // all environments  环境变量及相关配置
    // app.set('port', process.env.PORT || conf.port);

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

// var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

    // app.use(express.favicon());
    // app.use(express.logger('dev'));
    // app.use(express.json());
    // app.use(express.urlencoded());
    // app.use(express.methodOverride());
    // app.use(express.bodyParser());
    // app.use(express.cookieParser());
    // app.use(express.cookieSession({secret: 'norway'}));

    // log4j相关配置
    // log4js.use(app, logger);

    var session = require('express-session')
    // session设置
    app.use(session({
        secret: 'norway',
        // store: store,
        cookie: {maxAge: 900000}
    }))

    app.use(function (req, res, next) {
        // 提示消息逻辑
        res.locals.error = req.session.error ? req.session.error : null;
        res.locals.success = req.session.success ? req.session.success : null;
        res.locals.user = req.session ? req.session.user : null;

        delete req.session.error;
        delete req.session.success;
        next();
    })

    // 路由配置
    // app.use(app.router);

    app.use(express.static(path.join(__dirname, 'public')));

    // router.routes(app);

//    app.set('view engine', 'ejs');
    //ejs模板文件扩展为html文件
    app.engine(".html", ejs.__express);
    app.set("view engine", 'html');
// });

// app.configure('development', function () {
    // app.use(express.errorHandler({
    //     dumpExceptions: true,
    //     showStack: true
    // }));
// });

// app.configure('production', function () {
//     app.use(express.errorHandler());
// });


var doctor = require('./routes/doctor');
var user = require('./routes/user');
var member = require('./routes/member');

// 首页
app.get('/', function (req, res) {
    res.render('index', { title: '首页' });
});
//
// // 用户信息相关
app.get('/home', authentication);
app.get('/home', user.home);
//
// 登录
app.all('/login', noAuthentication);
app.get('/login', user.login);
app.post('/login', user.doLogin);

// 退出
app.get('/logout', authentication);
app.get('/logout', user.logout);

// 注册
app.all('/reg', noAuthentication);
app.get('/reg', user.reg);
app.post('/reg', user.doReg);

// 医生信息相关
// 添加和更新
app.get('/doctor/show/:id', doctor.showDoctor);

app.all('/doctor/add', authentication);
app.get('/doctor/add', doctor.addDoctor);
app.post('/doctor/add', doctor.doAddDoctor);
app.get('/doctor/update/:id', doctor.updateDoctor);
app.post('/doctor/update/:id', doctor.doUpdateDoctor);

// 查询
app.all('/doctor/query/', authentication);
app.get('/doctor/query/', doctor.findAllDoctor);
app.get('/doctor/query/:name', doctor.findDoctorByName);

// 删除
app.get('/doctor/delete/:id', doctor.deleteDoctor);
//
// 会员
app.all('/member/add', authentication);
app.get('/member/add', member.addMember);
app.post('/member/add', member.doAddMember);
app.get('/member/add/:id', member.showMember);
// app.post('/member/add/:id', member.doAddDoctor);

app.get('/test', function(req, res){
    res.render(
      'test.html',
      {title: '测试'}
    );
});

// 认证访问控制
// 未认证
function authentication(req, res, next) {
if (!req.session.user) {
    req.session.error = '请先登录';
    return res.redirect('/login');
}
next();
}

// 已认证
function noAuthentication(req, res, next) {
if (req.session.user) {
    req.session.error = '已登录';
    return res.redirect('/home');
}
next();
}

app.listen(3003, function () {
  console.log("started.");
})
