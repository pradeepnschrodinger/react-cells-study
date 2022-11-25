import React from "react";
import DefaultCell from './DefaultCell';

function ClassNameDecorator(Component) {
    return class ClassNameCell extends React.Component {
        render() {
            const className = (this.props.className || '') + ' custom-cell-class-name';

            return <Component {...this.props} className={className} />
        }
    }
}

function BgCellDecorator(Component) {
    return class BgCell extends React.Component {
        render() {
            const style = {
                ...this.props.style,
                background: 'lightblue',
            };

            return <Component {...this.props} style={style} />
        }
    }
}
    
function TooltipCellDecorator(Component) {
    return class TooltipCell extends React.Component {
        render() {
            return <Component
                {...this.props}
                title={"tooltip!"}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            />
        }
    }
}

function HoverActionCellDecorator(Component) {
    return class HoverActionCell extends React.Component {
        render() {
            return <Component
                {...this.props}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            />
        }

        onMouseEnter = () => {
            // console.log("Action dispatched!", this.props.rowIndex, this.props.columnIndex);
        }

        onMouseLeave = () => {
            // console.log("Action cancelled!", this.props.rowIndex, this.props.columnIndex);
        }
    }
}

function BorderCellDecorator(Component) {
    return class BorderCell extends React.Component {
        render() {
            const style = {
                ...this.props.style,
                border: '2px solid blue',
            };

            return <Component {...this.props} style={style} />
        }
    }
}

function PendingCellDecorator(Component) {
    return class PendingCell extends React.Component {
        state = {
            pending: false,
            pendingRevision: 0,
            rowIndex: null,
            columnIndex: null,
        }

        static getDerivedStateFromProps(props, state) {
            if (
                props.rowIndex !== state.rowIndex ||
                props.columnIndex !== state.columnIndex
            ) {
                return ({
                    pending: true,
                    pendingRevision: state.pendingRevision + 1,
                    rowIndex: props.rowIndex,
                    columnIndex: props.columnIndex,
                })
            }

            return null;
        }
        componentDidUpdate() {
            const currentPendingRevision = this.state.pendingRevision;
            if (this.state.pending) {
                setTimeout(() => {
                    if (currentPendingRevision === this.state.pendingRevision) {
                        this.setState({ pending: false });
                    }
                }, 1250)
            }
        }
        componentDidMount() {
            const currentPendingRevision = this.state.pendingRevision;
            if (this.state.pending) {
                setTimeout(() => {
                    if (currentPendingRevision === this.state.pendingRevision) {
                        this.setState({ pending: false });
                    }
                }, 1250)
            }
        }
        render() {
            let loadingIndicator = null;
            if (this.state.pending) {
                loadingIndicator = <div style={{
                    position: 'absolute',
                    zIndex: 1,
                    background: 'gray',
                    width: '100%',
                    fontSize: '10px',
                    fontColor: 'white',
                    display: 'flex',
                    alignItems: 'start',
                    justifyContent: 'center',
                }}> Loading... </div>;
            }
            return (
                <span>
                    {loadingIndicator}
                    <Component {...this.props} />
                </span>
            );
        }
    }
}

function compose(fn, var_args) {
    var functions = arguments;
    var length = functions.length;
    return function () {
        var result;
        if (length) {
            result = functions[length - 1].apply(this, arguments);
        }

        for (var i = length - 2; i >= 0; i--) {
            result = functions[i].call(this, result);
        }
        return result;
    };
};

const DefaultDecorations = compose(
    // PendingCellDecorator,
    ClassNameDecorator,
    BgCellDecorator,
    TooltipCellDecorator,
    HoverActionCellDecorator,
)

const OtherDecorations = compose(
    // PendingCellDecorator,
    BorderCellDecorator,
    TooltipCellDecorator,
    HoverActionCellDecorator,
)

const DefaultDecoratedCell = DefaultDecorations(DefaultCell);
const OtherDecoratedCell = OtherDecorations(DefaultCell);

function CellFactory(props) {
    const { columnIndex } = props;

    const DecoratedCell = columnIndex % 2 ? DefaultDecoratedCell : OtherDecoratedCell;
    // const DecoratedCell = DefaultDecoratedCell;
    return <DecoratedCell {...props} />;
}

export { CellFactory }
