import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { clientHost } from '../../../config';

const config = {
    updateInterval: 60000,
};

export const pages = {
    // main: { name: 'Главная', type: 'main'},
    biddings: { name: 'Миники', type: 'biddings' },
    users: { name: 'Пользователи', type: 'users' },
};

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            biddingsCount: 0,
        };

        setTimeout(() => { this.getBiddings(); });
        setInterval(() => { this.getBiddings(); }, config.updateInterval);
    }

    getBiddings = () => {
        axios
            .get(`${clientHost}/biddings/`)
            .then((response) => {
                const biddings = response.data.filter((bidding) => !bidding.deleted);
                this.setState({
                    biddingsCount: biddings.length,
                });
            }).catch((error) => {
                console.log(error);
            });
    };

    render() {
        return <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
            <a className="navbar-brand" href="#">OOO Dimer</a>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav mr-auto">
                    {Object.keys(pages).map((page) => <li
                        key={page}
                        className={page === this.props.currentPage ? 'nav-item active' : 'nav-item'}>
                        <a
                            className="nav-link"
                            href={'#'}
                            onClick={this.props.handleChangePage(page)}
                        >{pages[page].name}
                            {page === pages.biddings.type ? <span className="badge badge-light ml-2">{this.state.biddingsCount}</span> : null}
                        </a>
                    </li>)}
                </ul>
            </div>
        </nav>;
    }
}

Navbar.propTypes = {
    currentPage: PropTypes.string.isRequired,
    handleChangePage: PropTypes.func.isRequired,
};
