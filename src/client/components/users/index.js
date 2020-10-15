import React from 'react';
import axios from "axios";
import { clientHost } from "../../../config";
import { pages } from "../navbar";
import { uniqID } from "../../../common/helpers";
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            newUser: '',
        };

        this.getUsers();
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

    handleUpdateUser = (e) => {
        this.setState({ newUser: e.target.value });
    };

    handleAddUser = () => {
        const name = this.state.newUser;
        const id = uniqID();
        axios
            .post(clientHost + '/users/' + id, {
                name
            })
            .then(() => {
                this.getUsers();
                this.setState({ newUser: '' });
            })
    };

    handleDeleteUser = (id) => (e) => {
        e.preventDefault();
        axios
            .delete(clientHost +  '/users/' + id)
            .then(() => {
                this.getUsers();
            })
    };

    handleUpdateUserColor = (id) => (colorsData) => {
        console.log(colorsData.color);
        axios
            .post(clientHost + '/users/' + id, {
                color: colorsData.color,
            })
            .then(() => {
                this.getUsers();
            })
    };

    render() {
        return <div className={ 'container' }>
            <h1>{ pages.users.name }</h1>
            <ul className="list-group mb-4">
                {this.state.users.map((user) => <li
                    key={user.id}
                    className="list-group-item"
                >
                    <span className={'mr-3'}>
                        <ColorPicker
                        color = {user.color ? user.color : '#fff'}
                        onClose = {this.handleUpdateUserColor(user.id)}
                        />
                    </span>
                    {user.name}
                    <a
                        className={'float-right'}
                        href={'#'}
                        onClick={this.handleDeleteUser(user.id)}
                        >
                        <span className={'glyphicon glyphicon-trash'}/>
                    </a>
                </li>)}
            </ul>
            <div className="list-group">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Новый пользователь"
                        value={this.state.newUser}
                        onChange={this.handleUpdateUser}
                    />
                        <div className="input-group-append">
                            <button
                                className="input-group-text"
                                onClick={this.handleAddUser}
                            >Добавить</button>
                        </div>
                </div>
            </div>
        </div>;
    }
}