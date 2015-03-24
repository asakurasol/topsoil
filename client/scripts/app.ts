import React = require('react');
import io = require('socket.io-client');

interface Props { name: string; role: string; }

interface OutputState {
  log: string[]
}

class Output extends React.Component<Props, OutputState> {
  constructor(props: Props) {
    super(props);
  }
  setupStream() {
    var stream = io('http://localhost:8000');
    stream.on('data', function(data){
      var log : string[] = this.state.log;
      this.state.log.push(data);
      this.setState({log: log})

      var out = document.getElementById("logs");
      var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 5;
      console.log(isScrolledToBottom);
      if(isScrolledToBottom){
        out.scrollTop = out.scrollHeight - out.clientHeight;
      }
    }.bind(this))
  }
  public componentDidMount() {
    this.setupStream();
  }
  public state : OutputState = {
      log: []
  }
  public render() {
    console.log(this.state);
    var data : string = this.state.log.join('\n');
    return React.DOM.pre({id: "logs"}, data);
  }
}

function Factory() {
  return React.createElement(Output);
}


React.render(
  Factory(),
  document.getElementById('output')
);
// export = Factory;
