import React, { useCallback, useEffect, useRef, useState } from "react";
import DefaultCell from './DefaultCell';

function useClassName(props) {
    const className = (props.className || '') + ' custom-cell-class-name';

    props = {
        ...props,
        className,
    };

    return { props }
}

function useBg(props) {
    const style = {
        ...props.style,
        background: 'lightblue',
    };

    props = {
        ...props,
        style,
    };

    return { props };
}

function useTooltip(props) {
    props = {
        ...props,
        title: "tooltip",
    };

    return { props };
}

function useHoverAction(props) {
    const onMouseEnter = useCallback(() => {
        // console.log("Action dispatched!", props.rowIndex, props.columnIndex);
    }, [props.rowIndex, props.columnIndex]);
    
    const onMouseLeave = useCallback(() => {
        // console.log("Action cancelled!", props.rowIndex, props.columnIndex);
    }, [props.rowIndex, props.columnIndex]);

    props = {
        ...props,
        onMouseEnter,
        onMouseLeave,
    };

    return { props };
}

function useBorder(props) {
    const style = {
        ...props.style,
        border: '2px solid blue',
    };

    props = {
        ...props,
        style,
    };

    return { props }
}

function usePending(props, Component) {
    const [pending, setPending] = useState(false);
    const pendingRevisionObj = useRef({ counter: 0 });
    const [rowIndex, setRowIndex] = useState(null);
    const [columnIndex, setColumnIndex] = useState(null);

    if (props.rowIndex !== rowIndex || props.columnIndex !== columnIndex) {
        setRowIndex(props.rowIndex);
        setColumnIndex(props.columnIndex);
        setPending(true);
        pendingRevisionObj.counter++;
    }

    useEffect(() => {
        const currentPendingRevision = pendingRevisionObj.counter;
        if (pending) {
            setTimeout(() => {
                if (pendingRevisionObj.counter === currentPendingRevision) {
                    setPending(false);
                }
            }, 1250);
        }
    }, [pending]);

    let loadingIndicator = null;
    if (pending) {
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

    const PendingComponent = (parentProps) => (
        <span>
            {loadingIndicator}
            <Component {...parentProps} />
        </span>
    );

    return {
        props,
        Component: PendingComponent,
    };
}

const defaultDecorations = [
    usePending,
    useClassName,
    useBg,
    useTooltip,
    useHoverAction,
]

const otherDecorations = [
    usePending,
    useBorder,
    useTooltip,
    useHoverAction,
]

function ComposeHookDecorators(decorations, Component) {
    return (props) => {
        let CurrentComponent = Component;
        for (let i = decorations.length - 1; i >= 0; i--) {
            const decorationData = decorations[i](props, CurrentComponent);
            
            props = decorationData.props || props;
            CurrentComponent = decorationData.Component || CurrentComponent;
        }
        return <CurrentComponent {...props} />;
    }
}

const DefaultDecoratedCell = ComposeHookDecorators(defaultDecorations, DefaultCell);
const OtherDecoratedCell = ComposeHookDecorators(otherDecorations, DefaultCell);

function CellFactory(props) {
    const { columnIndex } = props;

    const DecoratedCell = columnIndex % 2 ? DefaultDecoratedCell : OtherDecoratedCell;
    // const DecoratedCell = DefaultDecoratedCell;
    return <DecoratedCell {...props} />;
}

export { CellFactory }
