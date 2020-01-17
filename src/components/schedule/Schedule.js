import React, { Component } from 'react'
import { TextInput, Select, DatePicker, TimePicker, Button } from 'react-materialize';
import styles from './Schedule.module.css'
import Gateway from '../../lib/gateway'
import moment from 'moment'
import { isEmpty, isUndefined } from 'lodash'
import Message from '../Message/Message'

class Schedule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            rooms: [],
            userId: 1,
            roomId: 0,
            title: undefined,
            date: undefined,
            Start: undefined,
            End: undefined
        }
    }

    componentDidMount() {
        this.getRooms()
    }

    async getRooms() {
        const response = await Gateway.request("/rooms")

        this.setState({
            isLoading: false,
            rooms: response.data
        })
    }

    htmlRooms() {
        const { rooms, isLoading } = this.state

        const options = isLoading
            ? <option key="-1" value="-1">
                Carregando...
            </option>

            : rooms.map((value) =>
                <option key={value.roomId} value={value.roomId}>
                    {value.name}
                </option>
            )

        return (
            <Select id="list-roomid" className="list-room" defaultValue={0}>
                <option key="0" value="0">Selecione...</option>
                {options}
            </Select>
        )
    }

    handleChange(event) {
        const id = event.target.id
        const value = event.target.value

        const userId = 1
        const roomId = id === "list-roomid" ? value : this.state.roomId
        const title = id === "meeting-title" ? value : this.state.title

        this.setState({
            userId,
            roomId,
            title
        })
    }

    treatmentMsgResponse(data) {

        if (data.success) {
            Message.build('success', 'Reunião marcada com sucesso')
            return;
        }

        var msgError = isUndefined(data.errors)
            ? "<li>Não foi possível realizar o agendamento da reunião, por favor revise os dados de envio</li>"
            : data.errors.map((value) => `<li>${value}</li>`)

        Message.build('warning', msgError.toString().replace(",", ""));

    }

    async save(event) {
        event.preventDefault()

        if (!this.validate())
            return;

        const { userId, roomId, title, date, start, end } = this.state
        const currentText = event.target.innerHTML
        document.getElementById("btn-salvar").innerHTML = "Salvando..."

        const data = JSON.stringify({
            userId,
            roomId,
            title,
            date,
            start,
            end
        });

        const response = await Gateway.request(undefined, data, "POST")

        this.treatmentMsgResponse(response.data)
        document.getElementById("btn-salvar").innerHTML = currentText
    }

    setTime(h, m) {
        h = h < 10 ? `0${h}` : h
        return `${h}:${m}`
    }

    addMsgWarning(msg) {
        return `<li class="item-error">${msg}</li>`
    }

    validate() {
        const { roomId, title, date, start, end } = this.state
        var msgErrors = ""

        if (isEmpty(title))
            msgErrors += this.addMsgWarning("Informe o título da reunião")

        if (roomId <= 0)
            msgErrors += this.addMsgWarning("Informe a sala da reunião")

        if (isUndefined(date))
            msgErrors += this.addMsgWarning("Informe a data da reunião")

        if (isUndefined(start))
            msgErrors += this.addMsgWarning("Informe a hora de início da reunião")

        if (isUndefined(end))
            msgErrors += this.addMsgWarning("Informe a hora de término da reunião")

        if (msgErrors.length > 0)
            Message.build('warning', msgErrors)

        return msgErrors.length === 0
    }

    render() {
        return (
            <div className={styles.container_schedule}>
                <form onChange={(e) => this.handleChange(e)}>
                    <div className="container-fields">
                        <TextInput id="meeting-title" label="Título reunião" />
                        {this.htmlRooms()}

                        <div className="container-date">

                            <DatePicker
                                id="meeting-date"
                                label="Data da reunião"
                                onChange={(d) => this.setState({ date: moment(d).format("YYYY-MM-DD") })} />

                            <TimePicker
                                options={{ twelveHour: false }}
                                id="meeting-start"
                                label="Início da reunião"
                                onChange={(h, m) => this.setState({ start: this.setTime(h, m) })}
                            />
                            <TimePicker
                                options={{ twelveHour: false }}
                                id="meeting-end"
                                label="Fim da reunião"
                                onChange={(h, m) => this.setState({ end: this.setTime(h, m) })}
                            />
                        </div>
                        <div className={styles.container_footer}>
                            <Button id="btn-salvar" onClick={(e) => this.save(e)}>Salvar</Button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default Schedule


