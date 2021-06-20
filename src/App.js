import React from 'react'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Badge from 'react-bootstrap/Badge'


function dates(current) {
  var week = new Array();
  current.setDate((current.getDate() - current.getDay() + 1));
  for (var i = 0; i < 7; i++) {
    week.push(
      new Date(current)
    );
    current.setDate(current.getDate() + 1);
  }
  return week;
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      days: [],
      events: [],
      today: '',
      event: '',
      from: '',
      to: ''
    }
  }
  componentDidMount() {
    let date = new Date()
    this.setState({ days: dates(date), today: new Date() })
  }
  addEvent(bool) {
    let events = this.state.events
    let modalShow = this.state.modalShow
    if (bool) {
      if (typeof modalShow === 'string') {
        events[modalShow].title = this.state.event
        events[modalShow].to = this.state.to
        events[modalShow].from = this.state.from
      } else {
        events.push({
          title: this.state.event,
          from: this.state.from,
          to: this.state.to
        })
      }
    } else {
      events.splice(modalShow, 1)
    }
    this.setState({ events, modalShow: false, event: null, from: null, to: null })
  }
  changeWeek(bool) {
    let date = this.state.days[0]
    var prevweek = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
    var nextweek = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7)
    bool ? this.setState({ days: dates(prevweek) }) : this.setState({ days: dates(nextweek) })
  }
  render() {
    let { days, events, today, modalShow, event, from, to } = this.state
    return (
      <div className='container'>
        <Button variant="primary" onClick={() => this.setState({ modalShow: true })}>
          Add event
        </Button>
        {modalShow &&
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Title>{typeof modalShow === 'string' ? 'Edit event' : 'Add event'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Event name"
                  aria-label="Event name"
                  aria-describedby="basic-addon1"
                  value={event}
                  onChange={({ target: { value: input } }) => this.setState({ event: input })}
                />
              </InputGroup>
              <div className="mb-3">
                <span>from:</span>
                <input
                  className="float-right"
                  type='datetime-local'
                  value={from}
                  onChange={({ target: { value: input } }) => this.setState({ from: input })}
                />
              </div>
              <div className="mb-3">
                <span>to:</span>
                <input
                  className="float-right"
                  type='datetime-local'
                  value={to}
                  onChange={({ target: { value: input } }) => this.setState({ to: input })}
                />
              </div>
              <Button
                variant="primary"
                onClick={() => this.addEvent(true)}
                disabled={event == null ? true : from == null ? true : to == null ? true : event.length > 0 ? false : true}
              >
                {typeof modalShow === 'string' ? 'Edit event' : 'Add event'}
              </Button>
              {typeof modalShow === 'string' &&
                <Button
                  className="ml-3"
                  variant="primary"
                  onClick={() => this.addEvent(false)}
                >
                  Delete event
                </Button>
              }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => this.setState({ modalShow: false, event: null, from: null, to: null })}>Close</Button>
            </Modal.Footer>
          </Modal.Dialog>
        }
        <div className="mb-3" />
        <Button
          onClick={() => this.changeWeek(true)}
        >
          Prev week
        </Button>
        <Button
          className="float-right"
          onClick={() => this.changeWeek(false)}
        >
          Next week
        </Button>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th className="date">Date</th>
              <th>Event list</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(days).map(function (i) {
              return (
                <tr>
                  <td style={{ color: `${days[i].toDateString() == today.toDateString() ? 'red' : 'blue'}` }}>
                    {days[i].toDateString()}
                  </td>
                  <td>
                    {Object.keys(events).map(function (x) {
                      let day = 86400000
                      let eventStartDate = new Date(events[x].from).getTime() - day
                      let eventEndDate = new Date(events[x].to).getTime()
                      let actualDate = new Date(days[i]).getTime()
                      if ((+eventStartDate <= +actualDate) && (+eventEndDate >= +actualDate)) {
                        return (
                          <>
                            <Badge
                              pill
                              variant="primary"
                              style={{ cursor: 'pointer' }}
                              onClick={() => this.setState({
                                modalShow: x,
                                event: events[x].title,
                                from: events[x].from,
                                to: events[x].to
                              })}
                            >
                              {events[x].title}
                            </Badge>
                            <br />
                          </>
                        )
                      }
                    }.bind(this))}
                  </td>
                </tr>
              )
            }.bind(this)
            )}
          </tbody>
        </Table>
      </div >
    )
  }
}

export default App;
