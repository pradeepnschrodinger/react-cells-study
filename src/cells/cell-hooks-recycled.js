import React, { useCallback, useEffect, useRef, useState } from "react";
import DefaultCell from './DefaultCell';

function useClassName(props, Component, enabled) {
    if (enabled) {
        const className = (props.className || '') + ' custom-cell-class-name';

        props = {
            ...props,
            className,
        };    
    }

    return { props }
}

function useBg(props, Component, enabled) {
    if (enabled) {
        const style = {
            ...props.style,
            background: 'lightblue',
        };
    
        props = {
            ...props,
            style,
        };
    }

    return { props };
}

function useTooltip(props, Component, enabled) {
    if (enabled) {
        props = {
            ...props,
            title: "tooltip",
        };
    }

    return { props };
}

function useHoverAction(props, Component, enabled) {
    const onMouseEnter = useCallback(() => {
        // console.log("Action dispatched!", props.rowIndex, props.columnIndex);
    }, [props.rowIndex, props.columnIndex]);
    
    const onMouseLeave = useCallback(() => {
        // console.log("Action cancelled!", props.rowIndex, props.columnIndex);
    }, [props.rowIndex, props.columnIndex]);

    if (enabled) {
        props = {
            ...props,
            onMouseEnter,
            onMouseLeave,
        };
    }

    return { props };
}

function useBorder(props, Component, enabled) {
    if (enabled) {
        const style = {
            ...props.style,
            border: '2px solid blue',
        };
    
        props = {
            ...props,
            style,
        };
    
    }
    return { props }
}

function PendingComponent(allProps) {
    const { loadingIndicator, Component, ...props } = allProps;
    return <span>
        {loadingIndicator}
        <Component {...props} />
    </span>
}

function usePending(props, Component, enabled) {
    const [pending, setPending] = useState(false);
    const pendingRevisionObj = useRef(0);
    const [rowIndex, setRowIndex] = useState(null);
    const [columnIndex, setColumnIndex] = useState(null);

    if (enabled) {
        if (props.rowIndex !== rowIndex || props.columnIndex !== columnIndex) {
            setRowIndex(props.rowIndex);
            setColumnIndex(props.columnIndex);
            setPending(true);
            pendingRevisionObj.current++;
        }
    }

    useEffect(() => {
        if (!enabled) {
            return;
        }
        const currentPendingRevision = pendingRevisionObj.current;
        if (pending) {
            setTimeout(() => {
                if (pendingRevisionObj.current === currentPendingRevision) {
                    setPending(false);
                }
            }, 1250);
        }
    }, [enabled, pending, pendingRevisionObj.current]);

    let loadingIndicator = null;
    if (enabled && pending) {
        loadingIndicator = (
            <div style={{
                position: 'absolute',
                zIndex: 1,
                background: 'gray',
                width: '100%',
                fontSize: '10px',
                fontColor: 'white',
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'center',
            }}> 
                Loading... 
            </div>
        )
    }

    props = {
        ...props,
        loadingIndicator,
        Component,
    };

    return {
        props,
        Component: PendingComponent,
    };
}

const AllOrderedDecorations = new Map([
    [usePending, usePending],
    [useBorder, useBorder],
    [useClassName, useClassName],
    [useBg, useBg],
    [useTooltip, useTooltip],
    [useHoverAction, useHoverAction],
]);

const defaultDecorations = new Set([
    usePending,
    useClassName,
    useBg,
    useTooltip,
    useHoverAction,
]);

const otherDecorations = new Set([
    usePending,
    useBorder,
    useTooltip,
    useHoverAction,
])

function ComposeDecorations(props) {
    let CurrentComponent = DefaultCell;
    AllOrderedDecorations.forEach((decoration, decorationKey) => {
        const decorationEnabled = props.decorations.has(decorationKey);
        const decorationData = decoration(props, CurrentComponent, decorationEnabled);
        
        props = decorationData.props || props;
        CurrentComponent = decorationData.Component || CurrentComponent;
    })
    return <CurrentComponent {...props} />;
}

function CellFactory(props) {
    const { columnIndex } = props;

    const decorations = columnIndex % 2 ? defaultDecorations : otherDecorations;
    return <ComposeDecorations decorations={decorations} {...props} />;
}

export { CellFactory }
