import React from 'react';
import PropTypes from 'prop-types';

const modalSize = {
    default: '',
    large: 'modal-lg',
    small: 'modal-sm',
};

export default class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.modalRef = React.createRef();
    }

    handleClickOverlay = (e) => {
        if (!e.target.contains(this.modalRef.current)) {
            return;
        }
        const { toggleModal } = this.props;
        toggleModal();
    };

    changeBodyClass = (display) => {
        if (display) {
            document.body.classList.add('modal-open');
            return;
        }
        document.body.classList.remove('modal-open');
    };

    handlePressEsc = (e) => {
        const { key } = e;
        if (key !== 'Escape') {
            return;
        }
        if (this.props.display) {
            this.props.toggleModal();
        }
    };

    componentWillUnmount() {
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', this.handlePressEsc);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handlePressEsc);
    }

    render() {
        const {
            display, toggleModal, header, body, footer,
        } = this.props;
        this.changeBodyClass(display);

        return (
            <>
                <div
                    className={display
                        ? 'modal-backdrop fade show d-block'
                        : ''
                    }
                />
                <div
                    className={display
                        ? 'modal__overlay modal d-block'
                        : 'modal__overlay modal d-none'
                    }
                    data-overlay='true'
                    onMouseDown={this.handleClickOverlay}
                >

                    <div
                        ref={this.modalRef}
                        className={`modal-dialog modal-react ${modalSize[this.props.size]}`}
                    >
                        <div className="modal-content">
                            { header
                                ? <div className="modal-header">
                                    <h4 className="modal-title">{header}</h4>
                                    <button type="button" className="close" onClick={toggleModal}>
                                        <span className="glyphicon glyphicon-remove"/>
                                    </button>
                                </div>
                                : null }
                            { body
                                ? <div className="modal-body">{body}</div>
                                : null }
                            { footer
                                ? <div className="modal-footer">{footer}</div>
                                : null }
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

Modal.defaultProps = {
    size: 'default',
};

Modal.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    display: PropTypes.bool.isRequired,
    header: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    body: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    footer: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
    ]),
    size: PropTypes.string,
};
