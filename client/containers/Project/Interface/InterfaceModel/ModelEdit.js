import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    detail,
    updateInterfaceModel,
    saveInterfaceModel
} from '../../../../reducer/modules/interfaceModel.js';
import '../InterfaceList/Edit.scss';
import { withRouter } from 'react-router-dom';

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
class ModelEdit extends Component {
    static propTypes = {
        match: PropTypes.object,
        projectId: PropTypes.string,
        history: PropTypes.object,
        location: PropTypes.object,
        router: PropTypes.object,
        pageType: PropTypes.string
    };

    state = {
        modelDetail: null
    };

    constructor(props) {
        super(props);
    }


    render() {
        let { pageType } = this.props;
        let { modelDetail } = this.state;
        return (
          <div className="interface-edit">
            {pageType === 'edit' && !modelDetail ? '正在加载，请耐心等待...' : ''}
          </div>
        );
    }
}

export default withRouter(ModelEdit);
