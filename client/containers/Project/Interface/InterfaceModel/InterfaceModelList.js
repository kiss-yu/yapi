import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from "prop-types";
@connect(
    state => {
        return {
            ...state.model
        };
    },
    {
    }
)
@withRouter
export default class InterfaceColMenu extends Component {
    static propTypes = {
        match: PropTypes.object,
        projectId: PropTypes.string,
        history: PropTypes.object,
        location: PropTypes.object,
        router: PropTypes.object
    };

    state = {

    };

    constructor(props) {
        super(props);
    }

    render() {
        return <div>InterfaceModelList</div>
    }
}
