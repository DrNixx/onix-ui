import * as React from 'react';
import * as classNames from 'classnames';
import { ConnectionStatus } from '../../Types';
import { SafeAnchor } from './SafeAnchor';

interface ConnectionInfoProps  {
    status: ConnectionStatus
}

const names = ['Offline', 'Connect', 'Online', 'Offline'];
const classes = ['gray', 'yellow', 'green', 'red'];

export class ConnectionInfo extends React.Component<ConnectionInfoProps, {}> {
    constructor(props: ConnectionInfoProps, context) {
        super(props, context);
    }

    onClick = (e) => {

    }

    render() {
        const { onClick, props } = this;
        const { status } = props;
        
        const name = names[status];
        const classc = classes[status];

        return (
            <span><SafeAnchor href="#" onClick={onClick} >
                    <div className={classNames('status-icon', classc)}></div> {name}
            </SafeAnchor></span>
        );    
    }
}