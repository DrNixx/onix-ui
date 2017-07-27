import * as React from 'react';

export type TabSelectHandler = (key: string | number, event?: React.SyntheticEvent<any>) => void;

export type TabContentType = {
    animation?: boolean | React.ReactType,
    activeKey?: string | number,
    unmountOnExit?: boolean,
    onPaneEnter: Function,
    onPaneExited: Function,
    exiting: boolean,
}

export type TabContainerType = {
    getId?: Function,
    unmountOnExit?: boolean,
    activeKey?: string | number,
    onSelect: TabSelectHandler,
    getTabId: (key) => string,
    getPaneId: (key) => string,
}

export type TabContextType = {
    $bs_tabContent?: TabContentType,
    $bs_tabContainer?: TabContainerType,
}