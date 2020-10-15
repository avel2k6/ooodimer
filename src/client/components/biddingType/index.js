import React from "react";
import Modal from "../modal";

const defaultTypes = [
    {col: 1, key: '1_1', value: 'Поставка общестрой'},
    {col: 1, key: '1_2', value: 'Поставка электрики'},
    {col: 1, key: '1_3', value: 'Поставка видеонаблюдения'},
    {col: 1, key: '1_4', value: 'Поставка АПС'},
    {col: 2, key: '2_1', value: 'Текущий ремонт'},
    {col: 2, key: '2_2', value: 'Установка электрики'},
    {col: 2, key: '2_3', value: 'Установка видеонаблюдения'},
    {col: 2, key: '2_4', value: 'Установка АПС'},
    {col: 3, key: '3_1', value: 'КТО'},
    {col: 3, key: '3_2', value: 'Обслуживание электрики'},
    {col: 3, key: '3_3', value: 'Обслуживание видеонаблюдения'},
];

export default class BiddingType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayModal: false,
            types: this.props.type ?? [],
        };
    }

    toggleModal = (e) => {
        if (e) e.preventDefault();

        this.setState({
            displayModal: !this.state.displayModal,
        })
    };

    getTypesString = () => {
        return defaultTypes
            .filter((type) => this.state.types.includes(type.key))
            .map((type) => <div key={type.key}>{type.value}</div>)
    };

    handleChange = (key) => (e) => {
        console.log(key);
        console.log(e.target.checked);
        if (e.target.checked) {
            this.setState({
                types: [...this.state.types, key]
            },
                () => {
                    this.props.handleChangeTypeBidding(this.props.id, this.state.types);
                });
            return;
        }
        this.setState({
            types: this.state.types.filter((type) => type !== key),
        },
            () => {
                this.props.handleChangeTypeBidding(this.props.id, this.state.types);
            });
    };

    render () {
        const modalBody = <>
            <div className="row">
                <div className="col-sm">
                    {defaultTypes
                        .filter((type) => type.col === 1 )
                        .map((type) => {
                        return <div key={type.key}>
                            <input
                                type={'checkbox'}
                                onChange={this.handleChange(type.key)}
                                checked={this.state.types.includes(type.key)}/> {type.value}
                        </div>
                    })}
                </div>
                <div className="col-sm">
                    {defaultTypes
                        .filter((type) => type.col === 2 )
                        .map((type) => {
                            return <div key={type.key}>
                                <input
                                    type={'checkbox'}
                                    onChange={this.handleChange(type.key)}
                                    checked={this.state.types.includes(type.key)}/> {type.value}
                            </div>
                        })}
                </div>
                <div className="col-sm">
                    {defaultTypes
                        .filter((type) => type.col === 3 )
                        .map((type) => {
                            return <div key={type.key}>
                                <input
                                    type={'checkbox'}
                                    onChange={this.handleChange(type.key)}
                                    checked={this.state.types.includes(type.key)}/> {type.value}
                            </div>
                        })}
                </div>
            </div>
        </>;

        return <>
            <div
                title={ 'Тип для: ' + this.props.id }
                onClick={this.toggleModal}
                style={{
                    cursor: 'pointer',
                }}>
                {this.state.types.length ? this.getTypesString() : '-'}
            </div>
            <Modal
                size = {'large'}
                display = { this.state.displayModal }
                toggleModal = { this.toggleModal }
                header = {'Тип для: ' + this.props.id }
                body = { modalBody }
                footer = { null }
            />
        </>
    }
};