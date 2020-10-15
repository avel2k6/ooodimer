import React from 'react';
import axios from "axios";
import { clientHost } from "../../../config";
import Bidding from '../bidding';
import ColConfig from "../colConfig";
import './index.styl';

const config = {
    updateInterval: 30 * 1000,
    allowedIndex: 50,
};

export default class Biddings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            biddings: [],
            users: [],
            allowedIndex: config.allowedIndex,
            filterName: null,
            filterCustomer: null,
        };

        this.timeout = setTimeout(() => {
            this.getBiddings();
            this.getUsers();
        });

        this.interval = setInterval(() => {
            this.getBiddings();
            this.getUsers();
        }, 60000);

    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
        clearInterval(this.interval);
    }


    getBiddings = () => {
        axios
            .get(clientHost + '/biddings/')
            .then((response) => {
                this.setState({
                    biddings: response.data,
                })
            }).catch((error) => {
            console.log(error);
        });
    };

    filterBiddings = (biddings) => {
        return biddings
            .filter((bidding) => {
                if (this.state.filterName) {
                    return (bidding.name.toLowerCase().includes(this.state.filterName.toLowerCase()));
                }
                return true;
            })
            .filter((bidding) => {
                if (this.state.filterCustomer) {
                    return (bidding.customer.toLowerCase().includes(this.state.filterCustomer.toLowerCase()));
                }
                return true;
            });
    };

    handleAddAllowedIndex = (e) => {
        e.preventDefault();
        const allowedIndex = this.state.allowedIndex + config.allowedIndex;
        this.setState({ allowedIndex });
    };

    getUsers = () => {
        axios
            .get(clientHost + '/users/')
            .then((response) => {
                this.setState({
                    users: response.data,
                })
            }).catch((error) => {
            console.log(error);
        });
    };

    handleFilterName = (e) => {
        const value = e.target.value;
        this.setState({ filterName: value });
    };

    handleFilterCustomer = (e) => {
        const value = e.target.value;
        this.setState({ filterCustomer: value });
    };

    render() {
        const tableStyle = {
            fontSize: '13px',
            textOverflow: 'ellipsis',
        };
        const pinnedBiddings = this.filterBiddings(this.state.biddings
            .filter((bidding) => bidding.pin));

        const otherBidding = this.filterBiddings(this.state.biddings
            .filter((bidding) => !bidding.pin));

        return <div>
            <div style = { {overflowX: 'scroll', overflowY: 'hidden', maxWidth: '100%'} }>
                <table className={'table table-striped table-sm table-hover biddings__table'} style={tableStyle}>
                    <tbody>
                        <tr className="font-weight-bold bg-info">
                            <td><ColConfig name={'№'}/></td>
                            <td><ColConfig name={'Ответсвенный'}/></td>
                            <td><ColConfig name={'Наименование'}/></td>
                            <td><ColConfig name={'Заказчик'}/></td>
                            <td><ColConfig name={'Тип'}/></td>
                            <td><span className={'glyphicon glyphicon-link'}></span></td>
                            <td><ColConfig name={'Начало'}/></td>
                            <td><ColConfig name={'Окончание'}/></td>
                            <td title={'Начальная максимальная цена контракта'}><ColConfig name={'НМЦК'}/></td>
                            <td><ColConfig name={'Себестоимость'}/></td>
                            <td><ColConfig name={'Прибыль Р'}/></td>
                            <td><ColConfig name={'Прибыль %'}/></td>
                            <td><ColConfig name={'Срок поставки'}/></td>
                            <td><ColConfig name={'Срок оплаты'}/></td>
                            <td><ColConfig name={'Место поставки'}/></td>
                            <td><ColConfig name={'Комментарий'}/></td>
                            <td title="Закрепить"><span className={'glyphicon glyphicon-pushpin'}></span></td>
                            <td title="Выиграли"><span className={'glyphicon glyphicon-heart'}></span></td>
                            <td title="Удалить"><span className={'glyphicon glyphicon-trash'}></span></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td>
                                <input
                                    className={'w-100'}
                                    value={this.state.filterName ? this.state.filterName : '' }
                                    onChange={this.handleFilterName}/>
                            </td>
                            <td>
                                <input
                                    className={'w-100'}
                                    value={this.state.filterCustomer ? this.state.filterCustomer : '' }
                                    onChange={this.handleFilterCustomer}/>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        {pinnedBiddings.filter((bidding) => !bidding.deleted)
                            .map((bidding) => {
                                return (<Bidding
                                    key={bidding.id}
                                    bidding = { bidding }
                                    users = { this.state.users }
                                    getBiddings = {this.getBiddings}
                                    handleFilterCustomer = {this.handleFilterCustomer}
                                />);
                        })}
                        {otherBidding.filter((bidding) => !bidding.deleted)
                            .map((bidding) => {
                                return (<Bidding
                                    key={bidding.id}
                                    bidding = { bidding }
                                    users = { this.state.users }
                                    getBiddings = {this.getBiddings}
                                    handleFilterCustomer = {this.handleFilterCustomer}
                                />);
                            })
                            .filter((bidding, index) => {
                                return index < this.state.allowedIndex;
                            })}
                    </tbody>
                </table>
            </div>

            {(otherBidding.length > this.state.allowedIndex)
                ? <div  className="d-flex p-4 justify-content-center"><button
                    className={"btn btn-success"}
                    onClick={this.handleAddAllowedIndex}
                >Показать еще {config.allowedIndex}</button></div>
                : null }

            {this.state.biddings.length === 0 ? <div className={'container'}>
                <div className="d-flex justify-content-center">
                    <span className="mx-auto spinner-border" />
                </div>
                <div className="d-flex justify-content-center">
                    <h4>Беру свежие миники с сервера </h4>
                </div>
            </div> : null}
        </div>;
    }
}
