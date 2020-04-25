const yapi = require('../yapi.js');
const baseModel = require('./base.js');

class interfaceModel extends baseModel {
    getName() {
        return 'interfaceModel';
    }

    getSchema() {
        return {
            title: {type: String, required: true},
            project_id: {type: Number, required: true},
            catId: {type: String, required: true},
            fields: [
                {
                    name: String,
                    sort: Number,
                    type: {type: String, enum: ['sting', 'number', 'array', 'object', 'boolean', 'model']},
                    moId: String,
                    required: Boolean,
                    description: String,
                    default: String,
                    minOrMinLen: Number,
                    maxOrMaxLen: Number,
                    pattern: String,
                    format: String
                }
            ],
            interfaces: [
                {
                    id: String,
                    name: String,
                    updateStrategy: {type: String, enum: ['always', 'chooseUpdate', 'never']}
                }
            ]
        };
    }

    getPrimaryKey() {
        return 'id';
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

    selectByTitle(title) {
        return this.model
            .find({
                title
            })
            .exec();
    }


    list(project_id) {
        return this.model
            .find({
                project_id: project_id
            })
            .sort({title: 1})
            .exec();
    }

    listWithPage(project_id, page, limit) {
        page = parseInt(page);
        limit = parseInt(limit);
        return this.model
            .find({
                project_id: project_id
            })
            .sort({title: 1})
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    //获取全部接口信息
    getInterfaceListCount() {
        return this.model.countDocuments({});
    }

    listByCatid(catId) {
        return this.model
            .find({
                catId: catId
            })
            .exec();
    }


    del(id) {
        return this.model.remove({
            _id: id
        });
    }

    delByCatid(id) {
        return this.model.remove({
            catId: id
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
                id
            },
            data,
            {runValidators: true}
        );
    }

    listCount(option) {
        return this.model.countDocuments(option);
    }

    search(keyword) {
        return this.model
            .find({
                title: new RegExp(keyword, 'ig')
            })
            .limit(10);
    }
}

module.exports = interfaceModel;
