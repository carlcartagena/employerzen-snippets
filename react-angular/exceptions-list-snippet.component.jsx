import React from 'react'
import { render } from 'react-dom'
import exceptionService from '@app/services/exceptions.service'
import { Pagination, Table, MenuItem } from 'react-bootstrap'

let siteStatus = process.env.NODE_ENV
class ExceptionsList extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            items: [],
            collectionTotalCount: 1,
            pageNumber: 1,
            itemsPerPage: 20
        }
        this.changePage = this.changePage.bind(this)
    }
    componentDidMount() {
        let pageSize = this.state.itemsPerPage
        let objectStart = 0
        exceptionService.readAllExt(pageSize, objectStart)
            .then(
                (data) => {
                    this.setState({
                        items: data.items,
                        collectionTotalCount: data.collectionTotalCount
                    })
                })
    }

    changePage(event, pageNumber) {
        let pageSize = this.state.itemsPerPage
        if (event.target) {
            if (event.target.value) {
                pageSize = event.target.value
            }
        }
        let pageNumberChange = pageNumber || 1
        let objectStart = pageSize * ((pageNumber - 1) || 0)

        if (this.state.items[0]) {
            exceptionService.readAllExt(pageSize, objectStart)
                .then(
                    (data) => {
                        this.setState({
                            items: data.items,
                            collectionTotalCount: data.collectionTotalCount,
                            pageNumber: pageNumberChange,
                            itemsPerPage: pageSize
                        })
                    })
        }
    }

    render() {
        const rowData = this.state.items ?
            this.state.items.map(
                (data) => {
                    return (
                        <tr key={data._id}>
                            <td>
                                {data._id}
                            </td>
                            <td>
                                {data.type}
                            </td>
                            <td>
                                {data.error}
                            </td>
                            <td>
                                {data.createDate}
                            </td>
                        </tr>
                    )
                }) : <div>Loading...</div>

        let collectionTotalCount = this.state.collectionTotalCount
        let paginationCenterItems = []
        let active = this.state.pageNumber
        let pageSize = this.state.itemsPerPage

        if (pageSize < collectionTotalCount) {
            for (let i = 1; (i <= (Math.ceil(collectionTotalCount / pageSize))); i++) {
                paginationCenterItems.push(
                    <Pagination.Item
                        key={i}
                        active={i === active}
                        onClick={() => {
                            this.changePage(pageSize, i)
                        }}
                    >
                        {i}
                    </Pagination.Item>
                )
            }
        }

        let itemsPerPageSelectValues = [
            10,
            30,
            50,
            100
        ]

        if (siteStatus === 'development') {
            itemsPerPageSelectValues = [
                1,
                10,
                20,
                50,
                100,
                200,
                500,
                1000,
                2000,
                5000,
                10000
            ]
        }

        const itemsPerPageSelectOptions = itemsPerPageSelectValues ?
            itemsPerPageSelectValues.map(
                (data) => {
                    return (
                        <option
                            key={data}
                            value={data}
                        >
                            {data}
                        </option>
                    )
                }) : <option>empty</option>
        return (
            <div
                className="panel container"
                style={{
                    width: '100%'
                }}
            >
                <div
                    className="panel-body"
                >
                    <div>
                        There are
                        &nbsp;
                            {collectionTotalCount}
                        &nbsp;
                        items in this collection.
                </div>
                    <br />
                    items per page
                    &nbsp;
                    <select
                        value={this.state.itemsPerPage}
                        onChange={this.changePage}
                    >
                        {itemsPerPageSelectOptions}
                    </select>
                    <br />
                    <Pagination

                    >
                        <Pagination.First
                            onClick={
                                () => {
                                    this.changePage(pageSize, (1))
                                }}
                        />
                        <Pagination.Prev
                            onClick={
                                () => {
                                    if (this.state.pageNumber !== 1) {
                                        this.changePage(pageSize, (this.state.pageNumber - 1))
                                    }
                                }}
                        />
                        {paginationCenterItems}
                        <Pagination.Next
                            onClick={
                                () => {
                                    if (this.state.pageNumber !== Math.ceil(collectionTotalCount / pageSize)) {
                                        this.changePage(pageSize, (this.state.pageNumber + 1))
                                    }
                                }}
                        />
                        <Pagination.Last
                            onClick={
                                () => {
                                    this.changePage(pageSize, Math.ceil(collectionTotalCount / pageSize))
                                }}
                        />
                    </Pagination>
                    <Table striped bordered condensed hover>
                        <thead>
                            <tr>
                                <th>_id</th>
                                <th>Type</th>
                                <th>Error</th>
                                <th>Update Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowData}
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
}

export default ExceptionsList
