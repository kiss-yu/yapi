const interfaceModelM = require('../models/interfaceModel')
const interfaceCatModel = require('../models/interfaceCat.js');
const baseController = require('./base.js');
const yapi = require('../yapi.js');


class interfaceController extends baseController {
    constructor(ctx) {
        super(ctx);
        this.InterfaceModel = yapi.getInst(interfaceModelM);
        this.interfaceCatModel = yapi.getInst(interfaceCatModel)
    }

    // 获取模型全部分类
    async modelCatList(ctx) {
        let {project_id} = ctx.query;
        return (ctx.body = yapi.commons.resReturn(await this.interfaceCatModel.list(project_id, 'model')))
    }
    async delCat(ctx) {
        let {catId, catName, project_id} = ctx.request.body;
        let catCount = await this.interfaceCatModel.del(catId);
        let modelCount = await this.InterfaceModel.delByCatid(catId);
        setTimeout(() => {
            let username = this.getUsername();
            let title = `<a href="/user/profile/${this.getUid()}">${username}</a> 删除了模型分类${catName}，删除了${modelCount.deletedCount}个模型`;
            yapi.commons.saveLog({
                content: title,
                type: 'project',
                uid: this.getUid(),
                username: username,
                typeid: project_id
            });
            this.projectModel.up(project_id, {up_time: new Date().getTime()}).then();
        })
        return (ctx.body = yapi.commons.resReturn(modelCount.deletedCount + catCount.deletedCount))
    }

    // 添加接口模型
    async saveInterfaceModel(ctx) {
        let model = ctx.request.body;
        let update = Boolean(model.id);
        let {title} = model;
        if (!title) {
            return (ctx.body = yapi.commons.resReturn(null, 401, '模型名称不能为空'));
        }

        let old = await this.InterfaceModel.selectByTitle(title);
        if (!old) {
            return (ctx.body = yapi.commons.resReturn(null, 401, '模型名称已存在'));
        }

        let result = await this.InterfaceModel.save(model);
        await this.cascadeUpdateInterface(model);

        this.catModel.get(model.catId).then(cate => {
            let username = this.getUsername();
            let title = update ? `
      <a href="/user/profile/${this.getUid()}">${username}</a> 修改了模型 <a href="/project/${
                model.project_id
            }/interface/projectModel/${model.id}">${model.title}</a>
      ` : `<a href="/user/profile/${this.getUid()}">${username}</a> 为分类 <a href="/project/${
                model.project_id
            }/interface/projectModel/cat_${model.catId}">${cate.name}</a> 添加了模型 <a href="/project/${
                model.project_id
            }/interface/projectModel/${result.id}">${model.title}</a> `;
            yapi.commons.saveLog({
                content: title,
                type: 'project',
                uid: this.getUid(),
                username: username,
                typeid: model.project_id
            });
            this.projectModel.up(model.project_id, {up_time: new Date().getTime()}).then();
        });
        return (ctx.body = yapi.commons.resReturn(result));
    }

    // 直接更新接口关联模型
    async updateInterface(ctx) {
        let {modelId, interfaceId, updateStrategy, project_id, modelName, interfaceName} = ctx.request.body;
        let result = await this.updateInterfaceModel(this.InterfaceModel.get(modelId, interfaceId, updateStrategy));
        let updateStrategyMap = {
            always: '全量',
            chooseUpdate: '选择性'
        }
        setTimeout(() => {
            let username = this.getUsername();
            let title = `<a href="/user/profile/${this.getUid()}">${username}</a> 为接口 <a href="/project/${
                project_id
            }/interface/projectModel/${interfaceId}">${interfaceName}</a> ${updateStrategyMap[updateStrategy]}更新了模型 <a href="/project/${
                project_id
            }/interface/projectModel/${modelId}">${modelName}</a>`;
            yapi.commons.saveLog({
                content: title,
                type: 'project',
                uid: this.getUid(),
                username: username,
                typeid: project_id
            });
            this.projectModel.up(project_id, {up_time: new Date().getTime()}).then();
        })
        return (ctx.body = yapi.commons.resReturn(result));
    }

    // 删除模型
    async deleteModel(ctx) {
        let {modelId, cascadeDelete = true, catId, project_id} = ctx.request.body;
        let model = await this.InterfaceModel.get(modelId);
        if (cascadeDelete) {
            model.updateStrategy = 'delete';
            await this.cascadeUpdateInterface(model);
        } else {
            await this.InterfaceModel.del(modelId);
        }
        this.catModel.get(catId).then(cate => {
            let username = this.getUsername();
            let title = `<a href="/user/profile/${this.getUid()}">${username}</a> 为分类 <a href="/project/${
                project_id
            }/interface/projectModel/cat_${catId}">${cate.name}</a> 删除了模型 ${model.name}`;
            yapi.commons.saveLog({
                content: title,
                type: 'project',
                uid: this.getUid(),
                username: username,
                typeid: model.project_id
            });
            this.projectModel.up(model.project_id, {up_time: new Date().getTime()}).then();
        });

        return (ctx.body = yapi.commons.resReturn(model));
    }

    // 查询模型 get
    async detail(ctx) {
        let {id} = ctx.query;
        return (ctx.body = await this.InterfaceModel.get(id))
    }

    // 查询模型列表
    async list(ctx) {
        let {page = 1, size = 10, projectId, catId, keyword} = ctx.query;
        if (catId) {
            return (ctx.body = yapi.commons.resReturn(await this.InterfaceModel.listByCatid(catId)))
        }
        if (keyword) {
            return (ctx.body = yapi.commons.resReturn(await this.InterfaceModel.search(keyword)))
        }
        return (ctx.body = yapi.commons.resReturn(await this.InterfaceModel.listWithPage(projectId, page, size)))
    }

    async updateInterfaceModel(model, _id, updateStrategy) {
        let oldInterface = this.Model.get(_id);
        if (!oldInterface) {
            return null;
        }
        return await this.Model.up(oldInterface.id, updateInterface(oldInterface, model, updateStrategy));
    }

    async cascadeUpdateInterface(model) {
        if (model.interfaces && model.interfaces.length > 0) {
            for (let inter of model.interfaces) {
                if (inter.updateStrategy !== 'never') {
                    await this.updateInterfaceModel(model, inter.id, inter.updateStrategy)
                }
            }
        }
    }


}

function transFiled(source, sourceFieldName, target, updateStrategy) {
    if (updateStrategy === 'delete') {
        delete source[sourceFieldName]
    }
    if (updateStrategy === 'always') {
        return target;
    } else if (updateStrategy === 'chooseUpdate') {
        return {
            ...source[sourceFieldName],
            ...target
        }
    }
}

function transWork(source, sourceFieldName, target, updateStrategy) {
    if (!source) {
        return;
    }
    if (source.type === 'object') {
        if (source.modelId === target.id) {
            if (!sourceFieldName) {
                source.properties = {};
            } else {
                source[sourceFieldName] = transFiled(source, target, updateStrategy);
            }
        } else {
            for (let key in source.properties) {
                transWork(source.properties, key, target, updateStrategy);
            }
        }
    } else if (source.type === 'array') {
        transWork(source.item, 'items', target, updateStrategy)
    }
}

function updateInterface(sourceInterface, model, updateStrategy) {
    let res_body = sourceInterface.res_body;
    let req_body_other = sourceInterface.res_body_type === 'json' ? sourceInterface.req_body_other : null;
    transWork(res_body, null, model, updateStrategy);
    transWork(req_body_other, null, model, updateStrategy);
    return sourceInterface;
}

module.exports = interfaceController;
