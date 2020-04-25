const yapi = require('../yapi.js');
const baseModel = require('./base.js');

/**
 * 接口分类
 */
class interfaceCat extends baseModel {
  getName() {
    return 'interface_cat';
  }

  getSchema() {
    return {
      name: { type: String, required: true },
      uid: { type: Number, required: true },
      project_id: { type: Number, required: true },
      desc: String,
      add_time: Number,
      up_time: Number,
      index: { type: Number, default: 0 },
      catType: { type: String, enum:['interface', 'model'], default: 'interface'}
    };
  }

  save(data) {
    let m = new this.model(data);
    return m.save();
  }

  get(id) {
    return this.model
      .findOne({
        _id: id
      })
      .exec();
  }

  checkRepeat(name, catType) {
    return this.model.countDocuments(
        catType ? {
                    name: name,
                    catType
                  }:{
                    name: name,
                    $or:[{catType: null}, {catType: 'interface'}]
                 });
  }

  list(project_id, catType) {
    return this.model
      .find(catType ? {
        project_id: project_id,
        catType
      }: {
        project_id: project_id,
        $or:[{catType: null}, {catType: 'interface'}]
      })
      .sort({ index: 1 })
      .exec();
  }

  del(id) {
    return this.model.remove({
      _id: id
    });
  }

  delByProjectId(id) {
    return this.model.remove({
      project_id: id
    });
  }

  up(id, data) {
    data.up_time = yapi.commons.time();
    return this.model.update(
      {
        _id: id
      },
      data
    );
  }

  upCatIndex(id, index) {
    return this.model.update(
      {
        _id: id
      },
      {
        index: index
      }
    );
  }
}

module.exports = interfaceCat;
