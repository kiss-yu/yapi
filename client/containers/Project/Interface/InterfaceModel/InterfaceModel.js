import React, {PureComponent as Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {
    fetchInterfaceModelCatList,
    fetchInterfaceModelList,
    initInterfaceModel,
    postJson,
    delCat
} from '../../../../reducer/modules/interfaceModel.js';
import {Button, Icon, Input, message, Modal, Tooltip, Tree} from 'antd';
import AddInterfaceCatForm from '../InterfaceList/AddInterfaceCatForm';
import {Link, withRouter} from 'react-router-dom';

import '../InterfaceList/interfaceMenu.scss';
import './InterfaceModel.scss';

const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode;
const headHeight = 240; // menu顶部到网页顶部部分的高度

@connect(
    state => {
        return {
            ...state.model
        };
    },
    {
        initInterfaceModel,
        fetchInterfaceModelList,
        fetchInterfaceModelCatList
    }
)
class InterfaceModel extends Component {
    static propTypes = {
        match: PropTypes.object,
        projectId: PropTypes.string,
        initInterfaceModel: PropTypes.func,
        fetchInterfaceModelList: PropTypes.func,
        fetchInterfaceModelCatList: PropTypes.func,
        catList: PropTypes.array,
        modelList: PropTypes.array,
        history: PropTypes.object,
        location: PropTypes.object,
        router: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            editCat: null,
            activeTree: null,
            expands: true,
            keyword: null
        };
    }

    componentWillMount() {
        this.props.initInterfaceModel();
        if (this.props.projectId) {
            this.getList();
        }
    }

    onDrop = async e => {

    };

    getList() {
        return this.props.fetchInterfaceModelCatList(this.props.projectId);
    }
    showConfirm = data => {
        // let that = this;
        // let id = data.id;
        let catId = data.catid;
        const ref = confirm({
            title: '您确认删除此模型????',
            content: '温馨提示：模型删除后，无法恢复',
            okText: '确认',
            cancelText: '取消',
            async onOk() {
                delCat(catId)
            },
            onCancel() {
                ref.destroy();
            }
        });
    };

    showDelCatConfirm = item => {
        let that = this;
        const ref = confirm({
            title: '确定删除此模型分类吗？',
            content: '温馨提示：该操作会删除该分类下所有模型，模型删除后无法恢复',
            okText: '确认',
            cancelText: '取消',
            async onOk() {
                try {
                    await delCat(item._id, item.name, that.props.projectId)
                    await that.getList();
                    if (item._id === that.getSelects(true)[0]) {
                        this.props.history.push('/project/' + that.props.projectId + '/interface/projectModel');
                    } else {
                        await that.props.fetchInterfaceModelCatList(that.props.projectId);
                    }
                }catch (e) {
                    console.error(e);
                }
                ref.destroy();
            },
            onCancel() {

            }
        });
    };

    getSelects = (type) => {
        const params = new URLSearchParams(this.props.location.search);
        if (params.get('catId')) {
            return [params.get('catId')];
        }
        let { pathname } = this.props.location;
        console.log(this.props)
        let data = pathname.split("cat_");
        if (data && data.length === 2) {
            if (type || this.state.expands) {
                return [data[1]];
            }
        }
        return ['root'];
    }

    changeExpands = () => {
        this.setState({
            expands: false
        });
    };
    handleAddInterfaceModelCat = (data) => {
        data.project_id = this.props.projectId;
        data._id = this.state.editCat._id;
        data.catid = this.state.editCat._id;
        postJson(data._id ? '/api/interface/up_cat' : '/api/interface/add_cat', {
            ...data,
            catType: 'model'
        }).then(() => {
            message.success('模型分类添加成功');
            this.getList();
            this.setState({
                editCat: null
            })
        }).catch(e => {
            message.error(e.errmsg)
        });
    }
    copyInterfaceModel(model) {

    }
    onSearch(keyword) {
        console.log("keyword:", keyword);
    }

    render() {
        const matchParams = this.props.match.params;
        const { catList } = this.props;
        const { activeTree, editCat } = this.state;
        const searchBox = (
          <div className="interface-filter">
            <Input.Search onSearch={this.onSearch}  placeholder="搜索模型"/>
            <Button
                    type="primary"
                    onClick={() => this.setState({
                        editCat: {}
                    })}
                    className="btn-filter"
                >
                    添加分类
            </Button>
          </div>
        );

        const itemInterfaceModelCreate = item => {
            return (
              <TreeNode
                    title={
                      <div
                            className="container-title"
                            onMouseEnter={() => this.setState({activeTree: item.id})}
                            onMouseLeave={() => this.setState({activeTree: null})}
                        >
                        <Link
                                className="interface-item"
                                onClick={e => e.stopPropagation()}
                                to={`/project/${matchParams.id}/interface/projectModel/${item._id}/cat_${this.getSelects()}`}
                            >
                          {item.title}
                        </Link>
                        {activeTree === item.id ? (
                          <div className="btns">
                            <Tooltip title="删除模型">
                              <Icon
                                            type="delete"
                                            className="interface-delete-icon"
                                            onClick={e => {
                                                e.stopPropagation();
                                                this.showConfirm(item);
                                            }}
                                        />
                            </Tooltip>
                            <Tooltip title="复制模型">
                              <Icon
                                            type="copy"
                                            className="interface-delete-icon"
                                            onClick={e => {
                                                e.stopPropagation();
                                                this.copyInterfaceModel(item);
                                            }}
                                        />
                            </Tooltip>
                          </div>
                            ) : null}
                      </div>
                    }
                    key={'' + item.id}
                />
            );
        };
        return (
          <div>
            {searchBox}
            {editCat !== null ? (
              <Modal
                      title={editCat._id ? '修改分类' : '新增分类'}
                      visible={Boolean(editCat)}
                      onCancel={() => this.setState({editCat: null})}
                      footer={null}
                      className="addcatmodal"
                  >
                <AddInterfaceCatForm
                          catdata={this.state.editCat}
                          onCancel={() => this.setState({editCat: null})}
                          onSubmit={this.handleAddInterfaceModelCat}
                      />
              </Modal>
              ) : (
                  ''
              )}
            <div
                  className="tree-wrappper"
                  style={{maxHeight: parseInt(document.body.clientHeight) - headHeight + 'px'}}
              >
              <Tree
                      className="interface-list"
                      expandedKeys={this.getSelects(false)}
                      selectedKeys={this.getSelects(true)}
                      onExpand={this.onExpand}
                      draggable
                      onDrop={this.onDrop}
                  >
                <TreeNode className="item-all-interface"
                          title={
                            <div className="container-title"
                                   onClick={() => {
                                       this.props.history.push('/project/' + this.props.projectId + '/interface/projectModel/');
                                   }}
                              >

                              <Link
                                      onClick={e => {
                                          e.stopPropagation();
                                          this.changeExpands();
                                      }}
                                      to={'/project/' + matchParams.id + '/interface/projectModel'}
                                  >
                                <Icon type="folder" style={{marginRight: 5}}/>
                                      全部模型
                              </Link>
                            </div>

                                }
                                key="root"
                      />
                {
                    (catList || []).map(item => {
                              return (
                                <TreeNode
                                      title={
                                        <div className="container-title"
                                             onMouseEnter={() => this.setState({activeTree: item._id})}
                                             onMouseLeave={() => this.setState({activeTree: null})}
                                             onClick={() => {
                                                 this.props.history.push('/project/' + this.props.projectId + '/interface/projectModel/cat_' + item._id);
                                             }}
                                        >
                                          <Link
                                                  className="interface-item"
                                                  onClick={e => {
                                                      e.stopPropagation();
                                                  }}
                                                  to={'/project/' + matchParams.id + '/interface/projectModel/cat_' + item._id}
                                              >
                                            <Icon type="folder-open" style={{marginRight: 5}}/>
                                            {item.name}
                                          </Link>
                                          {
                                                  activeTree === item._id ? (<div className="btns">
                                                    <Tooltip title="删除分类">
                                                      <Icon
                                                              type="delete"
                                                              className="interface-delete-icon"
                                                              onClick={e => {
                                                                  e.stopPropagation();
                                                                  this.showDelCatConfirm(item);
                                                              }}
                                                          />
                                                    </Tooltip>
                                                    <Tooltip title="修改分类">
                                                      <Icon
                                                              type="edit"
                                                              className="interface-delete-icon"
                                                              onClick={e => {
                                                                  e.stopPropagation();
                                                                  this.setState({
                                                                      editCat: item
                                                                  })
                                                              }}
                                                          />
                                                    </Tooltip>
                                                    <Tooltip title="添加模型">
                                                      <Icon type="plus" className="interface-delete-icon"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            this.props.history.push('/project/' + matchParams.id + '/interface/projectModel/add?catId=' + item._id)
                                                        }}
                                                        />
                                                    </Tooltip>
                                                  </div>) : null
                                              }

                                        </div>
                                      }
                                      key={item._id}
                                      className={`interface-item-nav ${(item.list || []).length ? '' : 'cat_switch_hidden'}`}
                                  >
                                  {(item.list || []).map(itemInterfaceModelCreate)}
                                </TreeNode>
                              );
                          })}
              </Tree>
            </div>

          </div>
        );
    }
}

export default withRouter(InterfaceModel);
