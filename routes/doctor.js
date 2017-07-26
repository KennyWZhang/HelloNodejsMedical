/**
 * Created by norway on 14-3-30.
 */

var doctor = require('../daos/DoctorDao');

exports.showDoctor = function (req, res) {
  if (req.params.id) {

    doctor.findById(req.params.id, function (err, doctorInfo) {
      if (err == null) {
        // 更新
        return res.render('doctor', {
            title: '编辑医生信息',
            label: '编辑医生:',
            doctor: doctorInfo,
            readonly: true
        });
      } else {
        req.session.error = '查询医生信息失败,请重试';
        return res.render('doctor', {
            title: '编辑医生信息',
            label: '编辑医生:'
        });
      }
    })
  }
};

exports.addDoctor = function (req, res) {

    // 新增
    return res.render('doctor', {
        title: '新增医生信息',
        label: '新增医生:'
    });
};

exports.doAddDoctor = function (req, res) {
    var obj = req.body;

    doctor.add(obj, function (err) {
        if (err) {
            req.session.error = '添加医生信息失败,请重试';
        } else {
            req.session.success = '添加医生信息成功';
            return res.redirect('/home');
        }
    });
};

exports.updateDoctor = function (req, res) {
    if (req.params.id) {

      doctor.findById(req.params.id, function (err, doctorInfo) {
        if (err == null) {
          // 更新
          return res.render('doctor', {
              title: '编辑医生信息',
              label: '编辑医生:',
              doctor: doctorInfo
          });
        } else {
          req.session.error = '查询医生信息失败,请重试';
          return res.render('doctor', {
              title: '编辑医生信息',
              label: '编辑医生:'
          });
        }
      })
    }
};

exports.doUpdateDoctor = function (req, res) {
    var obj = req.body;
    var id = req.params.id;

    if (id) {
        doctor.update(id, obj, function (err) {
            if (err) {
                req.session.error = '更新医生信息失败,请重试';
            } else {
                req.session.success = '更新医生信息成功';
                return res.redirect('/home');
            }
        });
    }
};

exports.findDoctorByName = function (req, res) {
    var name = req.params.name;
    // 构造模糊查询query对象
    var query = {};
    if (name) {
        //模糊查询参数,使用正则表达式
        query['name'] = new RegExp(name);
    }
    doctor.findLikeName(query, function (err, obj) {
        return res.send(obj);
    });
}

exports.deleteDoctor = function (req, res) {
    var id = req.params.id;
    doctor.delete(id, function (err, obj) {
        if (err) {
            req.session.error = '删除医生信息失败,请重试';
        } else {
            req.session.success = '删除信息成功';
            return res.redirect('/home');
        }
    });
}

// 查找所有医生信息,后续需要做limit限制
exports.findAllDoctor = function (req, res) {
    /*doctor.findAll(function (err, obj) {
        if (err) {
            req.session.error = '查找医生信息失败,请重试';
        } else {
            //req.session.success = '查找医生信息成功';
            return res.send(obj);
        }
    });*/

    // 尝试promise
    doctor.findAll(function(obj) {
        if (!obj) {
            req.session.error = '查找医生信息失败,请重试';
        } else {
            //req.session.success = '查找医生信息成功';
            return res.send(obj);
        }
    });
}
