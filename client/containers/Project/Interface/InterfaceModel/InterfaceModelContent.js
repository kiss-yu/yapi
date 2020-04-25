import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
@connect(
    state => {
        return {
            interfaceColList: state.interfaceCol.interfaceColList,
            currCase: state.interfaceCol.currCase,
            isRander: state.interfaceCol.isRander,
            currCaseId: state.interfaceCol.currCaseId,
            // list: state.inter.list,
            // 当前项目的信息
            curProject: state.project.currProject
            // projectList: state.project.projectList
        };
    },
    {
    }
)
@withRouter
export default class InterfaceColMenu extends Component {

    state = {
        colModalType: '',
        colModalVisible: false,
        editColId: 0,
        filterValue: '',
        importInterVisible: false,
        importInterIds: [],
        importColId: 0,
        expands: null,
        list: [],
        delIcon: null,
        selectedProject: null
    };

    constructor(props) {
        super(props);
    }

    render() {
        return <div>1234</div>
    }
}
