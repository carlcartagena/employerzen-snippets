import React from 'react'
import leadService from '@app/services/lead.service'
import LeadStatus from '@app/constants/lead-status.js'
import tostada from '@app/helpers/Tostada.js'
import NotificationSystem from 'react-notification-system'
import LeadStatusChangeNotes from './lead-status-change-notes.component.jsx'

function postMessage(messageData) {
    parent.postMessage(messageData, "*")
}
class LeadStatusChange extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            item: {
                type: "",
                status: "",
                contact: {
                    email: ""
                },
                company: {
                    name: "",
                    city: "",
                    state: ""
                },
                leadIdDataExt: {
                    paymentType: "",
                    paymentAmount: "",
                    description: ""
                },
                notes: ""

            },
            statusMessage: 'Are you sure you want to change the status ?',
            selectedLeadStatus: null,
            textLeadStatus: null
        }
        this.updateLeadStatus = this.updateLeadStatus.bind(this)
        this.undoChangesButton = this.undoChangesButton.bind(this)
        this.onClick = this.onClick.bind(this)
    }
    componentDidMount() {
        leadService.readByIdExt(this.props.leadsEditId)
            .then(
                (data) => {
                    this.setState({
                        item: data.item
                    })
                })
    }
    componentWillUnmount() {
        this.setState({
            item: null,
            statusMessage: null,
            selectedLeadStatus: null,
            textLeadStatus: null
        })
    }
    onClick(leadStatusName) {
        this.setState({
            selectedLeadStatus: leadStatusName,
            textLeadStatus: leadStatusName
        })
    }

    updateLeadStatus(e) {
        let changedStatus = null
        e.formData.date = new Date()
        const formData = e.formData
        if (this.state.selectedLeadStatus) {
            changedStatus = this.state.selectedLeadStatus
        }
        else {
            changedStatus = this.props.selectedStatus
        }
        leadService.updateStatus(this.props.leadsEditId, { 'status': changedStatus })
            .then(
                () => {
                    postMessage(changedStatus)
                    leadService.addNotes(this.props.leadsEditId, formData)
                        .then(data => {
                        })

                        .catch(err => {
                            console.log(err)
                        })
                })
            .catch(tostada.toaster({
                message: 'Error updating status',
                level: 'error'
            }))

    }
    undoChangesButton() {
        let frame = window.parent.document.getElementById('iFrame')
        frame.click()
    }
    render() {
        let boxClassState = ''
        let buttonClassState = ''
        let buttonStatusState = ''
        const leadStatusBoxes = LeadStatus.ALL.map(
            (leadStatusName) => {
                let selectedStatus = this.state.selectedLeadStatus
                let selectedOriginalStatus = this.props.selectedStatus
                if (selectedOriginalStatus == leadStatusName) {
                    boxClassState = 'pricing-table popular'
                    buttonClassState = 'btn btn-primary'
                    buttonStatusState = 'CURRENT'
                }
                else {
                    if (selectedStatus == leadStatusName) {
                        boxClassState = 'pricing-table popular-green'
                        buttonClassState = 'btn btn-success'
                        buttonStatusState = 'SELECTED'
                    }
                    else {
                        boxClassState = 'pricing-table'
                        buttonClassState = 'btn btn-default'
                        buttonStatusState = 'SELECT'
                    }
                }
                return (
                    <div
                        key={leadStatusName}
                        className="col-md-2"
                    >
                        <div
                            className={boxClassState}
                        >
                            <div
                                className="plan-title"
                            >
                                {leadStatusName}
                            </div>
                            <div
                                className="plan-price"
                            >

                                <span>

                                </span>
                            </div>
                            <div
                                className="plan-buy text-center"
                            >
                                <a
                                    className={buttonClassState}
                                    onClick={() => this.onClick(leadStatusName)}
                                >
                                    {buttonStatusState}
                                </a>
                            </div>
                        </div>
                    </div>
                )
            }
        )
        return (
            <div>
                <NotificationSystem
                    ref={
                        (notificationSystem) => {
                            tostada.setRef(notificationSystem)
                        }}
                />
                <section >
                    <div id="content" className="padding-20">
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-md-9">
                                        <h1 className="lead">
                                            {this.state.statusMessage}
                                        </h1>
                                        <p>
                                            &nbsp;
                                            The current status is
                                            &nbsp;
                                            <b
                                                className="text-uppercase"
                                            >
                                                {this.state.item.status}.
                                            </b>
                                            &nbsp;
                                            The new status is
                                            &nbsp;
                                            <b
                                                className="text-uppercase"
                                            >
                                                {this.state.textLeadStatus || this.props.selectedStatus}.
                                            </b>
                                        </p>
                                        <hr />
                                        <div className="row">
                                            {leadStatusBoxes}
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <h4>
                                            <strong>
                                                Current Lead Details
                                            </strong>
                                        </h4>
                                        <hr className="half-margins" />
                                        <ul className="list-icon angle-right">
                                            <li>
                                                <b>
                                                    Lead Type:
                                                    </b>
                                                {this.state.item.type}
                                                <br />
                                            </li>
                                            <li>
                                                <b>
                                                    Lead Status:
                                                    </b>
                                                {this.state.item.status}
                                                <br />
                                            </li>
                                            <li>
                                                <b>
                                                    Company Name:
                                                    </b>
                                                {this.state.item.company.name}
                                                <br />
                                            </li>
                                            <li>
                                                <b>
                                                    Company City/State:
                                                    </b>
                                                {`${this.state.item.company.city || ""},${this.state.item.company.state || ""}`}
                                                <br />
                                            </li>
                                            <li>
                                                <b>
                                                    Description:
                                                    </b>
                                                {this.state.item.leadIdDataExt.description}
                                                <br />
                                            </li>
                                            <li>
                                                <b>
                                                    Payment Type:
                                                    </b>
                                                {this.state.item.leadIdDataExt.paymentType}
                                                <br />
                                            </li>
                                            <li>
                                                <b>
                                                    Payment Amount:
                                                    </b>
                                                {this.state.item.leadIdDataExt.paymentAmount}
                                            </li>
                                        </ul>

                                        <LeadStatusChangeNotes
                                            updateLeadStatus={this.updateLeadStatus}
                                            onClick={this.undoChangesButton}
                                            noteItem={this.state.formData}
                                        />
                                        <button
                                            name='cancelButton'
                                            className="btn btn-sm btn-default pull-right"
                                            onClick={this.undoChangesButton}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}
export default LeadStatusChange