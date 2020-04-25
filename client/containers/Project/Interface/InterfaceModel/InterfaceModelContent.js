import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router';
import {Button, Modal, Tabs } from 'antd'
const { TabPane } = Tabs;
import {
    detail,
    updateInterfaceModel,
    saveInterfaceModel
} from '../../../../reducer/modules/interfaceModel.js';
import ModelView from "./ModelView";
import ModelEdit from "./ModelEdit";
@connect(
    state => {
        return {
            ...state.model
        };
    },
    {
        detail,
        updateInterfaceModel,
        saveInterfaceModel
    }
)
@withRouter
export default class InterfaceColMenu extends Component {
    static propTypes = {
        match: PropTypes.object,
        projectId: PropTypes.string,
        history: PropTypes.object,
        location: PropTypes.object,
        router: PropTypes.object,
        pageType: PropTypes.string
    };

    state = {
        editStatus: false,
        visible: false
    };

    constructor(props) {
        super(props);
    }
    // 离开编辑页面的提示
    showModal = () => {
        this.setState({
            visible: true
        });
    };
    // 取消离开编辑页面
    handleCancel = () => {
        this.setState({
            visible: false
        });
    };

    render() {
        const { pageType } = this.props;
        const defaultActiveKey = pageType === 'add' ? 'edit' : 'view'
        let InterfaceTabs = {
            detail: {
                component: ModelView,
                name: '预览'
            },
            edit: {
                component: ModelEdit,
                name: '编辑'
            }
        };
        const tabs = (
          <Tabs
                className="tabs-large"
                defaultActiveKey={defaultActiveKey}
            >
            {Object.keys(InterfaceTabs).map(key => {
                    let item = InterfaceTabs[key];
                    let C = item.component;
                return <TabPane tab={item.name} key={key} ><C {...this.props} /></TabPane>;
                })}
          </Tabs>
        );
        return (
          <div className="interface-content">
            <Prompt
                    when={pageType === 'add'}
                    message={() => {
                        return '离开页面会丢失当前编辑的内容，确定要离开吗？';
                    }}
                />
            {tabs}
            {this.state.visible && (
            <Modal
                        title="你即将离开编辑页面"
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        footer={[
                          <Button key="back" onClick={this.handleCancel}>
                                取 消
                          </Button>,
                          <Button key="submit" onClick={this.handleOk}>
                                确 定
                          </Button>
                        ]}
                    >
              <p>离开页面会丢失当前编辑的内容，确定要离开吗？</p>
            </Modal>
                )}
          </div>
        )
    }
}
