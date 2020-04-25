import React, {PureComponent as Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {detail, saveInterfaceModel, updateInterfaceModel} from '../../../../reducer/modules/interfaceModel.js';
import '../InterfaceList/Edit.scss';
import {withRouter} from 'react-router-dom';
import ErrMsg from "../../../../components/ErrMsg/ErrMsg";

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
class ModelView extends Component {
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
        let {modelDetail} = this.state;
        return (
          <div>
            {modelDetail ?
                    (
                      <div>
                            模型详情
                      </div>
                    )
                    : <ErrMsg type="noData"/>
                }
          </div>
        );
    }
}

export default withRouter(ModelView);
