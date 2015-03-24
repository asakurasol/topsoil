var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'react', 'socket.io-client'], function (require, exports, React, io) {
    var Output = (function (_super) {
        __extends(Output, _super);
        function Output(props) {
            _super.call(this, props);
            this.state = {
                log: []
            };
        }
        Output.prototype.setupStream = function () {
            var stream = io('http://localhost:8000');
            stream.on('output', function (data) {
                var log = this.state.log;
                this.state.log.push(data);
                var out = document.getElementById("logs");
                // scrollheight is total height, client height is height of box, scrolltop is distance from top of box to top of scroll height, the addition at end is a buffer factor
                var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 50;
                this.setState({ log: log });
                if (isScrolledToBottom) {
                    out.scrollTop = out.scrollHeight - out.clientHeight;
                }
            }.bind(this));
        };
        Output.prototype.componentDidMount = function () {
            this.setupStream();
        };
        Output.prototype.render = function () {
            var data = this.state.log.join('\n');
            return React.DOM.pre({ id: "logs" }, data);
        };
        return Output;
    })(React.Component);
    function Factory() {
        return React.createElement(Output);
    }
    React.render(Factory(), document.getElementById('output'));
});
// export = Factory;
