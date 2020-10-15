import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../modal';

const getLocalStorageKey = (name, attrName = '') => `table-col-${name}-${attrName}`;

export default class ColConfig extends React.Component {
    constructor(props) {
        super(props);
        const { name } = this.props;

        this.state = {
            displayModal: false,
            width: localStorage.getItem(getLocalStorageKey(name, 'width')),
            textAlign: localStorage.getItem(getLocalStorageKey(name, 'textAlign')) ?? 'center',
        };
    }

    toggleModal = (e) => {
        if (e) e.preventDefault();

        this.setState({
            displayModal: !this.state.displayModal,
        });
    };

    handleSetWidth = (e) => {
        const { name } = this.props;
        const width = e.target.value;
        this.setState({ width });
        localStorage.setItem(getLocalStorageKey(name, 'width'), width);
    };

    handleSetTextAlign = (e) => {
        const { name } = this.props;
        const textAlign = e.target.value;
        this.setState({ textAlign });
        localStorage.setItem(getLocalStorageKey(name, 'textAlign'), textAlign);
    };

    render() {
        const modalBody = <>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" >Ширина</span>
                </div>
                <input type="text"
                    className="form-control"
                    placeholder="Ширина"
                    value={ this.state.width ? this.state.width : ''}
                    onChange={ this.handleSetWidth }
                />
            </div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" >Положение</span>
                </div>
                <input type="text"
                    className="form-control"
                    placeholder="Положение"
                    value={ this.state.textAlign ? this.state.textAlign : ''}
                    onChange={ this.handleSetTextAlign }
                />
            </div>
        </>;

        return <>
            <div
                title={ this.props.name }
                onClick={this.toggleModal}
                style={{
                    width: this.state.width,
                    textAlign: this.state.textAlign,
                    cursor: 'pointer',
                    overflow: 'hidden',
                }}>
                {this.props.name}
            </div>
            <Modal
                display = { this.state.displayModal }
                toggleModal = { this.toggleModal }
                header = {'Настройка столбца' }
                body = { modalBody }
                footer = { null }
            />
        </>;
    }
}

ColConfig.propTypes = {
    name: PropTypes.string.isRequired,
};
