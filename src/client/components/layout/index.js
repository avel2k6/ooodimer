import React from 'react';
import Navbar, { pages } from "../navbar";
import Biddings from "../biddings";
import Users from "../users";


const config = {
    defaultPage: pages.biddings.type,
};

export default class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: config.defaultPage,
        }
    }

    handleChangePage = (newPage) => (e) => {
        e.preventDefault();
        this.setState( {currentPage: newPage} );
    };

    getPage = () => {
      const pageFactory = {
          [pages.biddings.type]: () => <Biddings />,
          [pages.users.type]: () => <Users />,
      };

      const currentPage = this.state.currentPage;
      return pageFactory[currentPage]();
    };

    render() {
        return <>
            <Navbar
                handleChangePage = {this.handleChangePage}
                currentPage = {this.state.currentPage}
            />
            <div className='p-1'>
                {this.getPage()}
            </div>
        </>;
    }
}