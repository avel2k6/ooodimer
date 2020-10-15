import React from 'react';
import moment from "moment";
import axios from "axios";
import { clientHost } from "../../../config";
import format from "number-format.js";
import BiddingType from "../biddingType";

const config = {
  propsUpdateInteval: 120*1000,
};

const types = [
    {key: 1, value: 'Значение'},
];

export default class Bidding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.bidding.type,
            comment: this.props.bidding.comment,
            user: this.props.bidding.user,
            selfPrice: this.props.bidding.selfPrice,
            dateDelivery: this.props.bidding.dateDelivery,
            datePayment: this.props.bidding.datePayment,
            deliveryPlace: this.props.bidding.deliveryPlace,
        };
        setInterval(()=> {
            this.updateOldProps();
        }, config.propsUpdateInteval)
    }

    /**
     * Принудительно обновляем стейт на свежие пропсы
     */
    updateOldProps = () =>  {
        this.setState({
            comment: this.props.bidding.comment,
            user: this.props.bidding.user,
            selfPrice: this.props.bidding.selfPrice,
            dateDelivery: this.props.bidding.dateDelivery,
            datePayment: this.props.bidding.datePayment,
            deliveryPlace: this.props.bidding.deliveryPlace,
        })
    };

    replaceCompanyName = (string) => {
        let str = string;
        str = str.toLowerCase();
        const replaceCollection = [
            {target: 'муниципальное ', new: 'М'},
            {target: 'бюджетное ', new: 'Б'},
            {target: 'государственное ', new: 'Г'},
            {target: 'общеобразовательное ', new: 'О'},
            {target: 'образовательное ', new: 'О'},
            {target: 'учреждение ', new: 'У '},
            {target: 'казенное ', new: 'К'},
            {target: 'автономное ', new: 'А'},
            {target: 'профессиональное ', new: 'П'},
            {target: 'дошкольное ', new: 'Д'},
        ];
        replaceCollection.forEach((rule) => {
            str = str.replace(rule.target, rule.new);
        });


        return str;
    };

    handleLikeBidding = (id, like) => (e) => {
        e.preventDefault();
        const likeState = like ? false : true;
        axios
            .post(clientHost + '/biddings/' + id, {id: id, like: likeState})
            .then(() => {
                this.props.getBiddings();
            });
    };

    handlePinBidding = (id, pin) => (e) => {
        e.preventDefault();
        const pinState = pin ? false : true;
        axios
            .post(clientHost + '/biddings/' + id, {id: id, pin: pinState})
            .then(() => {
                this.props.getBiddings();
            });
    };

    handleChangeCommentBidding = (id) => (e) => {
        const value = e.target.value;
        this.setState({ comment: value });
        axios
            .post(clientHost + '/biddings/' + id, {comment: value})
    };

    handleChangeSelfPriceBidding = (id) => (e) => {
        const selfPrice = e.target.value * 1;
        this.setState({ selfPrice: selfPrice });
        axios
            .post(clientHost + '/biddings/' + id, {selfPrice: selfPrice})
    };

    handleChangeDateDeliveryBidding = (id) => (e) => {
        const dateDelivery = e.target.value;
        this.setState({ dateDelivery: dateDelivery });
        axios
            .post(clientHost + '/biddings/' + id, {dateDelivery: dateDelivery})
    };


    handleChangeDatePaymentBidding = (id) => (e) => {
        const datePayment = e.target.value;
        this.setState({ datePayment: datePayment });
        axios
            .post(clientHost + '/biddings/' + id, {datePayment: datePayment})
    };

    handleChangeDeliveryPlaceBidding = (id) => (e) => {
        const deliveryPlace = e.target.value;
        this.setState({ deliveryPlace: deliveryPlace });
        axios
            .post(clientHost + '/biddings/' + id, {deliveryPlace: deliveryPlace})
    };


    handleChangeUserBidding = (id) => (e) => {
        const value = e.target.value;
        this.setState({ user: value });
        axios
            .post(clientHost + '/biddings/' + id, {user: value})
    };

    handleChangeTypeBidding = (id, value) => {
        this.setState({ type: value });
        axios
            .post(clientHost + '/biddings/' + id, {type: value})
    };

    handleDeleteBidding = (id) => (e) => {
        axios
            .post(clientHost + '/biddings/' + id, {deleted: true})
            .then(() => {
                this.props.getBiddings();
            });
    };

    handleOpenLink = (link) => (e) => {
        e.preventDefault();
        axios
            .post(clientHost + '/link/', {link})
    };

    handleClickCustomer = (customer) => (e) => {
        e.preventDefault();
        e.target.value = customer;
        this.props.handleFilterCustomer(e);
    };

    getColor = () => {
      if (this.props.users.length === 0) {
          return null;
      }
      if (!this.state.user) {
          return null;
      }
      const currentUser = this.props
            .users
            .find((user) => user.id === this.state.user);
      return currentUser ? currentUser.color : null;
    };

    render() {
        const bidding = this.props.bidding;
        const rowStyle = {
            height: '30px',
            whiteSpace: 'nowrap',
            background: this.getColor(),
        };
        const colStyle = {
            overflow: 'hidden',
            maxWidth: '300px',
        };

        const rowDateStyle = {
            width: '100%',
        };



        // const dateObj = moment(bidding.date);
        // const date = dateObj.format("d/M/Y HH:mm");
        const dateStart = moment(bidding.dateStart).format('DD.MM.YYYY');
        const dateEnd = moment(bidding.dateEnd).format('DD.MM.YYYY H:mm');

        return <tr style={rowStyle}>
            <td style={{
                ...colStyle,
            }} title={bidding.name}>
                {bidding.id}
            </td>
            <td>
                <select
                    value={this.state.user}
                    onChange={this.handleChangeUserBidding(bidding.id)}
                >
                    <option key={'0'}>-</option>
                    {this.props.users.map((user) => <option
                        key={user.id}
                        value={user.id}
                    >{user.name}</option>)}
                </select>
            </td>
            <td title={bidding.name}>
                <div style={{whiteSpace: 'normal' }}>{bidding.name}</div>
            </td>
            <td title={bidding.customer}>
                <div style={{whiteSpace: 'normal' }}>
                    <a
                        href={'#'}
                        onClick={this.handleClickCustomer(bidding.customer)}>
                        {this.replaceCompanyName(bidding.customer)}
                    </a>
                </div>
            </td>
            <td>
                <div><BiddingType
                    type = {bidding.type}
                    id = {bidding.id}
                    handleChangeTypeBidding = {this.handleChangeTypeBidding}
                /></div>
            </td>
            <td style={{
                ...colStyle,
            }}>
                <a
                    href={'#'}
                    target={'_blank'}
                    onClick={this.handleOpenLink(bidding.url)}
                ><span
                    className={'glyphicon glyphicon-link'}></span></a>
            </td>
            <td>
                {dateStart}
            </td>
            <td>
                {dateEnd}
            </td>
            <td style={{
                ...colStyle,
            }}>
                {format( "# ###.00", bidding.priceStart)}
            </td>
            <td>
                <input
                    style={rowDateStyle}
                    value={this.state.selfPrice}
                    onChange={this.handleChangeSelfPriceBidding(bidding.id)}/>
            </td>
            <td>
                {format( "# ###." , this.state.selfPrice ? Math.floor(bidding.priceStart - this.state.selfPrice) : '')}
            </td>
            <td>
                {this.state.selfPrice ? Math.floor((bidding.priceStart - this.state.selfPrice) * 100/bidding.priceStart ) : ''}
            </td>
            <td>
                <input
                    style={rowDateStyle}
                    type="date"
                    value={this.state.dateDelivery}
                    onChange={this.handleChangeDateDeliveryBidding(bidding.id)}/>
            </td>
            <td>
                <input
                    style={rowDateStyle}
                    type="date"
                    value={this.state.datePayment}
                    onChange={this.handleChangeDatePaymentBidding(bidding.id)}/>
            </td>
            <td>
                <input
                    value={this.state.deliveryPlace}
                    onChange={this.handleChangeDeliveryPlaceBidding(bidding.id)}/>
            </td>
            <td>
                <textarea
                    style={{width: '100%'}}
                    value={this.state.comment}
                    onChange={this.handleChangeCommentBidding(bidding.id)}/>
            </td>
            <td>
                <a
                    className={bidding.pin ? 'text-success' : 'text-primary'}
                    href={'#'}
                    onClick={this.handlePinBidding(bidding.id, bidding.pin)}>
                    <span className={'glyphicon glyphicon-pushpin'}></span>
                </a>
            </td>
            <td>
                <a
                    className={bidding.like ? 'text-success' : 'text-primary'}
                    href={'#'}
                    onClick={this.handleLikeBidding(bidding.id, bidding.like)}>
                    <span className={'glyphicon glyphicon-heart'}></span>
                </a>
            </td>
            <td>

                <a
                    className={'text-primary'}
                    href={'#'}
                    onClick={this.handleDeleteBidding(bidding.id)}>
                    <span className={'glyphicon glyphicon-trash'}></span>
                </a>
            </td>
        </tr>;
    }
}
