
function DecoratedCell({ children }) {
    return <children />
}

function CellFactory(props) {
    const { columnIndex } = props;

    return <DecoratedCell />
}

export { CellFactory }
