import * as React from 'react';

export const Track = ({ className, included, vertical, offset, length }) => {
    const style: any = {
        visibility: included ? 'visible' : 'hidden',
    };

    if (vertical) {
        style.bottom = `${offset}%`;
        style.height = `${length}%`;
    } else {
        style.left = `${offset}%`;
        style.width = `${length}%`;
    }
    
    return <div className={className} style={style} />;
};


